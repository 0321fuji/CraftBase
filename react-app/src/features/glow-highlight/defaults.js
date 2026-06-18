export const GLOW_HIGHLIGHT_DEFAULTS = {
  pageUrl: '',
  selector: '',
  effectMode: 'intense',
  glowColor: '#3b82f6',
  blur: 28,
  opacity: 0.8
};

export const GLOW_COLOR_PRESETS = [
  { name: 'バイオレット', value: '#5b4bf0' },
  { name: 'グリーン', value: '#14996a' },
  { name: 'ブルー', value: '#3b82f6' },
  { name: 'ピンク', value: '#e11d48' },
  { name: 'オレンジ', value: '#f59e0b' }
];

export const GLOW_EFFECT_OPTIONS = [
  {
    value: 'standard',
    label: '標準',
    description: '今までに近い、常時発光の強調です。'
  },
  {
    value: 'intense',
    label: '強め',
    description: '脈動を強くして、視線をより集めやすくします。'
  },
  {
    value: 'beacon',
    label: 'ビーコン',
    description: '発光に加えて外周リングを波紋のように出します。'
  }
];
