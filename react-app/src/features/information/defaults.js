export const INFORMATION_PRESETS = {
  info: {
    soft: { bg: '#eff6ff', border: '#93c5fd', title: '#1d4ed8', body: '#1e3a8a' },
    strong: { bg: '#dbeafe', border: '#2563eb', title: '#1d4ed8', body: '#1e40af' },
    simple: { bg: '#ffffff', border: '#60a5fa', title: '#1d4ed8', body: '#475569' }
  },
  caution: {
    soft: { bg: '#fff7ed', border: '#fdba74', title: '#c2410c', body: '#7c2d12' },
    strong: { bg: '#fff1e6', border: '#f97316', title: '#9a3412', body: '#7c2d12' },
    simple: { bg: '#ffffff', border: '#f59e0b', title: '#92400e', body: '#57534e' }
  },
  forbidden: {
    soft: { bg: '#fef2f2', border: '#fca5a5', title: '#b91c1c', body: '#7f1d1d' },
    strong: { bg: '#fee2e2', border: '#ef4444', title: '#991b1b', body: '#7f1d1d' },
    simple: { bg: '#ffffff', border: '#f87171', title: '#b91c1c', body: '#57534e' }
  }
};

export const INFORMATION_DEFAULTS = {
  type: 'info',
  tone: 'soft',
  title: '作業前にご確認ください',
  body: 'この操作を始める前に、必要な権限と設定状況をご確認ください。\n権限が不足している場合は管理者へご相談ください。',
  showIcon: true,
  bgColor: INFORMATION_PRESETS.info.soft.bg,
  borderColor: INFORMATION_PRESETS.info.soft.border,
  titleColor: INFORMATION_PRESETS.info.soft.title,
  bodyColor: INFORMATION_PRESETS.info.soft.body,
  titleFontSize: '15px',
  bodyFontSize: '13px',
  radius: '10px'
};

