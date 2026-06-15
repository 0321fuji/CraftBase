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
