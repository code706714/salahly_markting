#!/usr/bin/env python3
"""
يحفظ صوت جاي من Speko (أداة mcp__Speko__audio_synthesize) كملف سطر جاهز للفيديو:
  - بيفك الـ base64 (أو بياخد ملف wav/mp3 جاهز)
  - بيقصّ الصمت من الأول والآخر
  - بيظبط مستوى الصوت على -17 LUFS (+ limiter) ويحوّله mp3 44.1k mono
  - بيكتبه في assets/audio/<video>/<line-id>.mp3

الاستخدام (قايمة JSON من [المصدر, الفيديو, id السطر]):
  python3 scripts/save_speko_audio.py '[["/path/to/tool-result.txt","PickYourPrice","pa"],["/tmp/clip.wav","PickYourPrice","pb"]]'

المصدر ممكن يكون:
  * ملف الـ tool-result (JSON فيه audio_base64) — لما الرد الكبير بيتحفظ لوحده في ملف
  * ملف wav/mp3 (مثلاً نزّلته من حقل url بـ curl) — لما الرد الصغير بيرجع inline
بعد كده: python3 scripts/generate_voice.py <Video> --provider local   (بيحسب المدد ويكتب timing.json)
"""
import base64
import json
import pathlib
import re
import subprocess
import sys
import tempfile

ROOT = pathlib.Path(__file__).resolve().parent.parent
TARGET_LUFS = -17.0


def _lufs(path: pathlib.Path) -> float:
    out = subprocess.run(
        ["ffmpeg", "-hide_banner", "-nostats", "-i", str(path), "-af", "ebur128", "-f", "null", "-"],
        capture_output=True, text=True,
    ).stderr
    return float(re.findall(r"I:\s+(-?[\d.]+) LUFS", out)[-1])


def save(src: str, video: str, line_id: str, out_root: pathlib.Path = ROOT / "assets" / "audio"):
    src_path = pathlib.Path(src)
    out = out_root / video / f"{line_id}.mp3"
    out.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as td:
        raw = pathlib.Path(td) / "raw.wav"
        if src_path.suffix.lower() in (".wav", ".mp3"):
            raw.write_bytes(src_path.read_bytes())
            in_file = raw if src_path.suffix.lower() == ".wav" else src_path
        else:
            data = json.loads(src_path.read_text(encoding="utf-8"))
            raw.write_bytes(base64.b64decode(data["audio_base64"]))
            in_file = raw
        trimmed = pathlib.Path(td) / "t.mp3"
        # قص الصمت من الأول والآخر (reverse trick) + upsample + mono
        af = ("silenceremove=start_periods=1:start_threshold=-48dB:start_silence=0.04,areverse,"
              "silenceremove=start_periods=1:start_threshold=-48dB:start_silence=0.12,areverse")
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(in_file), "-af", af, "-ar", "44100", "-ac", "1",
                        "-codec:a", "libmp3lame", "-b:a", "128k", str(trimmed)], check=True)
        gain = TARGET_LUFS - _lufs(trimmed)
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(trimmed), "-af",
                        f"volume={gain:.2f}dB,alimiter=limit=0.89:level=disabled", "-codec:a", "libmp3lame",
                        "-b:a", "128k", "-ar", "44100", "-ac", "1", str(out)], check=True)
    dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", str(out)],
                               capture_output=True, text=True).stdout)
    print(f"{video}/{line_id}: {dur:.2f}s  ({_lufs(out):.1f} LUFS) -> {out}")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    for item in json.loads(sys.argv[1]):
        save(*item)
