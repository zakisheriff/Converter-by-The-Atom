#!/usr/bin/env python3
import sys
import numpy as np
import torch
from PIL import Image
from simple_lama_inpainting.models.model import LAMA_MODEL_URL
from simple_lama_inpainting.utils import prepare_img_and_mask, download_model


def load_model(device):
    # simple_lama_inpainting's SimpleLama always torch.jit.load()s onto the
    # default device first, which crashes on CPU-only machines if the
    # checkpoint embeds CUDA ops. Load directly with map_location instead.
    model_path = download_model(LAMA_MODEL_URL)
    model = torch.jit.load(model_path, map_location=device)
    model.eval()
    model.to(device)
    return model


def main():
    if len(sys.argv) < 4:
        print("Usage: inpaint_watermark.py <input> <mask> <output>", file=sys.stderr)
        sys.exit(1)

    input_path, mask_path, output_path = sys.argv[1], sys.argv[2], sys.argv[3]

    image = Image.open(input_path).convert("RGB")
    orig_width, orig_height = image.size
    mask_src = Image.open(mask_path)

    # Mask canvas is a translucent stroke layer (RGBA); any drawn pixel (alpha > 0)
    # marks the region to inpaint, regardless of stroke color.
    if mask_src.mode == "RGBA":
        mask = mask_src.split()[-1].point(lambda a: 255 if a > 10 else 0)
    else:
        mask = mask_src.convert("L").point(lambda v: 255 if v > 10 else 0)

    if mask.size != image.size:
        mask = mask.resize(image.size, Image.NEAREST)

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = load_model(device)

    image_t, mask_t = prepare_img_and_mask(image, mask, device)
    with torch.inference_mode():
        inpainted = model(image_t, mask_t)
        cur_res = inpainted[0].permute(1, 2, 0).detach().cpu().numpy()
        cur_res = np.clip(cur_res * 255, 0, 255).astype(np.uint8)
        cur_res = cur_res[:orig_height, :orig_width]
        Image.fromarray(cur_res).save(output_path)

if __name__ == "__main__":
    main()
