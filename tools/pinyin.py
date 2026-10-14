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


# Palabras donde 地 se lee dì (sustantivo/lugar). En cualquier otro caso se trata como partícula "de".
DI_WORDS = ['地方', '地上', '地下', '地面', '地球', '地图', '地区', '地址', '地点', '地位', '地步', '地道', '地板', '地狱',
            '地理', '地震', '地铁', '地毯', '土地', '大地', '草地', '当地', '天地', '陆地', '高地', '田地', '墓地', '场地',
            '平地', '目的地', '空地', '工地', '基地', '阵地', '内地', '外地', '本地', '各地', '山地', '海地']
# Lo que puede seguir a 得 cuando es partícula de complemento ("做得很快").
DE_COMPLEMENT = set('很太多更大紧稳无不好快慢特非那这可真又最清高低远深浅长短累饿冷热怎')
DE_NOT_AFTER = set('获取值舍懂显记觉认晓免省巴恨怪难心博')
DEI_PRONOUNS = set('我你他她它咱')
DEI_VERBS = set('去走回做先赶买找是')
ZHI_PREV = set('一那这每两三四五六七八九十几另万百千')
GENG_NOT_BEFORE = set('新换衣夫夜')


def _is_di_noun(run, i):
    for w in DI_WORDS:
        j = w.index('地')
        start = run.find(w)
        while start != -1:
            if start + j == i:
                return True
            start = run.find(w, start + 1)
    return False


def _tokens(run):
    """Divide una racha de hanzi en trozos ('txt', hanzi) y partículas ('py', sílaba)."""
    out, buf = [], ''
    for i, c in enumerate(run):
        kind = None
        if c == '地' and not _is_di_noun(run, i) and i > 0:
            kind = 'de'
        elif c == '只':
            nxt = run[i + 1] if i + 1 < len(run) else ''
            prev = run[i - 1] if i > 0 else ''
            if prev in ZHI_PREV and nxt != '是':
                kind = 'zhī'
        elif c == '更':
            nxt = run[i + 1] if i + 1 < len(run) else ''
            if nxt and nxt not in GENG_NOT_BEFORE:
                kind = 'gèng'
        elif c == '得':
            nxt = run[i + 1] if i + 1 < len(run) else ''
            prev = run[i - 1] if i > 0 else ''
            if nxt in DE_COMPLEMENT and prev not in DE_NOT_AFTER:
                kind = 'de'
            elif nxt in DEI_VERBS and prev in DEI_PRONOUNS:
                kind = 'děi'
        if kind:
            if buf:
                out.append(('txt', buf))
                buf = ''
            out.append(('py', kind))
        else:
            buf += c
    if buf:
        out.append(('txt', buf))
    return out


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
            for kind, val in _tokens(m.group()):
                parts.append(('py', ' '.join(_syllables(val)) if kind == 'txt' else val))
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
