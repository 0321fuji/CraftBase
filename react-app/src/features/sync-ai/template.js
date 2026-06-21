import { escapeAttribute, escapeHtml } from '../../utils/escape.js';

export function buildSyncAiHtml(state) {
  const systemPrompt = escapeHtml(state.systemPrompt || '');
  const placeholder = escapeAttribute(state.placeholder || '');
  const buttonText = escapeHtml(state.buttonText || '送信');

  return `<div class="onb-ai-system-prompt">${systemPrompt}</div>

<textarea class="onb-ai-prompt-input" placeholder="${placeholder}"></textarea>
<button class="onb-ai-send-button">${buttonText}</button>`;
}

function getPromptKey(index) {
  let current = index;
  let key = '';

  do {
    key = String.fromCharCode(97 + (current % 26)) + key;
    current = Math.floor(current / 26) - 1;
  } while (current >= 0);

  return key;
}

function buildPromptInstruction(promptValue, fallbackLabel) {
  const trimmed = String(promptValue || '').trim();

  if (!trimmed) {
    return escapeHtml(`${fallbackLabel}の回答ルールに従って回答してください。`);
  }

  if (/に従って回答してください。?$/.test(trimmed)) {
    return escapeHtml(trimmed);
  }

  return `${escapeHtml(trimmed)}\nに従って回答してください。`;
}

export function buildSyncAiPulldownHtml(state) {
  const dropdownLabel = escapeAttribute(state.dropdownLabel || '');
  const placeholder = escapeAttribute(state.placeholder || '');
  const buttonText = escapeHtml(state.buttonText || '送信');
  const items = Array.isArray(state.items) ? state.items : [];

  const promptBlocks = items
    .map((item, index) => {
      const promptKey = getPromptKey(index);
      const prompt = buildPromptInstruction(item.prompt, promptKey.toUpperCase());
      return `<div class="onb-ai-system-prompt" data-onb-prompt-key="${promptKey}">
${prompt}
</div>`;
    })
    .join('\n\n');

  const optionBlocks = items
    .map((item, index) => {
      const promptKey = getPromptKey(index);
      return `  <option value="${promptKey}">${escapeHtml(item.menuLabel || '')}</option>`;
    })
    .join('\n');

  return `${promptBlocks}

<select class="onb-ai-dropdown" data-onb-dropdown-label="${dropdownLabel}">
${optionBlocks}
</select>

<textarea type="text" class="onb-ai-prompt-input" placeholder="${placeholder}" ></textarea>
<button class="onb-ai-send-button">${buttonText}</button>`;
}

function getPurposeMeta(purpose = 'popup') {
  if (purpose === 'shortcut') {
    return {
      tagName: 'ShortcutButtons',
      outputName: '会話の選択肢',
      itemName: 'ボタン',
      buttonLabel: 'ボタン表示文言',
      descriptionLabel: 'どんな質問のときに出すか',
      listTitle: '選択肢一覧',
      outputLabel: '会話の選択肢ボタン',
      templateItem: {
        label: '<label>',
        message: '<message>'
      },
      multipleTemplateItems: [
        {
          label: '<label1>',
          message: '<message1>'
        },
        {
          label: '<label2>',
          message: '<message2>'
        }
      ],
      listFields: (item) => [`   送信メッセージ: ${String(item.message || '未入力')}`],
      requiredKeysText: 'data 内の各オブジェクトに label と message を必ず指定してください。'
    };
  }

  if (purpose === 'javascript') {
    return {
      tagName: 'Buttons',
      outputName: 'JavaScript実行',
      itemName: 'ボタン',
      buttonLabel: 'ボタン表示文言',
      descriptionLabel: 'どんな質問のときに出すか',
      listTitle: 'JavaScript実行ボタン一覧',
      outputLabel: 'JavaScript実行ボタン',
      templateItem: {
        type: 'button',
        label: '<label>',
        action: '<action>'
      },
      multipleTemplateItems: [
        {
          type: 'button',
          label: '<label1>',
          action: '<action1>'
        },
        {
          type: 'button',
          label: '<label2>',
          action: '<action2>'
        }
      ],
      listFields: (item) => [`   実行するJavaScript: ${String(item.action || '未入力')}`],
      requiredKeysText: 'data 内の各オブジェクトに type, label, action を必ず指定し、type は "button" を使用してください。'
    };
  }

  return {
    tagName: 'GoalLaunchers',
    outputName: 'ポップアップ起動',
    itemName: 'ボタン',
    buttonLabel: 'ボタン表示文言',
    descriptionLabel: 'どんな質問のときに出すか',
    listTitle: 'ポップアップ起動ボタン一覧',
    outputLabel: 'ポップアップ起動ボタン',
    templateItem: {
      label: '<label>',
      goalId: '<goalId>'
    },
    multipleTemplateItems: [
      {
        label: '<label1>',
        goalId: '<goalId1>'
      },
      {
        label: '<label2>',
        goalId: '<goalId2>'
      }
    ],
    listFields: (item) => [`   ポップアップID: ${String(item.goalId || '未入力')}`],
    requiredKeysText: 'data 内の各オブジェクトに label と goalId を必ず指定してください。'
  };
}

function buildSyncAiCustomTagOption(state) {
  if (!state.includeButtonStyle) {
    return null;
  }

  const source = state.buttonStyle || {};
  const buttonStyle = {};
  const colorMode = state.colorMode || 'gradient';
  const solidColor = String(state.solidColor || '').trim();
  const gradientStart = String(state.gradientStart || '').trim();
  const gradientEnd = String(state.gradientEnd || '').trim();

  if (colorMode === 'solid' && solidColor) {
    buttonStyle.backgroundColor = solidColor;
  }

  if (colorMode === 'gradient' && gradientStart && gradientEnd) {
    buttonStyle.backgroundColor = `linear-gradient(135deg, ${gradientStart} 0%, ${gradientEnd} 100%)`;
  }

  ['color', 'borderColor', 'borderRadius'].forEach((key) => {
    const value = String(source[key] || '').trim();
    if (value) {
      buttonStyle[key] = value;
    }
  });

  if (!Object.keys(buttonStyle).length) {
    return null;
  }

  return { buttonStyle };
}

function buildDataItem(item, purpose) {
  if (purpose === 'shortcut') {
    return {
      label: item.label || '',
      message: item.message || ''
    };
  }

  if (purpose === 'javascript') {
    return {
      type: 'button',
      label: item.label || '',
      action: item.action || ''
    };
  }

  return {
    label: item.label || '',
    goalId: item.goalId || ''
  };
}

function buildPayload(items, state) {
  const payload = {
    data: items.map((item) => buildDataItem(item, state.purpose))
  };
  const option = buildSyncAiCustomTagOption(state);

  if (option) {
    payload.option = option;
  }

  return payload;
}

function buildCustomTag(items, state) {
  const payload = buildPayload(items, state);
  const tagName = getPurposeMeta(state.purpose).tagName;
  return `[CustomTag]${tagName}: ${JSON.stringify(payload, null, 0)}[/CustomTag]`;
}

function buildGuideListText(items, purpose) {
  const safeItems = Array.isArray(items) ? items : [];
  const meta = getPurposeMeta(purpose);

  return safeItems
    .map((item, index) => {
      const lines = [
        `${index + 1}. ${meta.buttonLabel}: ${String(item.label || '未入力')}`,
        `   ${meta.descriptionLabel}: ${String(item.description || '未入力')}`,
        ...meta.listFields(item)
      ];

      return lines.join('\n');
    })
    .join('\n');
}

export function buildSyncAiCustomTagPrompt(state) {
  const purpose = state.purpose || 'popup';
  const meta = getPurposeMeta(purpose);
  const itemListText = buildGuideListText(state.items, purpose);
  const templateTag = buildCustomTag([meta.templateItem], state);
  const multipleTemplateTag = buildCustomTag(meta.multipleTemplateItems, state);

  const sections = [
    `ユーザーの質問内容と、${meta.listTitle}の記述を照合してください。`,
    `意味的に一致または関連性が高い${meta.itemName}が1件以上ある場合、通常の回答のあとに${meta.outputLabel}を出力してください。`,
    '一致する項目がない場合は、ボタンを出さず、通常の回答のみ返してください。',
    [
      `検索結果（${meta.listTitle}）`,
      `※ 各${meta.itemName}は以下の情報を含みます。`,
      `${meta.buttonLabel}（label）`,
      `${meta.descriptionLabel}（description）`,
      ...getPurposeMeta(purpose).listFields({ label: 'label', goalId: 'goalId', message: 'message', action: 'action' })
        .map((line) => line.replace(': label', '（label）').replace(': goalId', '（goalId）').replace(': message', '（message）').replace(': action', '（action）')),
      '',
      itemListText || `${meta.listTitle}は未入力です。`
    ].join('\n'),
    `【出力テンプレート】\n${templateTag}`,
    [
      '複数一致する場合は "data" 配列内に複数オブジェクトを含めてください。',
      '例：',
      multipleTemplateTag
    ].join('\n'),
    [
      '【制約】',
      '一覧にある値のみを使用してください（新しく生成しない）。',
      '類似度が低い項目はボタンに含めないでください。',
      '下記のタグはMarkdownのコードブロックやバッククォートで囲まずにそのまま出力してください。',
      '前後に余計な記号やインデントをつけないでください。',
      meta.requiredKeysText,
      '複数一致した場合は data 配列にオブジェクトを追加してください。',
      '出力順序は以下の通りです。',
      '1. 通常の回答（丁寧な説明）',
      `2. 必要に応じて${meta.outputLabel}`
    ].join('\n')
  ];

  return sections.join('\n\n');
}

export function buildSyncAiShortcutPrompt(state) {
  const purpose = 'shortcut';
  const meta = getPurposeMeta(purpose);
  const templateTag = buildCustomTag([meta.templateItem], { ...state, purpose });
  const multipleTemplateTag = buildCustomTag(meta.multipleTemplateItems, { ...state, purpose });
  const branches = Array.isArray(state.branches) && state.branches.length
    ? state.branches
    : [
        {
          condition: state.condition || '',
          items: Array.isArray(state.items) ? state.items : []
        }
      ];
  const branchListText = branches
    .map((branch, branchIndex) => {
      const items = Array.isArray(branch.items) ? branch.items : [];
      const optionLines = items.length
        ? items
            .map((item, itemIndex) => [
              `   ${itemIndex + 1}. ${meta.buttonLabel}: ${String(item.label || '未入力')}`,
              `      送信メッセージ: ${String(item.message || '未入力')}`
            ].join('\n'))
            .join('\n')
        : '   選択肢は未入力です。';

      return [
        `${branchIndex + 1}. 表示条件: ${String(branch.condition || '未入力')}`,
        '   表示する選択肢:',
        optionLines
      ].join('\n');
    })
    .join('\n\n');

  const sections = [
    'ユーザーの質問内容を確認し、以下の表示条件に一致する場合は、通常の回答のあとに該当する会話の選択肢ボタンを出力してください。',
    '一致する表示条件がない場合は、ボタンを出さず、通常の回答のみ返してください。',
    [
      '条件一覧',
      '※ 各条件は「表示条件」「表示する選択肢」を含みます。',
      '',
      branchListText || '条件一覧は未入力です。'
    ].join('\n'),
    `【出力テンプレート】\n${templateTag}`,
    [
      '複数の候補を出す場合は "data" 配列内に複数オブジェクトを含めてください。',
      '例：',
      multipleTemplateTag
    ].join('\n'),
    [
      '【制約】',
      'label と message は、一致した表示条件に紐づく選択肢一覧にある値のみを使用してください（新しく生成しない）。',
      '一致していない表示条件に紐づく選択肢は含めないでください。',
      '下記のタグはMarkdownのコードブロックやバッククォートで囲まずにそのまま出力してください。',
      '前後に余計な記号やインデントをつけないでください。',
      'data 内の各オブジェクトに label と message を必ず指定してください。',
      '複数一致した場合は data 配列にオブジェクトを追加してください。',
      '出力順序は以下の通りです。',
      '1. 通常の回答（丁寧な説明）',
      '2. 必要に応じて会話の選択肢ボタン'
    ].join('\n')
  ];

  return sections.join('\n\n');
}
