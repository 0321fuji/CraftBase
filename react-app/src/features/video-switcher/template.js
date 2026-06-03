import { escapeAttribute, escapeHtml, escapeMultilineTextToHtml } from '../../utils/escape.js';
import { extractYoutubeId } from '../video/template.js';

function buildYoutubeEmbedUrl(value) {
  const id = extractYoutubeId(value);
  return id ? `https://www.youtube.com/embed/${encodeURIComponent(id)}?rel=0` : '';
}

function buildPanelContent(prefix, channel, index) {
  const embedUrl = buildYoutubeEmbedUrl(channel.youtubeUrl);

  if (embedUrl) {
    return `        <iframe
          class="${prefix}__iframe"
          src="${escapeAttribute(embedUrl)}"
          title="${escapeAttribute(channel.label || `動画 ${index + 1}`)}"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen
        ></iframe>`;
  }

  return `        <div class="${prefix}__empty">
          <span class="${prefix}__empty-icon">▶</span>
          <p class="${prefix}__empty-text">${escapeHtml('動画URLを入れるとここに表示されます。')}</p>
        </div>`;
}

function buildInfoContent(prefix, channel) {
  const titleBlock = channel.title ? `        <h3 class="${prefix}__title">${escapeHtml(channel.title)}</h3>\n` : '';
  const bodyBlock = channel.body ? `        <p class="${prefix}__text">${escapeMultilineTextToHtml(channel.body)}</p>\n` : '';
  const actionBlock = channel.actionButtonText
    ? `        <a class="${prefix}__detail-button" href="${escapeAttribute(channel.actionUrl || '#')}" target="_blank" rel="noopener noreferrer">${escapeHtml(channel.actionButtonText)}</a>\n`
    : '';

  return `${titleBlock}${bodyBlock}${actionBlock}`;
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
      (channel, index) => `        <div class="${prefix}__panel ${prefix}__panel--${index + 1}">
${buildPanelContent(prefix, channel, index)}
        </div>`
    )
    .join('\n');

  const buttons = state.channels
    .map(
      (channel, index) => `        <label for="${prefix}-ch${index + 1}" class="${prefix}__switch-button ${prefix}__switch-button--${index + 1}">
          <span class="${prefix}__switch-button-num">${index + 1}</span>
          <span>${escapeHtml(channel.label || `項目 ${index + 1}`)}</span>
        </label>`
    )
    .join('\n');

  const infos = state.channels
    .map(
      (channel, index) => `        <div class="${prefix}__info-panel ${prefix}__info-panel--${index + 1}">
${buildInfoContent(prefix, channel)}        </div>`
    )
    .join('\n');

  const activeRules = state.channels
    .map(
      (_, index) => `  #${prefix}-ch${index + 1}:checked ~ .${prefix}__layout .${prefix}__panel--${index + 1} {
    opacity: 1;
    pointer-events: auto;
  }
  #${prefix}-ch${index + 1}:checked ~ .${prefix}__layout .${prefix}__info-panel--${index + 1} {
    opacity: 1;
    pointer-events: auto;
  }
  #${prefix}-ch${index + 1}:checked ~ .${prefix}__layout .${prefix}__switch-button--${index + 1} {
    background: ${state.activeButtonBgColor};
    color: ${state.activeButtonTextColor};
    border-color: ${state.activeButtonBgColor};
    box-shadow: 0 6px 16px rgba(74, 144, 226, 0.18);
  }
  #${prefix}-ch${index + 1}:checked ~ .${prefix}__layout .${prefix}__switch-button--${index + 1} .${prefix}__switch-button-num {
    background: rgba(255, 255, 255, 0.22);
    color: ${state.activeButtonTextColor};
  }`
    )
    .join('\n');

  return `<div class="${prefix}__container">
${radios}
  <div class="${prefix}__layout">
    <div class="${prefix}__media-column">
      <div class="${prefix}__screen-area">
${panels}
      </div>
      <div class="${prefix}__button-area">
${buttons}
      </div>
    </div>
    <div class="${prefix}__info-area">
${infos}
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
    gap: 16px;
    box-sizing: border-box;
  }
  .${prefix}__media-column {
    flex: 0 0 55%;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .${prefix}__screen-area {
    position: relative;
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
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .${prefix}__switch-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    flex: 1 1 0;
    min-width: 0;
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
  .${prefix}__switch-button:hover {
    filter: brightness(0.98);
  }
  .${prefix}__switch-button-num {
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
  .${prefix}__info-area {
    position: relative;
    flex: 0 0 45%;
    min-width: 0;
    min-height: ${state.screenHeight};
  }
  .${prefix}__info-panel {
    position: absolute;
    inset: 0;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.25s ease;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }
  .${prefix}__title {
    margin: 0 0 8px;
    color: #1f2937;
    font-size: 15px;
    font-weight: 700;
    line-height: 1.5;
  }
  .${prefix}__text {
    margin: 0 0 16px;
    color: #64748b;
    font-size: 12px;
    line-height: 1.7;
  }
  .${prefix}__detail-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: auto;
    align-self: flex-start;
    box-sizing: border-box;
    margin-top: auto;
    appearance: none;
    -webkit-appearance: none;
    background: #ffffff !important;
    color: #475569 !important;
    border: 1px solid #cbd5e1;
    padding: 9px 14px;
    border-radius: 8px;
    font-family: inherit;
    font-weight: 600;
    font-size: 12px;
    line-height: 1.4;
    text-align: center;
    text-decoration: none !important;
  }
  .${prefix}__detail-button:hover {
    background: #f8fafc !important;
  }
${activeRules}
  @media (max-width: 520px) {
    .${prefix}__layout {
      flex-direction: column;
    }
    .${prefix}__media-column,
    .${prefix}__info-area {
      flex: 0 0 auto;
      width: 100%;
    }
    .${prefix}__button-area {
      flex-wrap: nowrap;
      overflow-x: auto;
    }
    .${prefix}__switch-button {
      flex: 0 0 auto;
      min-width: 120px;
    }
    .${prefix}__info-area {
      min-height: 180px;
    }
    .${prefix}__detail-button {
      width: 100%;
      align-self: stretch;
      justify-content: center;
    }
  }
</style>`;
}
