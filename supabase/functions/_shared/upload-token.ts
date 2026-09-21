const encoder = new TextEncoder()

type UploadGrant = {
  submissionId: string
  attachmentId: string
  storagePath: string
  originalFilename: string
  mimeType: string | null
  fileSizeBytes: number
  exp: number
}

function secretBytes(): Uint8Array {
  const secret = (Deno.env.get("UPLOAD_TOKEN_SECRET") ?? Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "").trim()
  if (!secret) throw new Error("Missing upload token secret")
  return encoder.encode(secret)
}

async function hmacKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey("raw", secretBytes(), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"])
}

function b64url(bytes: ArrayBuffer | Uint8Array): string {
  const bin = String.fromCharCode(...new Uint8Array(bytes))
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "")
}

function fromB64url(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((value.length + 3) % 4)
  const bin = atob(padded)
  return Uint8Array.from(bin, (ch) => ch.charCodeAt(0))
}

function canonical(grant: UploadGrant): string {
  return [
    grant.submissionId,
    grant.attachmentId,
    grant.storagePath,
    grant.originalFilename,
    grant.mimeType ?? "",
    String(grant.fileSizeBytes),
    String(grant.exp),
  ].join("|")
}

export async function signUploadGrant(grant: Omit<UploadGrant, "exp">, ttlSeconds = 1800): Promise<string> {
  const full: UploadGrant = { ...grant, exp: Math.floor(Date.now() / 1000) + ttlSeconds }
  const key = await hmacKey()
  const payload = b64url(encoder.encode(JSON.stringify(full)))
  const sig = b64url(await crypto.subtle.sign("HMAC", key, encoder.encode(canonical(full))))
  return `${payload}.${sig}`
}

export async function verifyUploadGrant(token: unknown): Promise<UploadGrant | null> {
  if (typeof token !== "string" || !token.includes(".")) return null
  const [payloadPart, sigPart] = token.split(".")
  if (!payloadPart || !sigPart) return null
  let grant: UploadGrant
  try {
    grant = JSON.parse(new TextDecoder().decode(fromB64url(payloadPart))) as UploadGrant
  } catch {
    return null
  }
  if (!grant.submissionId || !grant.attachmentId || !grant.storagePath || !grant.originalFilename) return null
  if (typeof grant.exp !== "number" || grant.exp < Math.floor(Date.now() / 1000)) return null
  const key = await hmacKey()
  const expected = new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(canonical(grant))))
  const actual = fromB64url(sigPart)
  if (expected.byteLength !== actual.byteLength) return null
  let diff = 0
  for (let i = 0; i < expected.byteLength; i += 1) diff |= expected[i] ^ actual[i]
  if (diff !== 0) return null
  if (!grant.storagePath.startsWith(`rfq/${grant.submissionId}/${grant.attachmentId}/`)) return null
  if (grant.storagePath.includes("..")) return null
  return grant
}
