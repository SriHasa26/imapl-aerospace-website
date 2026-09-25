interface Props {
  title: string
}

export default function UnconfirmedNote({ title }: Props) {
  return (
    <p className="font-mono text-xs text-cyan uppercase tracking-wider mb-3">
      {title} — owner / legal confirmation required
    </p>
  )
}
