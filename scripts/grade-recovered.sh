#!/usr/bin/env bash
#
# §08 RECOVERED — "a folder of material someone else collected."
#
# §6.4's rejects strategy: "the generations that are 90% right but slightly
# wrong... go in §08 Recovered, treated as degraded found footage with heavy
# compression and a timestamp. AI's failure modes become the aesthetic when
# they're framed as damaged evidence."
#
# So nothing here is newly generated. Every plate is a discarded take from an
# earlier selection pass, put through a treatment that makes the discarding
# legible: resolution loss, double compression, damage.
#
# §08 asks for mixed formats on purpose — "4:3 stills, a vertical phone clip,
# a scanned polaroid, a thermal frame, one image that is just a smear."
# The thermal frame is rendered as high-contrast monochrome rather than false
# colour, because every false-colour ramp available runs through the purple
# and teal §2.1 prohibits outright.
#
# Every treatment also pulls brightness down. Degradation naturally lifts the
# blacks — blur and noise both average toward grey — and §2.1 holds the site
# to 78% darkness. Left alone, the smear and the vertical crop came back as
# the brightest things on the page.
#
# Usage: scripts/grade-recovered.sh <source.png> <out-name> <treatment>
#   treatments: still | vertical | polaroid | infrared | smear
set -euo pipefail

SRC="${1:?usage: grade-recovered.sh <source> <name> <treatment>}"
NAME="${2:?missing name}"
TREATMENT="${3:?missing treatment}"

OUT_DIR="$(cd "$(dirname "$0")/.." && pwd)/public/media"
mkdir -p "$OUT_DIR"

# The source pool is mixed portrait and landscape, so every crop is expressed
# as the largest rectangle of the target ratio that fits inside the frame.
# A literal `in_h*4/3` overflows the width of any portrait plate and ffmpeg
# fails the filter outright.
CROP_43="crop='min(in_w\,in_h*4/3)':'min(in_w\,in_h*4/3)*3/4'"
CROP_SQ="crop='min(in_w\,in_h)':'min(in_w\,in_h)'"

case "$TREATMENT" in
  # A photograph somebody took and did not look after.
  still)    VF="$CROP_43,scale=760:-2,eq=brightness=-0.06:contrast=1.08,noise=alls=9:allf=t+u" ; Q=12 ;;
  # Shot on a phone, in portrait, by someone who should not have had it.
  vertical) VF="crop=in_w*0.42:in_h,scale=440:-2,eq=brightness=-0.1:contrast=1.12,noise=alls=12:allf=t+u" ; Q=14 ;;
  # Scanned, so it is warmer and softer than it was.
  polaroid) VF="$CROP_SQ,scale=620:-2,eq=saturation=0.72:gamma=0.94:brightness=-0.05,noise=alls=7:allf=t" ; Q=11 ;;
  # Not a thermal ramp — see the note above. Monochrome, pushed.
  infrared) VF="$CROP_43,scale=700:-2,hue=s=0,eq=contrast=1.55:brightness=-0.1,noise=alls=14:allf=t+u" ; Q=15 ;;
  # Whatever this was, the camera was moving.
  smear)    VF="$CROP_43,scale=700:-2,boxblur=28:1:0:0,eq=brightness=-0.12:contrast=1.1,noise=alls=8:allf=t" ; Q=13 ;;
  *) echo "unknown treatment: $TREATMENT" >&2; exit 1 ;;
esac

# Two passes on purpose. The first is the damage; the second is what happens
# to damaged files when they get copied around.
TMP="$(mktemp -t recovered).jpg"
ffmpeg -hide_banner -loglevel error -y -i "$SRC" -vf "$VF" -frames:v 1 -q:v "$Q" "$TMP"
ffmpeg -hide_banner -loglevel error -y -i "$TMP" -frames:v 1 -q:v "$Q" "$OUT_DIR/$NAME.jpg"
ffmpeg -hide_banner -loglevel error -y -i "$TMP" -frames:v 1 -pix_fmt yuv420p \
  -c:v libsvtav1 -crf 40 "$OUT_DIR/$NAME.avif" 2>/dev/null
rm -f "$TMP"

printf "  %-24s %-9s %4s KB\n" "$NAME" "$TREATMENT" \
  "$(( $(stat -f%z "$OUT_DIR/$NAME.jpg") / 1024 ))"
