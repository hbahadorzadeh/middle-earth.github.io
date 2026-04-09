#!/bin/zsh

set -euo pipefail

ROOT_DIR=$(cd "$(dirname "$0")/.." && pwd)
SOURCE_IMAGE="$ROOT_DIR/public/maps/mapome.png"
OUTPUT_ROOT="$ROOT_DIR/public/maps/tiles/base"
TMP_DIR=$(mktemp -d)

levels=(
  "z0 1200 900"
  "z1 2400 1800"
  "z2 4800 3600"
)

cleanup() {
  rm -rf "$TMP_DIR"
}

trap cleanup EXIT

mkdir -p "$OUTPUT_ROOT"

for level in "${levels[@]}"; do
  read -r level_id width height <<<"$level"
  level_dir="$OUTPUT_ROOT/$level_id"
  resized_image="$TMP_DIR/$level_id.jpg"

  rm -rf "$level_dir"
  mkdir -p "$level_dir"

  magick "$SOURCE_IMAGE" -resize "${width}x${height}!" -strip -quality 88 "$resized_image"

  columns=$(((width + 511) / 512))
  rows=$(((height + 511) / 512))

  for ((row = 0; row < rows; row += 1)); do
    for ((column = 0; column < columns; column += 1)); do
      crop_x=$((column * 512))
      crop_y=$((row * 512))
      crop_width=$((width - crop_x))
      crop_height=$((height - crop_y))

      if ((crop_width > 512)); then
        crop_width=512
      fi

      if ((crop_height > 512)); then
        crop_height=512
      fi

      magick \
        "$resized_image" \
        -crop "${crop_width}x${crop_height}+${crop_x}+${crop_y}" \
        +repage \
        -strip \
        -quality 88 \
        "$level_dir/${row}-${column}.jpg"
    done
  done
done
