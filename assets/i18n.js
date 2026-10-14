/* open-histories · i18n.js — textos de la interfaz en español, 中文 y English.
 * Módulo puro: `t(clave, idioma)` nunca lanza; cae a español y luego a la propia clave.
 */
(function (root) {
  'use strict';
  const STRINGS = {
    es: {
      back_shelf: '← La repisa', prev: '← Atrás', next: 'Siguiente →', start: 'Comenzar a leer ✨',
      cover: 'Portada', page_of: 'Página {n} de {m}', final: 'Final', sound: 'Sonido',
      listen: '🔊 Escuchar', stop: '⏹ Detener', see_idea: 'Ver una idea', hide_idea: 'Ocultar idea',
      word_card: '📖 Palabra del cuento', think_card: '💭 Piensa un momento', moral: '🌟 La enseñanza',
      quiz_title: '¿Qué aprendiste?', quiz_intro: 'Tres preguntas para ver cuánto recuerdas:',
      settings: 'Ajustes', lang_main: 'Idioma principal', subtitles: 'Subtítulos', sub_show: 'Mostrar subtítulos',
      sub_always: 'Siempre', sub_tap: 'Al tocar', sub_hidden: 'Ocultos',
      pinyin: 'Pinyin', pinyin_always: 'Siempre', pinyin_tap: 'Al tocar', pinyin_off: 'No',
      font_size: 'Tamaño de letra', voice_speed: 'Velocidad de la voz', sound_on: 'Sonido de papel',
      quality: 'Calidad', q_auto: 'Auto', q_high: 'Alta', q_mid: 'Media', q_low: 'Baja',
      reduce_motion: 'Reducir movimiento', theme: 'Tema', theme_auto: 'Auto', theme_light: 'Claro', theme_dark: 'Oscuro',
      show_terror: 'Mostrar el Rincón del terror', offline: 'Sin conexión', download_story: 'Descargar este cuento',
      download_all: 'Descargar toda la biblioteca', downloaded: 'Descargado', downloading: 'Descargando…',
      offline_ready: 'Listo para leer sin conexión', my_words: 'Mis palabras', no_words: 'Aún no guardaste palabras. Toca ⭐ en una palabra subrayada.',
      close: 'Cerrar', none: 'Ninguno', lang_es: 'Español', lang_zh: '中文', lang_en: 'English',
      shelf_title: 'La repisa', section_day: 'Para leer de día', section_night: '🎃 Rincón del terror',
      soon: 'Pronto', install: 'Instalar', update_available: 'Hay una versión nueva. Toca para actualizar.',
      lang_missing: 'Ese cuento todavía no está en {lang}; se muestra en español.', no_voice: 'Tu navegador no tiene voz para este idioma.',
      shelf_intro: 'Una repisa de cuentos clásicos de dominio público, completos y animados en papel recortado. Toca un libro para abrirlo.',
      day_sub: 'cuentos y fábulas', night_sub: 'solo para lectores valientes', terror_note: 'Clásicos del miedo, completos y sin recortes. Recomendados desde los 12 años.'
    },
    zh: {
      back_shelf: '← 书架', prev: '← 上一页', next: '下一页 →', start: '开始阅读 ✨',
      cover: '封面', page_of: '第 {n} 页，共 {m} 页', final: '结尾', sound: '声音',
      listen: '🔊 朗读', stop: '⏹ 停止', see_idea: '看看想法', hide_idea: '隐藏想法',
      word_card: '📖 故事里的词', think_card: '💭 想一想', moral: '🌟 故事告诉我们',
      quiz_title: '你学到了什么？', quiz_intro: '三个问题，看看你记得多少：',
      settings: '设置', lang_main: '主要语言', subtitles: '字幕', sub_show: '显示字幕',
      sub_always: '一直显示', sub_tap: '点击显示', sub_hidden: '隐藏',
      pinyin: '拼音', pinyin_always: '一直显示', pinyin_tap: '点击显示', pinyin_off: '不显示',
      font_size: '字号', voice_speed: '朗读速度', sound_on: '翻页声音',
      quality: '画质', q_auto: '自动', q_high: '高', q_mid: '中', q_low: '低',
      reduce_motion: '减少动画', theme: '主题', theme_auto: '自动', theme_light: '浅色', theme_dark: '深色',
      show_terror: '显示恐怖角', offline: '离线', download_story: '下载这个故事',
      download_all: '下载整个书架', downloaded: '已下载', downloading: '下载中…',
      offline_ready: '可以离线阅读', my_words: '我的生词', no_words: '还没有收藏的词。点击带下划线的词上的 ⭐。',
      close: '关闭', none: '无', lang_es: 'Español', lang_zh: '中文', lang_en: 'English',
      shelf_title: '书架', section_day: '白天读的故事', section_night: '🎃 恐怖角',
      soon: '即将上架', install: '安装', update_available: '有新版本，点击更新。',
      lang_missing: '这个故事还没有{lang}版本，现在显示西班牙语。', no_voice: '你的浏览器没有这种语言的语音。',
      shelf_intro: '一个收藏公版经典故事的书架：完整、可朗读，配有剪纸动画。点一本书就能打开。',
      day_sub: '故事与寓言', night_sub: '只给勇敢的读者', terror_note: '恐怖经典，完整不删节，建议 12 岁以上阅读。'
    },
    en: {
      back_shelf: '← The shelf', prev: '← Back', next: 'Next →', start: 'Start reading ✨',
      cover: 'Cover', page_of: 'Page {n} of {m}', final: 'The end', sound: 'Sound',
      listen: '🔊 Listen', stop: '⏹ Stop', see_idea: 'See an idea', hide_idea: 'Hide idea',
      word_card: '📖 Word from the story', think_card: '💭 Think for a moment', moral: '🌟 The lesson',
      quiz_title: 'What did you learn?', quiz_intro: 'Three questions to see how much you remember:',
      settings: 'Settings', lang_main: 'Main language', subtitles: 'Subtitles', sub_show: 'Show subtitles',
      sub_always: 'Always', sub_tap: 'On tap', sub_hidden: 'Hidden',
      pinyin: 'Pinyin', pinyin_always: 'Always', pinyin_tap: 'On tap', pinyin_off: 'Off',
      font_size: 'Text size', voice_speed: 'Voice speed', sound_on: 'Paper sounds',
      quality: 'Quality', q_auto: 'Auto', q_high: 'High', q_mid: 'Medium', q_low: 'Low',
      reduce_motion: 'Reduce motion', theme: 'Theme', theme_auto: 'Auto', theme_light: 'Light', theme_dark: 'Dark',
      show_terror: 'Show the Horror corner', offline: 'Offline', download_story: 'Download this story',
      download_all: 'Download the whole library', downloaded: 'Downloaded', downloading: 'Downloading…',
      offline_ready: 'Ready to read offline', my_words: 'My words', no_words: 'No saved words yet. Tap ⭐ on an underlined word.',
      close: 'Close', none: 'None', lang_es: 'Español', lang_zh: '中文', lang_en: 'English',
      shelf_title: 'The shelf', section_day: 'Daytime reads', section_night: '🎃 Horror corner',
      soon: 'Soon', install: 'Install', update_available: 'A new version is available. Tap to update.',
      lang_missing: 'This story is not in {lang} yet; showing Spanish.', no_voice: 'Your browser has no voice for this language.',
      shelf_intro: 'A shelf of classic public-domain stories, complete and animated in paper craft. Tap a book to open it.',
      day_sub: 'tales and fables', night_sub: 'for brave readers only', terror_note: 'Classics of fear, complete and uncut. Recommended for ages 12 and up.'
    }
  };

  function makeT(strings) {
    return function t(key, lang) {
      const l = strings[lang] && strings[lang][key];
      if (l) return l;
      const es = strings.es && strings.es[key];
      return es || key;
    };
  }
  const t = makeT(STRINGS);
  /** Reemplaza el texto de todos los [data-i18n] dentro de `rootEl`. Solo navegador. */
  function apply(rootEl, lang) {
    rootEl.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.getAttribute('data-i18n'), lang); });
  }

  const api = { STRINGS, t, makeT, apply };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (typeof window !== 'undefined') { window.OH = window.OH || {}; window.OH.i18n = api; }
})(typeof globalThis !== 'undefined' ? globalThis : this);
