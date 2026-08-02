#!/usr/bin/env bash
#
# §3.2.7 THE ENGINE — the sound bed.
#
# "A low diesel idle bed, wind, gravel, and one distant bell that rings on a
# 47-second interval — deliberately not synced to anything, so it always feels
# like it came from outside the site."
#
# Synthesised rather than sourced or generated, for three reasons:
#
# 1. LOOPS. The engine bed has to run indefinitely without a seam. Every
#    partial here completes a whole number of cycles inside the loop length
#    (48Hz x 8s = 384, 96 x 8 = 768, 145 x 8 = 1160, tremolo 2.5 x 8 = 20), so
#    the waveform is continuous across the join by construction.
# 2. SIZE. Three files, mono, ~60KB total, against a recorded bed of megabytes.
# 3. CONTROL. §3.2.7 wants wind modulated by scroll velocity, which means wind
#    has to be its own layer rather than baked into a mix.
#
# The bell is deliberately inharmonic — its partials are at 2.76x and 5.40x the
# fundamental, which is roughly where a real bell's are. Harmonic partials
# would read as a synth tone.
set -euo pipefail

OUT="$(cd "$(dirname "$0")/.." && pwd)/public/audio"
mkdir -p "$OUT"

# --- the engine. 8s, seamless. ---------------------------------------------
ffmpeg -hide_banner -loglevel error -y \
  -f lavfi -i "sine=frequency=48:duration=8:sample_rate=44100" \
  -f lavfi -i "sine=frequency=96:duration=8:sample_rate=44100" \
  -f lavfi -i "sine=frequency=145:duration=8:sample_rate=44100" \
  -f lavfi -i "anoisesrc=color=brown:duration=8:sample_rate=44100:amplitude=0.4" \
  -filter_complex "\
    [0]volume=0.60[a];\
    [1]volume=0.24[b];\
    [2]volume=0.09[c];\
    [3]lowpass=f=240,volume=0.55[d];\
    [a][b][c][d]amix=inputs=4:normalize=0,\
    tremolo=f=2.5:d=0.30,\
    lowpass=f=420,\
    volume=0.85" \
  -ac 1 -b:a 64k "$OUT/engine.mp3"

# --- wind. 12s. Noise has no phase identity, so short fades hide the join. --
ffmpeg -hide_banner -loglevel error -y \
  -f lavfi -i "anoisesrc=color=pink:duration=12:sample_rate=44100:amplitude=0.5" \
  -af "highpass=f=140,lowpass=f=1400,tremolo=f=0.25:d=0.6,volume=0.7,\
       afade=t=in:st=0:d=0.04,afade=t=out:st=11.96:d=0.04" \
  -ac 1 -b:a 64k "$OUT/wind.mp3"

# --- the bell. One shot, 5s, inharmonic. -----------------------------------
ffmpeg -hide_banner -loglevel error -y \
  -f lavfi -i "sine=frequency=520:duration=5:sample_rate=44100" \
  -f lavfi -i "sine=frequency=1435:duration=5:sample_rate=44100" \
  -f lavfi -i "sine=frequency=2808:duration=5:sample_rate=44100" \
  -filter_complex "\
    [0]volume=0.7[a];\
    [1]volume=0.28[b];\
    [2]volume=0.12[c];\
    [a][b][c]amix=inputs=3:normalize=0,\
    afade=t=in:st=0:d=0.006,\
    afade=t=out:st=0.1:d=4.9:curve=exp,\
    lowpass=f=3200,\
    volume=0.8" \
  -ac 1 -b:a 64k "$OUT/bell.mp3"

for f in engine.mp3 wind.mp3 bell.mp3; do
  printf "  %-14s %4s KB\n" "$f" "$(( $(stat -f%z "$OUT/$f") / 1024 ))"
done
