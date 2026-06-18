import { escapeHtml } from '../../utils/escape.js';
import { normalizeFontSize } from '../../utils/size.js';

export function buildChecklistHtml(state, blockId) {
  const prefix = `onb-checklist-project-${blockId}`;
  const strikeStyle = state.strikeChecked ? 'line-through' : 'none';
  const fontSize = normalizeFontSize(state.fontSize, '14px');
  const checklistItemsHtml = state.items
    .map((item, index) => {
      const inputId = `${prefix}-item-${index + 1}`;
      return `  <label class="${prefix}__item" for="${inputId}">
    <input id="${inputId}" class="${prefix}__checkbox" type="checkbox"${item.checked ? ' checked' : ''} />
    <span class="${prefix}__box" aria-hidden="true"><span class="${prefix}__checkmark">✔</span></span>
    <span class="${prefix}__text">${escapeHtml(item.text)}</span>
  </label>`;
    })
    .join('\n');

  return `<div class="${prefix}">
${checklistItemsHtml}
</div>
<style>
  .${prefix} {
    width: 100%;
    margin: 16px 0;
    box-sizing: border-box;
  }
  .${prefix}__item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    margin-bottom: ${state.itemGap};
    cursor: pointer;
  }
  .${prefix}__item:last-child {
    margin-bottom: 0;
  }
  .${prefix}__checkbox {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }
  .${prefix}__box {
    margin-top: 2px;
    width: 16px;
    height: 16px;
    flex: 0 0 16px;
    box-sizing: border-box;
    border: 1.5px solid ${state.checkColor};
    border-radius: 4px;
    background-color: #ffffff;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s ease, border-color 0.2s ease;
  }
  .${prefix}__checkmark {
    color: ${state.checkmarkColor};
    font-size: 12px;
    line-height: 1;
    opacity: 0;
    transform: scale(0.75);
    transition: opacity 0.2s ease, transform 0.2s ease;
  }
  .${prefix}__text {
    color: ${state.textColor};
    font-size: ${fontSize};
    line-height: 1.6;
    transition: color 0.2s ease, text-decoration-color 0.2s ease;
  }
  .${prefix}__checkbox:checked + .${prefix}__box {
    background-color: ${state.checkColor};
    border-color: ${state.checkColor};
  }
  .${prefix}__checkbox:checked + .${prefix}__box .${prefix}__checkmark {
    opacity: 1;
    transform: scale(1);
  }
  .${prefix}__checkbox:checked + .${prefix}__box + .${prefix}__text {
    color: ${state.checkedTextColor};
    text-decoration: ${strikeStyle};
    text-decoration-thickness: 1px;
  }
</style>`;
}
