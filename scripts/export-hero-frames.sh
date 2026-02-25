#!/usr/bin/env bash
# Export hero video to one image per frame for scroll-driven animation.
# Requires: ffmpeg, Node.js
# Run from project root: bash scripts/export-hero-frames.sh

set -e
VIDEO="${1:-public/Muxu_new_hero2.mp4}"
OUT_DIR="public/hero-frames"
FPS="${2:-30}"  # frames per second (30 = smooth, lower = fewer files)

if [[ ! -f "$VIDEO" ]]; then
  echo "Video not found: $VIDEO"
  exit 1
fi

mkdir -p "$OUT_DIR"
echo "Exporting frames from $VIDEO at ${FPS} fps (high quality)..."
ffmpeg -y -i "$VIDEO" -vf "fps=$FPS" -q:v 1 -start_number 0 "$OUT_DIR/frame_%04d.jpg"

# Write frame count to meta.json for the hero component
node -e "
const fs = require('fs');
const files = fs.readdirSync('$OUT_DIR').filter(f => /^frame_\d+\.jpg$/.test(f));
fs.writeFileSync('$OUT_DIR/meta.json', JSON.stringify({ frameCount: files.length }));
console.log('Exported', files.length, 'frames. meta.json updated.');
"
