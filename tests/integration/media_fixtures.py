"""Independent stored-sample fixtures; no private media or color-transform oracle reuse."""
from pathlib import Path
import subprocess
from array import array


def make_patches(path: Path, full: bool = False, matrix: str = 'bt709') -> bytes:
    width, height = 128, 64
    levels = (0, 32, 96, 128, 192, 255) if full else (16, 44, 98, 126, 180, 235)
    y = bytes(levels[min(len(levels) - 1, x * len(levels) // width)]
              for _ in range(height) for x in range(width))
    # Constant chroma avoids resampling boundaries corrupting the gray oracle.
    frame = y + bytes([128]) * (width * height // 2)
    subprocess.run(['ffmpeg', '-v', 'error', '-f', 'rawvideo', '-pix_fmt', 'yuv420p',
                    '-s', f'{width}x{height}', '-r', '24', '-i', '-', '-frames:v', '1',
                    '-vf', f'setparams=color_primaries=bt709:color_trc=bt709:colorspace={matrix}:range={"pc" if full else "tv"}',
                    '-c:v', 'libx264', '-qp', '0', '-color_range', 'pc' if full else 'tv',
                    '-colorspace', matrix, '-color_primaries', 'bt709', '-color_trc', 'bt709',
                    str(path)], input=frame, check=True, capture_output=True)
    return frame


def decoded_samples(path: Path) -> bytes:
    return subprocess.run(['ffmpeg', '-v', 'error', '-i', str(path), '-frames:v', '1',
                           '-pix_fmt', 'yuv420p', '-f', 'rawvideo', '-'],
                          check=True, capture_output=True).stdout


def make_hdr_patches(path: Path, transfer: str, depth: int = 10) -> None:
    width, height, k = 128, 64, 2 ** (depth - 8)
    levels = (16, 44, 98, 126, 180, 235)
    y = [levels[min(5, x * 6 // width)] * k for _ in range(height) for x in range(width)]
    u = [v * k for _ in range(height // 2) for v in [128 if x < width // 4 else 144 for x in range(width // 2)]]
    frame = array('H', y + u + [128 * k] * (width * height // 4)).tobytes()
    subprocess.run(['ffmpeg', '-v', 'error', '-f', 'rawvideo', '-pix_fmt', f'yuv420p{depth}le', '-s', '128x64',
        '-r', '24', '-i', '-', '-vf', f'setparams=range=tv:color_primaries=bt2020:colorspace=bt2020nc:color_trc={transfer}',
        '-c:v', 'libx265', '-x265-params', 'lossless=1:log-level=error', '-pix_fmt', f'yuv420p{depth}le',
        '-tag:v', 'hvc1', '-color_range', 'tv', '-color_primaries', 'bt2020', '-color_trc', transfer,
        '-colorspace', 'bt2020nc', str(path)], input=frame * 24, check=True, capture_output=True)
