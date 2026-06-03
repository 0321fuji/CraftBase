export const CTA_DEFAULTS = {
  buttonText: '詳細をチェックする',
  url: 'https://example.com',
  actionType: 'link',
  popupId: '',
  chatId: '',
  colorMode: 'gradient',
  solidColor: '#FF6B00',
  gradientStart: '#FF6B00',
  gradientEnd: '#FF8800',
  gradientAngle: '135deg',
  borderRadius: '8px',
  shadowType: 'medium',
  paddingY: '12px 32px',
  borderWidth: '1px',
  lastBorderWidth: '1px',
  borderColor: '#FF6B00',
  noBorder: false,
  fontFamily: "'Helvetica Neue', Arial, 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', Meiryo, sans-serif",
  alignment: 'center',
  isDarkMode: false
};

export const SOLID_PRESETS = [
  { name: 'オレンジ (CV率最大クラス)', color: '#FF6B00' },
  { name: 'ブルー (信頼・誠実)', color: '#0066cc' },
  { name: 'グリーン (安心・登録促進)', color: '#10B981' },
  { name: 'レッド (緊急性)', color: '#EF4444' },
  { name: 'ダークスレート (シック)', color: '#1E293B' }
];

export const GRADIENT_PRESETS = [
  { name: 'サンライズオレンジ', start: '#FF4500', end: '#FF8C00' },
  { name: 'オーシャンブルー', start: '#0052D4', end: '#4364F7' },
  { name: 'フォレストグリーン', start: '#11998e', end: '#38ef7d' },
  { name: 'パッションレッド', start: '#e52d27', end: '#b31217' },
  { name: 'ミッドナイトスレート', start: '#334155', end: '#0f172a' }
];

export const FONT_FAMILY_OPTIONS = [
  {
    label: 'ゴシック体 (標準 / サンセリフ)',
    value: "'Helvetica Neue', Arial, 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', Meiryo, sans-serif"
  },
  {
    label: '游ゴシック体',
    value: "'Yu Gothic', YuGothic, 'Hiragino Kaku Gothic ProN', sans-serif"
  },
  {
    label: 'メイリオ',
    value: "'Meiryo', 'MS PGothic', sans-serif"
  },
  {
    label: '明朝体 (セリフ)',
    value: "'Hiragino Mincho ProN', 'MS Mincho', Georgia, serif"
  },
  {
    label: '丸ゴシック体',
    value: "'Hiragino Maru Gothic ProN', sans-serif"
  }
];
