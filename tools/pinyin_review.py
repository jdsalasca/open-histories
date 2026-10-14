#!/usr/bin/env python3
"""Lista los caracteres chinos con varias lecturas, con su contexto y la sílaba generada,
para revisar rápido el pinyin de un cuento antes de publicarlo.

Uso: python tools/pinyin_review.py stories/<id>.zh.js
"""
import json
import re
import sys

CJK = re.compile(r'[㐀-䶿一-鿿豈-﫿]')
LETTERS = re.compile(r"[A-Za-zÀ-ɏḀ-ỿ̀-ͯ]+")
# Caracteres con lecturas frecuentes que suelen requerir revisión (carácter -> lecturas posibles).
WATCH = {
    '得': 'de/dé/děi', '地': 'de/dì', '着': 'zhe/zháo/zhuó', '只': 'zhī/zhǐ', '给': 'gěi/jǐ', '种': 'zhǒng/zhòng',
    '倒': 'dǎo/dào', '长': 'cháng/zhǎng', '都': 'dōu/dū', '为': 'wèi/wéi', '还': 'hái/huán', '了': 'le/liǎo',
    '行': 'xíng/háng', '好': 'hǎo/hào', '重': 'zhòng/chóng', '数': 'shù/shǔ', '干': 'gān/gàn', '会': 'huì/kuài',
    '没': 'méi/mò', '假': 'jiǎ/jià', '传': 'chuán/zhuàn', '得': 'de/dé/děi', '更': 'gèng/gēng', '空': 'kōng/kòng',
    '角': 'jiǎo/jué', '觉': 'jué/jiào', 'half': ''
}


def main(path):
    s = open(path, encoding='utf8').read()
    data = json.loads(s[s.index('{'):s.rindex('}') + 1])
    n = 0
    for pi, page in enumerate(data['pages'], 1):
        for ji, (text, py) in enumerate(zip(page['text'], page['py']), 1):
            text = re.sub(r'</?[bi]>', '', text)
            py = re.sub(r'</?[bi]>', '', py)
            hanzi = CJK.findall(text)
            syl = LETTERS.findall(py)
            if len(hanzi) != len(syl):
                print(f'[{pi}.{ji}] DESALINEADO: {len(hanzi)} hanzi / {len(syl)} sílabas')
                continue
            chars = [(i, c) for i, c in enumerate(text) if CJK.match(c)]
            for k, (i, c) in enumerate(chars):
                if c in WATCH and WATCH[c]:
                    ctx = text[max(0, i - 3): i + 4]
                    print(f'[{pi}.{ji}] {c} → {syl[k]:<5} ({WATCH[c]})  …{ctx}…')
                    n += 1
    print(f'\n{n} apariciones a revisar')


if __name__ == '__main__':
    if len(sys.argv) != 2:
        print(__doc__)
        sys.exit(2)
    main(sys.argv[1])
