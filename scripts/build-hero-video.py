"""Build a short cinematic hero loop from IMAPL facility photographs."""

from __future__ import annotations

import subprocess
from pathlib import Path

import imageio_ffmpeg
import numpy as np
from PIL import Image, ImageEnhance

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "videos" / "hero-manufacturing.mp4"

W, H = 1280, 720
FPS = 24
SCENE_SECONDS = 5.0
FADE_SECONDS = 1.0
SCENE_FRAMES = int(SCENE_SECONDS * FPS)
FADE_FRAMES = int(FADE_SECONDS * FPS)

SCENES = [
    (ROOT / "public/images/facilities/facility.png", 1.00, 1.12, 0.42, 0.62),
    (ROOT / "public/images/facilities/facility-3.jpg", 1.08, 1.00, 0.50, 0.38),
    (ROOT / "public/images/facilities/facility-2.jpg", 1.02, 1.10, 0.46, 0.52),
    (ROOT / "public/images/capabilities/manufacturing.png", 1.04, 1.14, 0.50, 0.58),
]


def cover_canvas(path: Path, overscan: float = 1.28) -> np.ndarray:
    image = Image.open(path).convert("RGB")
    target_w, target_h = int(W * overscan), int(H * overscan)
    scale = max(target_w / image.width, target_h / image.height)
    resized = image.resize(
        (max(1, int(image.width * scale)), max(1, int(image.height * scale))),
        Image.Resampling.LANCZOS,
    )
    left = max(0, (resized.width - target_w) // 2)
    top = max(0, (resized.height - target_h) // 2)
    cropped = resized.crop((left, top, left + target_w, top + target_h))
    return np.asarray(cropped, dtype=np.uint8)


def window(base: np.ndarray, zoom: float, cx: float, cy: float) -> np.ndarray:
    zoom = max(1.0, zoom)
    window_w = min(base.shape[1], max(W, int(W * 1.28 / zoom)))
    window_h = min(base.shape[0], max(H, int(H * 1.28 / zoom)))
    max_x = max(0, base.shape[1] - window_w)
    max_y = max(0, base.shape[0] - window_h)
    x = int(max_x * cx)
    y = int(max_y * cy)
    crop = base[y : y + window_h, x : x + window_w]
    frame = Image.fromarray(crop).resize((W, H), Image.Resampling.LANCZOS)
    return np.asarray(frame, dtype=np.uint8)


def grade(frame: np.ndarray) -> np.ndarray:
    image = Image.fromarray(frame)
    image = ImageEnhance.Brightness(image).enhance(0.78)
    image = ImageEnhance.Contrast(image).enhance(1.12)
    image = ImageEnhance.Color(image).enhance(0.82)
    arr = np.asarray(image, dtype=np.float32)
    arr[..., 0] *= 0.86
    arr[..., 1] *= 0.94
    arr[..., 2] *= 1.06
    yy, xx = np.mgrid[0:H, 0:W]
    nx = (xx / (W - 1) - 0.5) * 2
    ny = (yy / (H - 1) - 0.5) * 2
    vignette = 1.0 - 0.28 * np.clip(nx * nx + ny * ny, 0, 1)
    arr *= vignette[..., None]
    return np.clip(arr, 0, 255).astype(np.uint8)


def scene_frames(path: Path, z0: float, z1: float, x: float, y: float) -> list[np.ndarray]:
    base = cover_canvas(path)
    frames: list[np.ndarray] = []
    for i in range(SCENE_FRAMES):
        t = i / max(1, SCENE_FRAMES - 1)
        eased = t * t * (3 - 2 * t)
        zoom = z0 + (z1 - z0) * eased
        frames.append(grade(window(base, zoom, x, y)))
    return frames


def crossfade(a: np.ndarray, b: np.ndarray, t: float) -> np.ndarray:
    mix = a.astype(np.float32) * (1 - t) + b.astype(np.float32) * t
    return np.clip(mix, 0, 255).astype(np.uint8)


def main() -> None:
    OUT.parent.mkdir(parents=True, exist_ok=True)
    scenes = [scene_frames(*scene) for scene in SCENES]

    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    command = [
        ffmpeg,
        "-y",
        "-f",
        "rawvideo",
        "-vcodec",
        "rawvideo",
        "-pix_fmt",
        "rgb24",
        "-s",
        f"{W}x{H}",
        "-r",
        str(FPS),
        "-i",
        "-",
        "-an",
        "-c:v",
        "libx264",
        "-preset",
        "medium",
        "-crf",
        "26",
        "-pix_fmt",
        "yuv420p",
        "-movflags",
        "+faststart",
        str(OUT),
    ]
    process = subprocess.Popen(command, stdin=subprocess.PIPE)

    count = len(scenes)
    written = 0
    for index, frames in enumerate(scenes):
        nxt = scenes[(index + 1) % count]
        hold = SCENE_FRAMES - FADE_FRAMES
        for frame in frames[:hold]:
            process.stdin.write(frame.tobytes())
            written += 1
        for fade_i in range(FADE_FRAMES):
            t = (fade_i + 1) / FADE_FRAMES
            process.stdin.write(crossfade(frames[hold + fade_i], nxt[fade_i], t).tobytes())
            written += 1

    process.stdin.close()
    code = process.wait()
    if code != 0:
        raise SystemExit(f"ffmpeg failed with {code}")
    print(f"wrote {OUT} ({OUT.stat().st_size / 1e6:.2f} MB, {written} frames)")


if __name__ == "__main__":
    main()
