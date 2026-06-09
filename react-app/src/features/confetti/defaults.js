export const CONFETTI_PALETTE_OPTIONS = [
  {
    value: 'celebration',
    label: '華やか',
    colors: ['#f97316', '#facc15', '#22c55e', '#38bdf8', '#a855f7', '#fb7185']
  },
  {
    value: 'pastel',
    label: 'やわらか',
    colors: ['#fda4af', '#fde68a', '#bfdbfe', '#c4b5fd', '#a7f3d0', '#fbcfe8']
  },
  {
    value: 'cool',
    label: 'クール',
    colors: ['#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', '#14b8a6']
  },
  {
    value: 'warm',
    label: 'あたたかい',
    colors: ['#fb7185', '#f97316', '#f59e0b', '#facc15', '#ef4444', '#ec4899']
  }
];

export const CONFETTI_CARD_BACKGROUND_OPTIONS = [
  { value: 'white', label: '白', color: 'rgba(255, 255, 255, 0.96)' },
  { value: 'ivory', label: 'アイボリー', color: 'rgba(255, 251, 235, 0.96)' },
  { value: 'mint', label: 'ミント', color: 'rgba(236, 253, 245, 0.96)' },
  { value: 'sky', label: 'スカイ', color: 'rgba(240, 249, 255, 0.96)' },
  { value: 'rose', label: 'ローズ', color: 'rgba(255, 241, 242, 0.96)' }
];

export const CONFETTI_OUTER_BACKGROUND_OPTIONS = [
  { value: 'white', label: '白', color: 'rgba(255, 255, 255, 0.98)' },
  { value: 'gray', label: 'グレー', color: 'rgba(243, 244, 246, 0.98)' },
  { value: 'blue', label: 'ブルー', color: 'rgba(239, 246, 255, 0.98)' },
  { value: 'green', label: 'グリーン', color: 'rgba(240, 253, 244, 0.98)' },
  { value: 'cream', label: 'クリーム', color: 'rgba(255, 251, 235, 0.98)' },
  { value: 'pink', label: 'ピンク', color: 'rgba(255, 241, 242, 0.98)' }
];

export const CONFETTI_DEFAULTS = {
  messageText: 'おめでとうございます！',
  subText: '次のステップへ進みましょう',
  emoji: '🎉',
  paletteId: 'pastel',
  particleCount: 84,
  durationMs: 6200,
  repeatMode: 'every',
  placement: 'center',
  spread: 'wide',
  cardBackground: 'white',
  outerBackground: 'gray'
};
