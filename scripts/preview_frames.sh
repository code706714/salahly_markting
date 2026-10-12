#!/usr/bin/env bash
# يرندر لقطات ثابتة من Composition ويلزقها جنب بعض في صورة واحدة للمراجعة السريعة (من غير رندر الفيديو كله).
#   scripts/preview_frames.sh <CompositionId> <اسم-الصورة> <frame> <frame> ...
#   مثال: scripts/preview_frames.sh PickYourPrice sheet1 20 120 300 450   ->  out/preview/sheet1.png
# لو Chrome الافتراضي مش شغّال: BROWSER_EXECUTABLE=/path/to/chrome scripts/preview_frames.sh ...
set -euo pipefail
cd "$(dirname "$0")/.."
id=$1; name=$2; shift 2
mkdir -p out/preview/tmp
rm -f out/preview/tmp/f-*.png
EXTRA=()
[ -n "${BROWSER_EXECUTABLE:-}" ] && EXTRA+=(--browser-executable="$BROWSER_EXECUTABLE" --chrome-mode=chrome-for-testing)
i=0
for f in "$@"; do
  npx remotion still src/index.ts "$id" "out/preview/tmp/f-$(printf %02d $i).png" --frame="$f" "${EXTRA[@]}" >/dev/null 2>&1
  i=$((i+1))
done
ffmpeg -y -loglevel error -pattern_type glob -i "out/preview/tmp/f-*.png" -vf "scale=360:640,tile=${#}x1" "out/preview/$name.png"
echo "out/preview/$name.png"
