#!/usr/bin/env python3
"""
يولّد صوت كل سطر في script.json (edge-tts) ويكتب timing.json جنب كل فيديو.

  python3 scripts/generate_voice.py              # كل الفيديوهات
  python3 scripts/generate_voice.py ac-scam      # فيديو واحد
  python3 scripts/generate_voice.py --offline    # بدون إنترنت: صوت صامت + توقيت تقديري (للتجربة بس)
  python3 scripts/generate_voice.py --provider azure
      # نفس أصوات ar-EG-Shakir/Salma من Azure Speech الرسمي (لو edge-tts واقع — شوف README)
      # محتاج: AZURE_SPEECH_KEY و AZURE_SPEECH_REGION (مثلاً westeurope)

الناتج:
  assets/audio/<video>/<line-id>.mp3
  src/videos/<video>/timing.json   (مدة كل سطر + توقيت كل كلمة، والفيديو بيتظبط عليه تلقائي)
"""
import argparse
import asyncio
import json
import os
import subprocess
import sys
from pathlib import Path

# كونسول ويندوز مش بيطبع عربي من غير كده
for _s in (sys.stdout, sys.stderr):
    try:
        _s.reconfigure(encoding="utf-8")
    except Exception:
        pass

ROOT = Path(__file__).resolve().parent.parent
VIDEOS_DIR = ROOT / "src" / "videos"
AUDIO_DIR = ROOT / "assets" / "audio"

VOICES = {
    "man": "ar-EG-ShakirNeural",
    "woman": "ar-EG-SalmaNeural",
}
TICKS_PER_SECOND = 10_000_000  # edge-tts بيرجّع الوقت بوحدات 100ns


def mp3_duration(path: Path) -> float:
    try:
        from mutagen.mp3 import MP3

        return float(MP3(str(path)).info.length)
    except Exception:
        out = subprocess.run(
            ["ffprobe", "-v", "error", "-show_entries", "format=duration",
             "-of", "default=nw=1:nk=1", str(path)],
            capture_output=True, text=True, check=True,
        ).stdout.strip()
        return float(out)


def spread_words(text: str, duration: float):
    """توزيع تقديري للكلمات على المدة حسب عدد الحروف (لو مفيش WordBoundary)."""
    words = text.split()
    weights = [max(len(w), 2) for w in words]
    total = sum(weights)
    t = 0.0
    result = []
    for w, wt in zip(words, weights):
        d = duration * wt / total
        result.append({"text": w, "start": round(t, 3), "end": round(t + d, 3)})
        t += d
    return result


async def synth_edge(text: str, voice: str, rate: str, out_path: Path):
    import edge_tts

    # aiohttp مش بيقرا HTTPS_PROXY لوحده، فبنمرره صريح لو موجود
    proxy = os.environ.get("HTTPS_PROXY") or os.environ.get("https_proxy")
    comm = edge_tts.Communicate(text, voice, rate=rate, boundary="WordBoundary", proxy=proxy)
    audio = bytearray()
    events = []
    async for chunk in comm.stream():
        if chunk["type"] == "audio":
            audio.extend(chunk["data"])
        elif chunk["type"] == "WordBoundary":
            start = chunk["offset"] / TICKS_PER_SECOND
            events.append({
                "text": chunk["text"],
                "start": round(start, 3),
                "end": round(start + chunk["duration"] / TICKS_PER_SECOND, 3),
            })
    if not audio:
        raise RuntimeError("edge-tts رجّع صوت فاضي")
    out_path.write_bytes(bytes(audio))
    duration = mp3_duration(out_path)

    original = text.split()
    if events and len(events) == len(original):
        # نحافظ على الكلمات الأصلية (بعلامات الترقيم) ونستخدم توقيت الصوت
        words = [{**e, "text": w} for e, w in zip(events, original)]
    elif events:
        words = events
    else:
        words = spread_words(text, duration)
    return duration, words


def _azure_request(text: str, voice: str, rate: str) -> bytes:
    import urllib.error
    import urllib.request
    from xml.sax.saxutils import escape

    key = os.environ.get("AZURE_SPEECH_KEY")
    region = os.environ.get("AZURE_SPEECH_REGION")
    endpoint = os.environ.get("AZURE_SPEECH_ENDPOINT")  # اختياري (للتجارب)
    if not key or not (region or endpoint):
        sys.exit("محتاج تحط AZURE_SPEECH_KEY و AZURE_SPEECH_REGION (شوف README: Azure Speech).")
    url = endpoint or f"https://{region}.tts.speech.microsoft.com/cognitiveservices/v1"
    ssml = (
        "<speak version='1.0' xml:lang='ar-EG' xmlns='http://www.w3.org/2001/10/synthesis'>"
        f"<voice name='{voice}'><prosody rate='{rate}'>{escape(text)}</prosody></voice></speak>"
    )
    req = urllib.request.Request(
        url,
        data=ssml.encode("utf-8"),
        headers={
            "Ocp-Apim-Subscription-Key": key,
            "Content-Type": "application/ssml+xml",
            "X-Microsoft-OutputFormat": "audio-24khz-48kbitrate-mono-mp3",
            "User-Agent": "salahly-ads",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            return r.read()
    except urllib.error.HTTPError as e:
        sys.exit(f"Azure Speech رجّع {e.code}: {e.read()[:200]!r}")


async def synth_azure(text: str, voice: str, rate: str, out_path: Path):
    audio = await asyncio.to_thread(_azure_request, text, voice, rate)
    if not audio:
        raise RuntimeError("Azure رجّع صوت فاضي")
    out_path.write_bytes(audio)
    duration = mp3_duration(out_path)
    # REST مفيهوش توقيت كلمات، فبنوزعها حسب عدد الحروف
    return duration, spread_words(text, duration)


EDGE_BROKEN_HELP = """
!! edge-tts رجّع 403 من سيرفر مايكروسوفت.
   ده عطل من ناحيتهم (بدأ حوالي 10 أكتوبر 2026) وبيصيب ناس كتير: https://github.com/rany2/edge-tts/issues/490
   حلول:
   1) استنى لحد ما edge-tts يتحدّث:  pip install -U edge-tts   وجرّب تاني بعد كام ساعة/يوم
   2) شغّل VPN بخروج أمريكي (أو اضبط HTTPS_PROXY) — ناس كتير قالت إنه بيحلها
   3) استخدم Azure Speech (نفس الأصوات):  python3 scripts/generate_voice.py --provider azure
"""


def synth_offline(text: str, out_path: Path):
    """صوت صامت بمدة تقديرية (~ 0.34 ثانية للكلمة) عشان نجرّب الرندر من غير إنترنت."""
    duration = round(max(1.2, len(text.split()) * 0.34 + 0.3), 3)
    subprocess.run(
        ["ffmpeg", "-y", "-loglevel", "error", "-f", "lavfi",
         "-i", "anullsrc=r=24000:cl=mono", "-t", str(duration),
         "-codec:a", "libmp3lame", "-b:a", "48k", str(out_path)],
        check=True,
    )
    return duration, spread_words(text, duration)


async def process_video(video_dir: Path, offline: bool, rate: str, provider: str):
    script = json.loads((video_dir / "script.json").read_text(encoding="utf-8"))
    vid = video_dir.name
    out_dir = AUDIO_DIR / vid
    out_dir.mkdir(parents=True, exist_ok=True)

    lines_out = []
    for line in script["lines"]:
        speaker = line["speaker"]
        if speaker not in VOICES:
            sys.exit(f"[{vid}] speaker غلط في السطر {line['id']}: {speaker} (man أو woman)")
        out_path = out_dir / f"{line['id']}.mp3"
        if offline:
            duration, words = synth_offline(line["text"], out_path)
        else:
            synth = synth_azure if provider == "azure" else synth_edge
            try:
                duration, words = await synth(
                    line["text"], VOICES[speaker], line.get("rate", rate), out_path
                )
            except Exception as e:  # edge-tts: WSServerHandshakeError 403
                if provider == "edge" and "403" in str(e):
                    sys.exit(EDGE_BROKEN_HELP)
                raise
        print(f"  [{vid}] {line['id']:<10} {speaker:<6} {duration:5.2f}s  {line['text']}")
        lines_out.append({
            "id": line["id"],
            "speaker": speaker,
            "text": line["text"],
            "file": f"audio/{vid}/{line['id']}.mp3",
            "duration": round(duration, 3),
            "words": words,
        })

    timing = {"video": vid, "synthetic": offline, "lines": lines_out}
    (video_dir / "timing.json").write_text(
        json.dumps(timing, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(f"  -> {video_dir.relative_to(ROOT) / 'timing.json'}")


async def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawTextHelpFormatter)
    ap.add_argument("videos", nargs="*", help="أسماء الفيديوهات (الافتراضي: الكل)")
    ap.add_argument("--offline", action="store_true", help="صوت صامت + توقيت تقديري")
    ap.add_argument("--rate", default="+5%", help="سرعة الكلام (افتراضي +5%%)")
    ap.add_argument(
        "--provider", choices=["edge", "azure"], default=os.environ.get("VOICE_PROVIDER", "edge"),
        help="edge (افتراضي) أو azure (Azure Speech الرسمي بنفس الأصوات)",
    )
    args = ap.parse_args()

    dirs = sorted(d for d in VIDEOS_DIR.iterdir() if (d / "script.json").exists())
    if args.videos:
        dirs = [d for d in dirs if d.name in args.videos]
        if not dirs:
            sys.exit(f"مفيش فيديو بالاسم ده. المتاح: {[d.name for d in VIDEOS_DIR.iterdir() if d.is_dir()]}")
    for d in dirs:
        print(f"== {d.name}")
        await process_video(d, args.offline, args.rate, args.provider)


if __name__ == "__main__":
    asyncio.run(main())
