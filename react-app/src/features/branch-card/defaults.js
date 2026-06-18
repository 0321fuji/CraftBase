export const BRANCH_CARD_DEFAULTS = {
  heading: 'ご希望の内容を選んでください',
  description: '目的にあわせて、最適なガイドを表示します。',
  fontFamily: "'Helvetica Neue', Arial, 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', Meiryo, sans-serif",
  headingFontSize: '20px',
  descriptionFontSize: '14px',
  itemTitleFontSize: '16px',
  itemBodyFontSize: '13px',
  radius: '14px',
  borderColor: '#cbd5e1',
  hoverBorderColor: '#94a3b8',
  backgroundColor: '#f8fafc',
  hoverBackgroundColor: '#ffffff',
  titleColor: '#0f172a',
  descriptionColor: '#475569',
  itemBodyColor: '#64748b',
  items: [
    {
      actionType: 'popup',
      title: '初期設定を進めたい',
      description: '最初に必要な設定手順をガイドで案内します。',
      popupId: '4c5a4c5ed3bf50335dcba25e38006116',
      chatId: '',
      url: ''
    },
    {
      actionType: 'popup',
      title: '使い方を知りたい',
      description: '基本操作や活用方法をまとめたガイドを表示します。',
      popupId: '7b2d8f1e9a3c4d5e6f708192ab3cd456',
      chatId: '',
      url: ''
    },
    {
      actionType: 'popup',
      title: '困りごとを解決したい',
      description: 'よくあるつまずきに応じた案内を表示します。',
      popupId: '91ac52ef847f4d73b1f8028c2d8a9e10',
      chatId: '',
      url: ''
    }
  ]
};
