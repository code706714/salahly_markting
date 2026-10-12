#!/usr/bin/env bash
# يرندر كل فيديو (كل فولدر في src/videos) لـ MP4 h264 في out/
#
#   ./render.sh              # كل الفيديوهات
#   ./render.sh ac-scam      # فيديو واحد أو أكتر
#
# متغيرات اختيارية:
#   BROWSER_EXECUTABLE=/path/to/chrome   لو عايز تستخدم كروم موجود عندك بدل اللي Remotion بينزّله
#   CONCURRENCY=4                        عدد الـ tabs (افتراضي: Remotion يختار)
set -euo pipefail
cd "$(dirname "$0")"

mkdir -p out

if [ "$#" -gt 0 ]; then
  IDS=("$@")
else
  IDS=()
  for d in src/videos/*/; do IDS+=("$(basename "$d")"); done
fi

EXTRA=()
[ -n "${BROWSER_EXECUTABLE:-}" ] && EXTRA+=(--browser-executable="$BROWSER_EXECUTABLE" --chrome-mode=chrome-for-testing)
[ -n "${CONCURRENCY:-}" ] && EXTRA+=(--concurrency="$CONCURRENCY")

for id in "${IDS[@]}"; do
  if [ ! -f "src/videos/$id/timing.json" ]; then
    echo "!! src/videos/$id/timing.json مش موجود — شغّل الأول: python3 scripts/generate_voice.py $id" >&2
    exit 1
  fi
  echo "==> rendering $id"
  npx remotion render src/index.ts "$id" "out/$id.mp4" \
    --codec=h264 --pixel-format=yuv420p --crf=18 --audio-codec=aac --overwrite \
    "${EXTRA[@]}"
done

echo "Done:"
ls -lh out/*.mp4
