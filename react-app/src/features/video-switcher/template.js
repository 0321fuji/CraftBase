import { escapeAttribute, escapeHtml } from '../../utils/escape.js';
import { extractYoutubeId } from '../video/template.js';

function buildYoutubeEmbedUrl(value) {
  const id = extractYoutubeId(value);
  return id ? `https://www.youtube.com/embed/${encodeURIComponent(id)}?rel=0` : '';
}

function buildPanelContent(prefix, channel, index) {
  const embedUrl = buildYoutubeEmbedUrl(channel.youtubeUrl);

  if (embedUrl) {
    return `      <iframe
        class="${prefix}__iframe"
        src="${escapeAttribute(embedUrl)}"
        title="${escapeAttribute(channel.label || `動画 ${index + 1}`)}"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
      ></iframe>`;
  }

  return `      <div class="${prefix}__empty">
        <span class="${prefix}__empty-icon">▶</span>
        <p class="${prefix}__empty-text">${escapeHtml(channel.emptyText || '動画URLを入れるとここに表示されます。')}</p>
      </div>`;
}

export function buildVideoSwitcherHtml(state, blockId) {
  const prefix = `onb-video-switcher-${blockId}`;
  const radioName = `${prefix}-group`;
  const radios = state.channels
    .map(
      (channel, index) => `  <input type="radio" id="${prefix}-ch${index + 1}" name="${radioName}" class="${prefix}__radio" ${index === 0 ? 'checked' : ''}>`
    )
    .join('\n');

  const panels = state.channels
    .map(
      (channel, index) => `      <div class="${prefix}__panel ${prefix}__panel--${index + 1}">
${buildPanelContent(prefix, channel, index)}
      </div>`
    )
    .join('\n');

  const buttons = state.channels
    .map(
      (channel, index) => `      <label for="${prefix}-ch${index + 1}" class="${prefix}__button ${prefix}__button--${index + 1}">
        <span class="${prefix}__button-num">${index + 1}</span>
        <span>${escapeHtml(channel.label || `項目 ${index + 1}`)}</span>
      </label>`
    )
    .join('\n');

  const activeRules = state.channels
    .map(
      (_, index) => `  #${prefix}-ch${index + 1}:checked ~ .${prefix}__layout .${prefix}__panel--${index + 1} {
    opacity: 1;
    pointer-events: auto;
  }
  #${prefix}-ch${index + 1}:checked ~ .${prefix}__layout .${prefix}__button--${index + 1} {
    background: ${state.activeButtonBgColor};
    color: ${state.activeButtonTextColor};
    border-color: ${state.activeButtonBgColor};
    box-shadow: 0 6px 16px rgba(74, 144, 226, 0.18);
  }
  #${prefix}-ch${index + 1}:checked ~ .${prefix}__layout .${prefix}__button--${index + 1} .${prefix}__button-num {
    background: rgba(255, 255, 255, 0.22);
    color: ${state.activeButtonTextColor};
  }`
    )
    .join('\n');

  return `<div class="${prefix}__container">
${radios}
  <div class="${prefix}__layout">
    <div class="${prefix}__screen-area">
${panels}
    </div>
    <div class="${prefix}__button-area">
${buttons}
    </div>
  </div>
</div>
<style>
  .${prefix}__container {
    width: 100%;
    box-sizing: border-box;
    font-family: 'Helvetica Neue', Arial, 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', Meiryo, sans-serif;
  }
  .${prefix}__radio {
    display: none !important;
  }
  .${prefix}__layout {
    width: 100%;
    max-width: ${state.width};
    display: flex;
    align-items: stretch;
    gap: 12px;
    box-sizing: border-box;
  }
  .${prefix}__screen-area {
    position: relative;
    flex: 1 1 auto;
    min-width: 0;
    height: ${state.screenHeight};
    border-radius: ${state.screenRadius};
    overflow: hidden;
    background: ${state.screenBgColor};
  }
  .${prefix}__panel {
    position: absolute;
    inset: 0;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.25s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .${prefix}__iframe {
    width: 100%;
    height: 100%;
    border: none !important;
    display: block;
    background: #000000;
  }
  .${prefix}__empty {
    display: flex;
    height: 100%;
    width: 100%;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 24px;
    box-sizing: border-box;
    text-align: center;
  }
  .${prefix}__empty-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 42px;
    border-radius: 9999px;
    background: rgba(71, 85, 105, 0.1);
    color: #475569;
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 10px;
  }
  .${prefix}__empty-text {
    margin: 0;
    color: #64748b;
    font-size: 12px;
    line-height: 1.6;
  }
  .${prefix}__button-area {
    width: 148px;
    flex: 0 0 148px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 8px;
  }
  .${prefix}__button {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    box-sizing: border-box;
    padding: 10px 12px;
    border-radius: ${state.buttonRadius};
    border: 1px solid #e2e8f0;
    background: ${state.buttonBgColor};
    color: ${state.buttonTextColor};
    font-size: 12px;
    font-weight: 700;
    line-height: 1.4;
    cursor: pointer;
    user-select: none;
    transition: all 0.2s ease;
  }
  .${prefix}__button:hover {
    filter: brightness(0.98);
  }
  .${prefix}__button-num {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    flex: 0 0 18px;
    border-radius: 9999px;
    background: rgba(15, 23, 42, 0.08);
    color: ${state.buttonTextColor};
    font-size: 10px;
    font-weight: 700;
  }
${activeRules}
  @media (max-width: 520px) {
    .${prefix}__layout {
      flex-direction: column;
    }
    .${prefix}__button-area {
      width: 100%;
      flex: 0 0 auto;
    }
  }
</style>`;
}
