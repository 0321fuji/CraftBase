export function createCompareRow(values = {}) {
  return {
    label: values.label || '',
    a: values.a || '',
    b: values.b || '',
    labelFontSize: values.labelFontSize || '16px',
    labelTextColor: values.labelTextColor || '#334155',
    labelBgColor: values.labelBgColor || '#f8fafc',
    aFontSize: values.aFontSize || '16px',
    aTextColor: values.aTextColor || '#334155',
    aBgColor: values.aBgColor || '#ffffff',
    bFontSize: values.bFontSize || '16px',
    bTextColor: values.bTextColor || '#334155',
    bBgColor: values.bBgColor || '#ffffff'
  };
}

export const COMPARE_DEFAULT_ROWS = [
  createCompareRow({ label: '月額料金', a: '¥9,800', b: '¥19,800' }),
  createCompareRow({ label: '初期設定サポート', a: 'メールのみ', b: '専任担当あり' }),
  createCompareRow({ label: '外部連携', a: '一部対応', b: 'フル対応' })
];

export const COMPARE_DEFAULTS = {
  headerLabel: '比較項目',
  colALabel: 'プランA',
  colBLabel: 'プランB',
  baseHeaderFontSize: '16px',
  colAHeaderFontSize: '16px',
  colBHeaderFontSize: '16px',
  baseHeaderTextColor: '#334155',
  baseHeaderBgColor: '#f8fafc',
  colATextColor: '#0f766e',
  colABgColor: '#e8f5f2',
  colBTextColor: '#b91c1c',
  colBBgColor: '#fef2f2',
  rows: COMPARE_DEFAULT_ROWS
};

