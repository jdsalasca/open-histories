#!/usr/bin/env python3
"""Genera pinyin para los cuentos en chino de open-histories.

Uso:
    uv run --with pypinyin python tools/pinyin.py content/<id>.zh.json   -> stories/<id>.zh.js
    uv run --with pypinyin python tools/pinyin.py content/<id>.en.json   -> stories/<id>.en.js

`annotate` devuelve una sílaba con tono por carácter chino (separadas por espacios);
todo lo demás (letras, números, signos) pasa tal cual.
"""
import json
import os
import re
import sys

from pypinyin import Style, lazy_pinyin

CJK_RUN = re.compile(r'[㐀-䶿一-鿿豈-﫿]+')
ALNUM = re.compile(r'[0-9A-Za-z]')

# Palabras en que pypinyin da tono pleno pero se lee en tono neutro con frecuencia en estos cuentos.
NEUTRAL = {'兔子': 'tù zi', '孩子': 'hái zi', '妈妈': 'mā ma', '爸爸': 'bà ba', '东西': 'dōng xi', '朋友': 'péng you',
           '什么': 'shén me', '没有': 'méi yǒu', '我们': 'wǒ men', '你们': 'nǐ men', '他们': 'tā men', '她们': 'tā men',
           '喜欢': 'xǐ huan', '知道': 'zhī dao', '故事': 'gù shi', '漂亮': 'piào liang', '舒服': 'shū fu'}


def _syllables(run):
    return lazy_pinyin(run, style=Style.TONE, neutral_tone_with_five=False)


def annotate(text, overrides=None):
    """Pinyin alineado con `text`. `overrides` fuerza la lectura de palabras (clave = hanzi, valor = sílabas)."""
    forced = dict(NEUTRAL)
    forced.update(overrides or {})
    keys = sorted(forced, key=len, reverse=True)
    pat = re.compile('|'.join(re.escape(k) for k in keys)) if keys else None
    parts = []  # (tipo, texto)  tipo = 'py' | 'lit'

    def add_plain(piece):
        pos = 0
        for m in CJK_RUN.finditer(piece):
            if m.start() > pos:
                parts.append(('lit', piece[pos:m.start()]))
            parts.append(('py', ' '.join(_syllables(m.group()))))
            pos = m.end()
        if pos < len(piece):
            parts.append(('lit', piece[pos:]))

    pos = 0
    if pat:
        for m in pat.finditer(text):
            if m.start() > pos:
                add_plain(text[pos:m.start()])
            parts.append(('py', forced[m.group()]))
            pos = m.end()
    if pos < len(text):
        add_plain(text[pos:])

    out = ''
    prev = None
    for kind, s in parts:
        if prev is not None and s:
            if kind == 'py' and prev == 'py':
                out += ' '
            elif kind == 'py' and prev == 'lit' and ALNUM.match(out[-1:] or ' '):
                out += ' '
            elif kind == 'lit' and prev == 'py' and ALNUM.match(s[:1]):
                out += ' '
        out += s
        prev = kind
    return out


def build(src_path, out_path, story_id, lang, overrides=None):
    """Lee content/<id>.<lang>.json y escribe stories/<id>.<lang>.js (con `py` si es chino)."""
    with open(src_path, encoding='utf8') as f:
        data = json.load(f)
    if lang == 'zh':
        for page in data.get('pages', []):
            page['py'] = [annotate(t, overrides) for t in page.get('text', [])]
        for g in data.get('glossary', []):
            g['py'] = annotate(g['h'], overrides)
    with open(out_path, 'w', encoding='utf8') as f:
        f.write(f"OH.lang('{story_id}', '{lang}', {json.dumps(data, ensure_ascii=False)});\n")


def main(argv):
    if len(argv) != 2:
        print(__doc__)
        return 2
    src = argv[1]
    name = os.path.basename(src)  # <id>.<lang>.json
    m = re.match(r'^(.+)\.(zh|en)\.json$', name)
    if not m:
        print('El archivo debe llamarse <id>.zh.json o <id>.en.json')
        return 2
    story_id, lang = m.groups()
    root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    ov_path = os.path.join(root, 'tools', 'pinyin-overrides.json')
    overrides = json.load(open(ov_path, encoding='utf8')) if os.path.exists(ov_path) else {}
    out = os.path.join(root, 'stories', f'{story_id}.{lang}.js')
    build(src, out, story_id, lang, overrides)
    print('escrito', out)
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv))
