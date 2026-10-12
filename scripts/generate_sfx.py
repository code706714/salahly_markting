#!/usr/bin/env python3
"""
يولّد sound effects (whoosh / pop / ding) وموسيقى خلفية بسيطة بدون أي ملفات خارجية
(كله synthesized بالكود، فمفيش مشاكل ترخيص).

  python3 scripts/generate_sfx.py            # sfx + موسيقى placeholder
  python3 scripts/generate_sfx.py --no-music # sfx بس (ومتلمسش assets/music.mp3)

الموسيقى: لو عندك مزيكا حقيقية حطها في assets/music.mp3 وشغّل بـ --no-music.
"""
import argparse
import math
import random
import struct
import subprocess
import sys
import wave
from pathlib import Path

# كونسول ويندوز مش بيطبع عربي من غير كده
for _s in (sys.stdout, sys.stderr):
    try:
        _s.reconfigure(encoding="utf-8")
    except Exception:
        pass

ROOT = Path(__file__).resolve().parent.parent
SFX_DIR = ROOT / "assets" / "sfx"
SR = 44100


def write_wav(path: Path, samples):
    peak = max(1e-9, max(abs(s) for s in samples))
    scale = 0.9 / peak if peak > 0.9 else 1.0
    with wave.open(str(path), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(b"".join(struct.pack("<h", int(max(-1, min(1, s * scale)) * 32767)) for s in samples))


def whoosh(dur=0.55):
    rnd = random.Random(7)
    n = int(SR * dur)
    out, lp = [], 0.0
    for i in range(n):
        t = i / n
        env = math.sin(math.pi * t) ** 1.6
        # فلتر low-pass بيفتح ويقفل = إحساس الحركة
        a = 0.04 + 0.5 * math.sin(math.pi * t)
        lp += a * ((rnd.random() * 2 - 1) - lp)
        out.append(lp * env * 1.6)
    return out


def pop(dur=0.18):
    n = int(SR * dur)
    out, phase = [], 0.0
    for i in range(n):
        t = i / SR
        f = 900 * math.exp(-t * 28) + 180
        phase += 2 * math.pi * f / SR
        out.append(math.sin(phase) * math.exp(-t * 22))
    return out


def ding(dur=1.1):
    n = int(SR * dur)
    out = []
    for i in range(n):
        t = i / SR
        s = (math.sin(2 * math.pi * 1318.5 * t) * 0.6
             + math.sin(2 * math.pi * 1318.5 * 2.76 * t) * 0.2
             + math.sin(2 * math.pi * 1318.5 * 5.4 * t) * 0.08)
        out.append(s * math.exp(-t * 4.5) * min(1, t * 400))
    return out


def music(dur=32.0, bpm=96):
    """لوب هادي: pad + arpeggio على سلّم بنتاتوني. بيتكرر في الفيديو."""
    n = int(SR * dur)
    beat = 60 / bpm
    chords = [(220.0, 277.18, 329.63), (174.61, 220.0, 261.63), (196.0, 246.94, 293.66), (164.81, 207.65, 246.94)]
    arp = [0, 1, 2, 1]
    out = [0.0] * n
    bar = beat * 4
    for i in range(n):
        t = i / SR
        ch = chords[int(t / bar) % len(chords)]
        pad = sum(math.sin(2 * math.pi * f * t) for f in ch) * 0.07
        bt = t % beat
        note = ch[arp[int(t / beat) % 4]] * 2
        pluck = math.sin(2 * math.pi * note * t) * math.exp(-bt * 7) * 0.12
        kick = math.sin(2 * math.pi * (60 + 80 * math.exp(-bt * 30)) * bt) * math.exp(-bt * 12) * 0.12 if int(t / beat) % 2 == 0 else 0
        out[i] = pad + pluck + kick
    # fade طرفين عشان اللوب يبقى ناعم
    f = int(SR * 0.05)
    for i in range(f):
        out[i] *= i / f
        out[n - 1 - i] *= i / f
    return out


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawTextHelpFormatter)
    ap.add_argument("--no-music", action="store_true")
    args = ap.parse_args()

    SFX_DIR.mkdir(parents=True, exist_ok=True)
    for name, fn in (("whoosh", whoosh), ("pop", pop), ("ding", ding)):
        write_wav(SFX_DIR / f"{name}.wav", fn())
        print("sfx:", SFX_DIR / f"{name}.wav")

    if not args.no_music:
        tmp = ROOT / "assets" / "_music_tmp.wav"
        write_wav(tmp, music())
        subprocess.run(
            ["ffmpeg", "-y", "-loglevel", "error", "-i", str(tmp),
             # عالية عن قصد: الفيديو بيشغّلها على 15%، فلو الملف خافت مش هتتسمع
             "-af", "loudnorm=I=-12:TP=-1.5:LRA=7",
             "-codec:a", "libmp3lame", "-b:a", "128k",
             str(ROOT / "assets" / "music.mp3")],
            check=True,
        )
        tmp.unlink()
        print("music:", ROOT / "assets" / "music.mp3", "(placeholder — بدّله بمزيكاك)")


if __name__ == "__main__":
    main()
