import json
import os
import sys
import tempfile
import unittest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'tools'))
import pinyin as P  # noqa: E402


class AnnotateTests(unittest.TestCase):
    def test_annotate_one_syllable_per_hanzi(self):
        out = P.annotate('小兔子', {})
        self.assertEqual(out.split(), ['xiǎo', 'tù', 'zi'])

    def test_annotate_keeps_latin_and_punct(self):
        out = P.annotate('HSK1 很好。', {})
        self.assertEqual(out, 'HSK1 hěn hǎo。')

    def test_overrides_win(self):
        default = P.annotate('他长大了', {})
        forced = P.annotate('他长大了', {'长大': 'zhǎng dà'})
        self.assertIn('zhǎng dà', forced)
        self.assertEqual(forced.split(), ['tā', 'zhǎng', 'dà', 'le'])
        self.assertNotEqual(default, '')

    def test_empty_and_nonchinese(self):
        self.assertEqual(P.annotate('', {}), '')
        self.assertEqual(P.annotate('Hello 123', {}), 'Hello 123')


class BuildTests(unittest.TestCase):
    def test_build_fills_py_and_glossary_py(self):
        src = {
            'title': '小兔子', 'tagline': 'x', 'intro': 'x', 'moral': 'x',
            'pages': [{'text': ['小兔子很可爱。', '它爱吃胡萝卜。']}],
            'glossary': [{'h': '兔子', 'es': 'conejo', 'en': 'rabbit'}],
            'quiz': [],
        }
        with tempfile.TemporaryDirectory() as d:
            inp = os.path.join(d, 'demo.zh.json')
            out = os.path.join(d, 'demo.zh.js')
            with open(inp, 'w', encoding='utf8') as f:
                json.dump(src, f, ensure_ascii=False)
            P.build(inp, out, 'demo', 'zh', {})
            with open(out, encoding='utf8') as f:
                js = f.read()
        self.assertTrue(js.startswith("OH.lang('demo', 'zh',"))
        self.assertIn('"py": ["xiǎo tù zi hěn kě ài。"', js)
        self.assertIn('"py": "tù zi"', js)  # glosario


if __name__ == '__main__':
    unittest.main()
