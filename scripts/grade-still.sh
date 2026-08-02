#!/usr/bin/env bash
#
# The shared still grade.
#
# §6.2.4 — "Unify in post, always. Every asset — 100% of them — passes through
# one shared grade... This step is not optional and it is what buys the whole
# set its coherence."
#
# So no still enters public/media by any other route. The grade is:
#
#   1. Green isolation. Identical maths to scripts/encode-hero.sh — see the
#      comment block there for why it masks on green excess rather than
#      curving the channel. Keeping the two in step is what stops the bus
#      interiors reading greener than the bus exterior.
#   2. Denoise. §2.4 lays our own grain over everything at 6-9%; source grain
#      is entropy the encoder would pay for twice.
#   3. AVIF for delivery, JPEG as the fallback source.
#
# Usage: scripts/grade-still.sh <source.png> <out-basename> [width] [crf]
set -euo pipefail

SRC="${1:?usage: grade-still.sh <source> <out-basename> [width] [crf]}"
NAME="${2:?missing out-basename}"
WIDTH="${3:-1600}"
CRF="${4:-34}"

OUT_DIR="$(cd "$(dirname "$0")/.." && pwd)/public/media"
mkdir -p "$OUT_DIR"

GREEN_ISOLATE="format=gbrp,geq=r='r(X,Y)':b='b(X,Y)':g='st(0,max(r(X,Y),b(X,Y)));st(1,g(X,Y)-ld(0));if(lte(ld(1),0),g(X,Y),if(lte(ld(1),18),ld(0),min(255,ld(0)+(ld(1)-18)*1.53)))'"

GRADE_FILE="$(mktemp)"
printf "%s,scale=%s:-2,hqdn3d=2:1:3:3\n" "$GREEN_ISOLATE" "$WIDTH" > "$GRADE_FILE"

ffmpeg -hide_banner -loglevel error -y -i "$SRC" -filter_script:v "$GRADE_FILE" \
  -frames:v 1 -pix_fmt yuv420p -c:v libsvtav1 -crf "$CRF" "$OUT_DIR/$NAME.avif" 2>/dev/null

ffmpeg -hide_banner -loglevel error -y -i "$SRC" -filter_script:v "$GRADE_FILE" \
  -frames:v 1 -q:v 6 "$OUT_DIR/$NAME.jpg"

rm -f "$GRADE_FILE"

printf "  %-30s %5s KB avif  %5s KB jpg\n" "$NAME" \
  "$(( $(stat -f%z "$OUT_DIR/$NAME.avif") / 1024 ))" \
  "$(( $(stat -f%z "$OUT_DIR/$NAME.jpg") / 1024 ))"
