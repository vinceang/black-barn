#!/usr/bin/env bash
#
# Encode the §03 ride clip.
#
# NORMAL GOP, NOT ALL-INTRA.
#
# An earlier version forced -g 1 because §03 seeked frame-by-frame from scroll
# position. That scrub was replaced: the clip now plays continuously and scroll
# drives its playbackRate instead, so nothing ever seeks and every frame being
# a keyframe buys nothing except roughly 3x the bytes. Straight playback at a
# normal GOP is a quarter of the size and decodes more cheaply on a phone.
#
# If a future section does need frame-accurate seeking, put -g 1 back for that
# asset and nothing else.
#
# The clip is also NOT preloaded — §03 fetches it only as the section
# approaches, so it never competes with the §01 hero for bandwidth.
#
# Usage: scripts/encode-road.sh <source.mp4>
set -euo pipefail

SRC="${1:?usage: encode-road.sh <source.mp4>}"
OUT_DIR="$(cd "$(dirname "$0")/.." && pwd)/public/media"
mkdir -p "$OUT_DIR"

GREEN_ISOLATE="format=gbrp,geq=r='r(X,Y)':b='b(X,Y)':g='st(0,max(r(X,Y),b(X,Y)));st(1,g(X,Y)-ld(0));if(lte(ld(1),0),g(X,Y),if(lte(ld(1),18),ld(0),min(255,ld(0)+(ld(1)-18)*1.53)))'"

GRADE_FILE="$(mktemp)"
printf "%s,scale=1280:-2,hqdn3d=2:1:3:3,format=yuv420p\n" "$GREEN_ISOLATE" > "$GRADE_FILE"

ffmpeg -hide_banner -loglevel error -y -i "$SRC" -filter_script:v "$GRADE_FILE" \
  -c:v libx264 -profile:v high -preset slow -crf 32 \
  -movflags +faststart -an \
  "$OUT_DIR/c1-road.mp4"

rm -f "$GRADE_FILE"

printf "  %-30s %5s KB\n" "c1-road.mp4" \
  "$(( $(stat -f%z "$OUT_DIR/c1-road.mp4") / 1024 ))"
