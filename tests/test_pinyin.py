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


class ParticleTests(unittest.TestCase):
    def test_di_particle_is_de_but_nouns_keep_di(self):
        self.assertEqual(P.annotate('他小心地走进房间。', {}).split()[:4], ['tā', 'xiǎo', 'xīn', 'de'])
        self.assertIn('cǎo dì shàng', P.annotate('草地上', {}))
        self.assertIn('dì fāng', P.annotate('这个地方', {}))
        self.assertIn('dāng dì', P.annotate('当地的人', {}))

    def test_de_particle_after_verb_and_dei_for_must(self):
        self.assertIn('zuò de hěn kuài', P.annotate('他做得很快', {}))
        self.assertIn('guān de jǐn jǐn', P.annotate('窗板关得紧紧的', {}))
        self.assertIn('dé dào', P.annotate('他得到了奖', {}))
        self.assertIn('wǒ děi qù', P.annotate('我得去找', {}))


class MeasureWordTests(unittest.TestCase):
    def test_zhi_measure_word_vs_zhi_only(self):
        self.assertIn('nà zhī yǎn jīng', P.annotate('那只眼睛', {}))
        self.assertIn('zhè zhǐ shì', P.annotate('这只是烟囱', {}))
        self.assertIn('yì zhī', P.annotate('一只老鼠', {}).replace('yī zhī', 'yì zhī'))

    def test_geng_more_and_dei_must(self):
        self.assertIn('gèng shēn', P.annotate('恐惧更深', {}))
        self.assertIn('tā děi shì', P.annotate('他得是一个', {}))


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
