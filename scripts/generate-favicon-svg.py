"""Trace the Y99 logo into an SVG favicon with separate dark/light blue paths."""
from pathlib import Path

import cv2
import numpy as np
from PIL import Image

SRC = Path(
    r"C:\Users\ADMIN\.cursor\projects\d-y99-finance-hub-main\assets"
    r"\c__Users_ADMIN_AppData_Roaming_Cursor_User_workspaceStorage_"
    r"b4389b2d0c4d2d60c4e284c9c4bfc772_images_favicon-4a54881c-eda4-4cf7-9e52-2efa7d4e72e8.png"
)

DARK = "#2455AD"
LIGHT = "#35A9E0"
VIEW = 100


def contours_to_path(mask: np.ndarray, eps_ratio: float = 0.0015) -> str:
    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    parts: list[str] = []
    h, w = mask.shape
    sx = VIEW / w
    sy = VIEW / h
    for cnt in contours:
        if cv2.contourArea(cnt) < 50:
            continue
        peri = cv2.arcLength(cnt, True)
        approx = cv2.approxPolyDP(cnt, eps_ratio * peri, True)
        pts = approx.reshape(-1, 2)
        if len(pts) < 3:
            continue
        cmds = [f"M{pts[0][0] * sx:.2f},{pts[0][1] * sy:.2f}"]
        for x, y in pts[1:]:
            cmds.append(f"L{x * sx:.2f},{y * sy:.2f}")
        cmds.append("Z")
        parts.append("".join(cmds))
        print("contour pts", len(pts), "area", round(cv2.contourArea(cnt)))
    return " ".join(parts)


def main() -> None:
    src = Image.open(SRC).convert("RGBA")
    bbox = src.getbbox()
    assert bbox is not None
    pad = int(max(src.size) * 0.06)
    tight = src.crop(
        (
            max(0, bbox[0] - pad),
            max(0, bbox[1] - pad),
            min(src.width, bbox[2] + pad),
            min(src.height, bbox[3] + pad),
        )
    )

    size = max(tight.size)
    margin = int(size * 0.08)
    canvas = Image.new("RGBA", (size + margin * 2, size + margin * 2), (0, 0, 0, 0))
    canvas.paste(
        tight,
        ((canvas.width - tight.width) // 2, (canvas.height - tight.height) // 2),
        tight,
    )
    canvas = canvas.resize((400, 400), Image.Resampling.LANCZOS)

    arr = np.array(canvas)
    g, a = arr[:, :, 1], arr[:, :, 3]
    opaque = a > 180
    light = (opaque & (g > 120)).astype(np.uint8) * 255
    dark = (opaque & (g <= 120)).astype(np.uint8) * 255

    dark_path = contours_to_path(dark)
    print("---")
    light_path = contours_to_path(light)

    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {VIEW} {VIEW}" role="img" aria-label="Y99">
  <path fill="{DARK}" d="{dark_path}"/>
  <path fill="{LIGHT}" d="{light_path}"/>
</svg>
"""

    for dest in [
        Path(r"d:\y99-finance-hub-main\y99-webclient\public\favicon.svg"),
        Path(r"d:\y99-finance-hub-main\y99-webadmin\public\favicon.svg"),
    ]:
        dest.write_text(svg, encoding="utf-8")
        print("wrote", dest, dest.stat().st_size, "bytes")


if __name__ == "__main__":
    main()
