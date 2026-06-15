export const SYNC_AI_DEFAULTS = {
  systemPrompt: `あなたはお客様向けの案内AIです。
丁寧で簡潔な日本語で回答してください。
不明点は断定せず、必要な情報を確認してください。`,
  placeholder: 'メッセージを入力',
  buttonText: '送信'
};

export const SYNC_AI_PULLDOWN_DEFAULTS = {
  dropdownLabel: 'ラベル',
  placeholder: 'メッセージを入力',
  buttonText: '送信',
  items: [
    {
      menuLabel: 'メニューA',
      prompt: ''
    },
    {
      menuLabel: 'メニューB',
      prompt: ''
    }
  ]
};
