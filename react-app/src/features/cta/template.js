import { escapeAttribute, escapeHtml, escapeSingleQuotedJsString } from '../../utils/escape.js';

function sanitizeToken(value, fallback = 'project') {
  const normalized = String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '');
  return normalized || fallback;
}

function getProjectTokenFromUrl(urlValue) {
  try {
    const parsed = new URL(urlValue);
    const hostname = sanitizeToken(parsed.hostname.replace(/^www\./, ''), 'project');
    const firstSegment = hostname.split('-')[0];
    return firstSegment || 'project';
  } catch (error) {
    return 'project';
  }
}

function getClassPrefix(urlValue, blockId) {
  const projectToken = getProjectTokenFromUrl(urlValue);
  return `onb-custom-${projectToken}-button-${blockId}-cta`;
}

export function getCtaCustomEventSelector(urlValue, blockId) {
  return `.${getClassPrefix(urlValue, blockId)}`;
}

function getShadowStyle(shadowType) {
  if (shadowType === 'light') {
    return 'box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);';
  }
  if (shadowType === 'medium') {
    return 'box-shadow: 0 4px 6px rgba(0, 0, 0, 0.12), 0 1px 3px rgba(0, 0, 0, 0.08);';
  }
  if (shadowType === 'strong') {
    return 'box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.15), 0 4px 6px -2px rgba(0, 0, 0, 0.1);';
  }
  return '';
}

export function buildCtaHtml(state, blockId) {
  const btnText = escapeHtml(state.buttonText);
  const targetUrl = escapeAttribute(state.url || '#');
  const popupId = escapeSingleQuotedJsString(state.popupId.trim());
  const chatId = escapeSingleQuotedJsString(state.chatId.trim());
  const classPrefix = getClassPrefix(state.url, blockId);
  const [padTopBottom = '12px', padLeftRight = '32px'] = state.paddingY.split(' ');
  const startColor = state.colorMode === 'solid' ? state.solidColor : state.gradientStart;
  const endColor = state.gradientEnd;
  const shadowStyle = getShadowStyle(state.shadowType);
  const borderStyle = state.borderWidth === '0px' ? 'none' : `solid ${state.borderWidth} ${state.borderColor}`;
  const backgroundStyle =
    state.colorMode === 'solid'
      ? `background-color: ${startColor};`
      : `background-color: ${startColor}; background: ${startColor}; background: linear-gradient(${state.gradientAngle}, ${startColor} 0%, ${endColor} 100%);`;
  const closeVisibleHintsScript = "document.querySelectorAll('.stands-hint-content').forEach(hint=>{if(window.getComputedStyle(hint).display!=='none'){const closeBtn=hint.querySelector('.stands-hint-close');if(closeBtn)closeBtn.click();}});";

  let actionElement = `<a class="${classPrefix}__action" href="${targetUrl}" target="_blank" style="display: inline-block; color: #ffffff; ${backgroundStyle} border: ${borderStyle}; border-radius: ${state.borderRadius}; box-sizing: border-box; cursor: pointer; text-decoration: none; font-size: 16px; font-weight: bold; margin: 0; padding: ${padTopBottom} ${padLeftRight}; text-transform: none; transition: background-color 0.2s ease, border-color 0.2s ease; ${shadowStyle}">${btnText}</a>`;

  if (state.actionType === 'popup') {
    actionElement = `<button type="button" class="${classPrefix}__action" onclick="STANDSMotion.changeGoal('${popupId}');${closeVisibleHintsScript}" style="display: inline-block; color: #ffffff; ${backgroundStyle} border: ${borderStyle}; border-radius: ${state.borderRadius}; box-sizing: border-box; cursor: pointer; text-decoration: none; font-size: 16px; font-weight: bold; margin: 0; padding: ${padTopBottom} ${padLeftRight}; text-transform: none; transition: background-color 0.2s ease, border-color 0.2s ease; ${shadowStyle}">${btnText}</button>`;
  } else if (state.actionType === 'chat') {
    actionElement = `<button type="button" class="${classPrefix}__action" onclick="STANDSMotion.mountAiChat('${chatId}');${closeVisibleHintsScript}" style="display: inline-block; color: #ffffff; ${backgroundStyle} border: ${borderStyle}; border-radius: ${state.borderRadius}; box-sizing: border-box; cursor: pointer; text-decoration: none; font-size: 16px; font-weight: bold; margin: 0; padding: ${padTopBottom} ${padLeftRight}; text-transform: none; transition: background-color 0.2s ease, border-color 0.2s ease; ${shadowStyle}">${btnText}</button>`;
  }

  return `<!-- CTA BUTTON SECTION START -->\n<div class="${classPrefix}" style="text-align: ${state.alignment}; margin: 20px 0; font-family: ${state.fontFamily};">\n  ${actionElement}\n</div>\n<!-- CTA BUTTON SECTION END -->`;
}
