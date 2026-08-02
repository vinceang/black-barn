#!/usr/bin/env bash
#
# Encode the §01 hero clip for the web.
#
# Three things happen here that are not obvious:
#
# 1. FRONT TRIM. §01 wants the door to open "at 4 seconds of dwell", where
#    dwell starts when the Threshold clears at 1.8s — so the door has to begin
#    moving 5.8s into the clip. In the source it begins at ~6.0s, so 0.2s comes
#    off the front. Trimming rather than padding also means the clip opens on
#    frames that are already moving, which is what lets the hero "cut in, hard,
#    mid-motion" (§3.2.1) instead of starting from a dead still.
#
# 2. POSTER FROM THE VIDEO. The poster is extracted from frame 0 of the encoded
#    result, not from the original plate. It is what shows while the video
#    loads, so if it were a different frame the handover would pop. Same frame,
#    no pop — and it still doubles as the LCP image under §3.4's 90KB budget.
#
# 3. DENOISE. §2.4 puts our own grain plate over every video at 6-9%. Source
#    grain here is just entropy the encoder pays for twice, so it comes out
#    before encoding and goes back on in CSS.
#
# 4. TWO ORIENTATIONS. §01's door beat is the section's whole point, and on a
#    phone a centre-crop of the landscape master puts the door off-screen — so
#    the beat simply never happened on mobile. There is a separate portrait
#    master, composed with the door in frame and the lower third left dark for
#    type, and this script encodes either.
#
# Usage: scripts/encode-hero.sh <source.mp4> [name] [width] [trim]
#   landscape: scripts/encode-hero.sh src.mp4 a1-bus-hero          1920 0.2
#   portrait:  scripts/encode-hero.sh src.mp4 a1-bus-hero-portrait 1080 0.2
set -euo pipefail

SRC="${1:?usage: encode-hero.sh <source.mp4> [name] [width] [trim]}"
NAME="${2:-a1-bus-hero}"
WIDTH="${3:-1920}"
TRIM="${4:-0.2}"
OUT_DIR="$(cd "$(dirname "$0")/.." && pwd)/public/media"

# --- 4. GREEN ISOLATION -----------------------------------------------------
# §2.1 — bad-signal is "the intrusion of something modern and wrong into a
# hand-built world". As generated, the dome light was not an intrusion: it was
# ambient lighting, tinting 19% of the frame (29% of the phone crop) with a
# wide faint wash. That inverts the meaning — a wash reads as atmosphere, and
# atmosphere is not an intrusion.
#
# Curving the green channel globally was tried first and is unusable: it drags
# the rust body through red into purple, which §2.1 prohibits outright. So this
# masks on green *excess* (how far green leads the other channels) instead:
#
#   excess <= 0   non-green pixel, untouched. Without this guard the rust body
#                 (where red leads) has its green lifted to match and turns
#                 chartreuse.
#   excess <= 18  the wash. Neutralised to grey.
#   excess >  18  the source. Kept, and regained to preserve peak brightness.
#
# Result: 19.5% -> 1.3% of frame, with the bright core intact at 0.62%.
# Small and bright, not spread and dim.
GREEN_ISOLATE="format=gbrp,geq=r='r(X,Y)':b='b(X,Y)':g='st(0,max(r(X,Y),b(X,Y)));st(1,g(X,Y)-ld(0));if(lte(ld(1),0),g(X,Y),if(lte(ld(1),18),ld(0),min(255,ld(0)+(ld(1)-18)*1.53)))'"

GRADE="${GREEN_ISOLATE},scale=${WIDTH}:-2,hqdn3d=2:1:3:3,format=yuv420p"

mkdir -p "$OUT_DIR"

# --- motion ----------------------------------------------------------------
printf "%s\n" "$GRADE" > /tmp/bb-hero-grade.txt
ffmpeg -hide_banner -loglevel error -y -ss "$TRIM" -i "$SRC" \
  -filter_script:v /tmp/bb-hero-grade.txt \
  -c:v libx264 -profile:v high -level 4.0 -preset slow -crf 25 \
  -movflags +faststart -an \
  "$OUT_DIR/$NAME.mp4"

# --- poster, taken from the encoded video's own first frame ----------------
ffmpeg -hide_banner -loglevel error -y -i "$OUT_DIR/$NAME.mp4" \
  -frames:v 1 -c:v libsvtav1 -crf 34 "$OUT_DIR/$NAME-poster.avif" 2>/dev/null

ffmpeg -hide_banner -loglevel error -y -i "$OUT_DIR/$NAME.mp4" \
  -frames:v 1 -q:v 6 "$OUT_DIR/$NAME-poster.jpg"

for f in "$NAME.mp4" "$NAME-poster.avif" "$NAME-poster.jpg"; do
  printf "  %-28s %6s KB\n" "$f" "$(( $(stat -f%z "$OUT_DIR/$f") / 1024 ))"
done
