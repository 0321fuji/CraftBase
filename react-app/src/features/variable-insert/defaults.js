export const VARIABLE_INSERT_DEFAULTS = {
  variableKey: 'user_name',
  prefixText: '',
  useSuffix: true,
  suffixText: '様',
  fallbackText: 'お客様',
  previewValue: '山田太郎',
  fontSize: '18px',
  fontWeight: '700',
  textColor: '#0f172a',
  fontFamily: "'Helvetica Neue', Arial, 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', Meiryo, sans-serif",
  alignment: 'left',
  letterSpacing: '0px',
  lineHeight: '1.6',
  useLabelBackground: false,
  labelBackgroundColor: '#EEF2FF',
  labelBorderRadius: '999px',
  labelPaddingX: '14px',
  labelPaddingY: '6px',
  paddingTop: '4px',
  paddingBottom: '4px'
};

export const COMMON_VARIABLE_PRESETS = [
  { key: 'user_name', label: 'ユーザー名', sampleValue: '山田太郎', prefixText: '', useSuffix: true, suffixText: '様', fallbackText: 'お客様' },
  { key: 'user_group_name', label: 'グループ名', sampleValue: '株式会社サンプル', prefixText: '', useSuffix: false, suffixText: '', fallbackText: 'ご所属グループ' }
];

export const FONT_WEIGHT_OPTIONS = [
  { value: '400', label: '標準' },
  { value: '500', label: 'やや太め' },
  { value: '700', label: '太字' },
  { value: '800', label: 'かなり太字' }
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

export const FONT_SIZE_OPTIONS = ['12px', '14px', '16px', '18px', '20px', '24px'];
export const LETTER_SPACING_OPTIONS = ['0px', '0.02em', '0.04em', '0.08em'];
export const LINE_HEIGHT_OPTIONS = ['1.4', '1.6', '1.8', '2'];
export const LABEL_BORDER_RADIUS_OPTIONS = ['0px', '6px', '10px', '14px', '999px'];
export const LABEL_PADDING_X_OPTIONS = ['8px', '12px', '14px', '18px', '24px'];
export const LABEL_PADDING_Y_OPTIONS = ['2px', '4px', '6px', '8px', '10px'];
export const ALIGNMENT_OPTIONS = [
  { value: 'left', label: '左寄せ' },
  { value: 'center', label: '中央揃え' },
  { value: 'right', label: '右寄せ' }
];
