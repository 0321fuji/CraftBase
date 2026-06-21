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

export const SYNC_AI_BUTTON_PURPOSE_OPTIONS = [
  { value: 'popup', label: 'ポップアップ起動' },
  { value: 'shortcut', label: '会話の選択肢' },
  { value: 'javascript', label: 'JavaScript実行' }
];

export function createSyncAiButtonItem(purpose = 'popup', index = 0) {
  if (purpose === 'shortcut') {
    return {
      description: '',
      label: `ボタン${index + 1}`,
      message: `ボタン${index + 1}`
    };
  }

  if (purpose === 'javascript') {
    return {
      description: '',
      label: `ボタン${index + 1}`,
      action: ''
    };
  }

  return {
    description: '',
    goalId: '',
    label: `ボタン${index + 1}`
  };
}

export function createSyncAiButtonItems(purpose = 'popup') {
  return [createSyncAiButtonItem(purpose, 0)];
}

export function createSyncAiShortcutBranch(index = 0) {
  return {
    title: `最初の入力${index + 1}`,
    condition: '',
    items: [createSyncAiButtonItem('shortcut', 0)]
  };
}

export function createSyncAiShortcutBranches() {
  return [createSyncAiShortcutBranch(0)];
}

export const SYNC_AI_CUSTOM_TAG_DEFAULTS = {
  purpose: 'popup',
  includeButtonStyle: true,
  colorMode: 'solid',
  solidColor: '#0066cc',
  gradientStart: '#0052D4',
  gradientEnd: '#4364F7',
  buttonStyle: {
    color: '#FFFFFF',
    backgroundColor: '#307AF0',
    borderColor: '#307AF0',
    borderRadius: '4px'
  },
  items: createSyncAiButtonItems('popup')
};

export const SYNC_AI_SHORTCUT_DEFAULTS = {
  purpose: 'shortcut',
  condition: '',
  includeButtonStyle: true,
  colorMode: 'solid',
  solidColor: '#0066cc',
  gradientStart: '#0052D4',
  gradientEnd: '#4364F7',
  buttonStyle: {
    color: '#FFFFFF',
    backgroundColor: '#307AF0',
    borderColor: '#307AF0',
    borderRadius: '4px'
  },
  items: createSyncAiButtonItems('shortcut'),
  branches: createSyncAiShortcutBranches()
};
