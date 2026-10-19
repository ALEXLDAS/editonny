#!/usr/bin/env python3
"""Build separate local plugin and site archives without caches or private files."""
from __future__ import annotations

import argparse
import hashlib
from pathlib import Path
import re
import zipfile

ROOT = Path(__file__).resolve().parents[1]
EXCLUDED = {'.git', '.venv', 'node_modules', '__pycache__', '.DS_Store', '.work',
            '.editonny-install.json', 'archive', 'build-data.mjs'}
VIDEO_EXTENSIONS = {'.mp4', '.webm', '.mov', '.mkv', '.avi', '.m4v'}


def allowed(path):
    return path.suffix.lower() != '.pdf' and not any(p in EXCLUDED or p.startswith('.env') and p != '.env.example'
                   or p.endswith(('.pyc', '.pyo')) for p in path.parts)


def reject_symlinks(path, root):
    for current in (path, *path.parents):
        if current.is_symlink():
            raise ValueError(f'Unexpected symlink in package: {current.relative_to(root)}')
        if current == root:
            return


def build(root, output, kind):
    root, output = Path(root), Path(output)
    reject_symlinks(root / 'skills/editonny/VERSION', root)
    version = (root / 'skills/editonny/VERSION').read_text().strip()
    if not re.fullmatch(r'\d+\.\d+\.\d+', version):
        raise ValueError('VERSION must use major.minor.patch format')
    if kind == 'site':
        base = root / 'web'
        reject_symlinks(base, root)
        paths = list(base.rglob('*'))
    elif kind == 'plugin':
        base = root
        paths = [root / p for p in ('install.py', 'editonny.py', 'README.md', 'README.pt-BR.md', 'README.es.md', 'LICENSE.md')]
        paths += [root / 'PRODUCT.md'] if (root / 'PRODUCT.md').exists() else []
        for folder in ('skills', '.codex-plugin', '.claude-plugin', '.agents/plugins', 'web'):
            reject_symlinks(root / folder, root)
            paths.extend((root / folder).rglob('*'))
        paths += [root / 'docs' / p for p in ('architecture.md', 'design.md', 'installation.md', 'integrations.md', 'setup.md', 'validation.md')
                  if (root / 'docs' / p).exists()]
    else:
        raise ValueError('Package kind must be site or plugin')
    files = []
    for p in sorted(paths):
        relative = p.relative_to(base)
        if not allowed(relative) or (kind == 'site' or relative.parts[0] == 'web') and p.suffix.lower() in VIDEO_EXTENSIONS:
            continue
        reject_symlinks(p, root)
        if p.is_file():
            files.append((p, relative.as_posix()))
    output.mkdir(parents=True, exist_ok=True)
    destination = output / f'editonny-{kind}-{version}.zip'
    temporary = destination.with_suffix('.zip.tmp')
    try:
        with zipfile.ZipFile(temporary, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=6) as archive:
            for p, name in files:
                archive.write(p, name)
        temporary.replace(destination)
    finally:
        temporary.unlink(missing_ok=True)
    digest = hashlib.sha256()
    with destination.open('rb') as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b''):
            digest.update(chunk)
    destination.with_suffix('.zip.sha256').write_text(f'{digest.hexdigest()}  {destination.name}\n')
    print(f'{destination.name}: {len(files)} files, {destination.stat().st_size / 1_000_000:.1f} MB')
    return destination


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--kind', choices=['site', 'plugin', 'all'], default='all')
    parser.add_argument('--output', type=Path, default=ROOT / 'dist')
    args = parser.parse_args()
    for kind in ('site', 'plugin') if args.kind == 'all' else (args.kind,):
        build(ROOT, args.output, kind)


if __name__ == '__main__':
    main()
