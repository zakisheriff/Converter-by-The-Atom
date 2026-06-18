#!/usr/bin/env python3
import sys
from PIL import Image
from rembg import remove, new_session

def main():
    if len(sys.argv) < 3:
        print("Usage: remove_bg.py <input> <output>", file=sys.stderr)
        sys.exit(1)

    input_path, output_path = sys.argv[1], sys.argv[2]

    session = new_session("isnet-general-use")
    img = Image.open(input_path).convert("RGB")

    out = remove(
        img,
        session=session,
        alpha_matting=True,
        alpha_matting_foreground_threshold=240,
        alpha_matting_background_threshold=10,
        alpha_matting_erode_size=10,
    )

    out.save(output_path)

if __name__ == "__main__":
    main()
