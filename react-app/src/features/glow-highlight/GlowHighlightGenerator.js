import { html, useMemo, useState } from '../../lib/react.js';
import { CodeOutputPanel } from '../../components/ui/CodeOutputPanel.js';
import { PreviewPanel } from '../../components/ui/PreviewPanel.js';
import { SectionCard } from '../../components/ui/SectionCard.js';
import { copyText } from '../../utils/clipboard.js';
import { generateRandomId } from '../../utils/randomId.js';
import { GLOW_COLOR_PRESETS, GLOW_HIGHLIGHT_DEFAULTS } from './defaults.js';
import { buildGlowHighlightHtml, buildGlowHighlightPreviewHtml } from './template.js';

function cloneDefaults() {
  return { ...GLOW_HIGHLIGHT_DEFAULTS };
}

function normalizeHexColor(value, fallback = '#3b82f6') {
  const trimmed = String(value || '').trim();

  if (/^#[0-9a-fA-F]{6}$/.test(trimmed)) {
    return trimmed;
  }

  if (/^#[0-9a-fA-F]{3}$/.test(trimmed)) {
    const [, r, g, b] = trimmed;
    return `#${r}${r}${g}${g}${b}${b}`;
  }

  return fallback;
}

function clampNumber(value, min, max, fallback) {
  const number = Number(value);

  if (Number.isNaN(number)) {
    return fallback;
  }

  return Math.min(max, Math.max(min, number));
}

export function useGlowHighlightGenerator() {
  const [form, setForm] = useState(cloneDefaults);
  const [copied, setCopied] = useState(false);
  const blockId = useMemo(() => generateRandomId(7), [JSON.stringify(form)]);
  const sanitizedForm = useMemo(() => ({
    ...form,
    glowColor: normalizeHexColor(form.glowColor, GLOW_HIGHLIGHT_DEFAULTS.glowColor),
    blur: clampNumber(form.blur, 12, 48, 28),
    opacity: clampNumber(form.opacity, 0.2, 1, 0.8)
  }), [form]);
  const outputHtml = useMemo(() => buildGlowHighlightHtml(sanitizedForm, blockId), [sanitizedForm, blockId]);
  const previewHtml = useMemo(() => buildGlowHighlightPreviewHtml(sanitizedForm, blockId), [sanitizedForm, blockId]);

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function resetAll() {
    setForm(cloneDefaults());
  }

  async function handleCopy() {
    await copyText(outputHtml);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return {
    controls: html`
      <div className="space-y-5">
        <${SectionCard}
          title="グローハイライト"
          action=${html`<button type="button" onClick=${resetAll} className="text-xs text-slate-500 transition-colors hover:text-indigo-600">初期化</button>`}
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">① ページURL</label>
              <input
                type="url"
                value=${form.pageUrl}
                onChange=${(event) => updateField('pageUrl', event.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="例: https://onb-demopages.vercel.app/"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">② 対象セレクタ</label>
              <textarea
                rows="3"
                value=${form.selector}
                onChange=${(event) => updateField('selector', event.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-3 font-mono text-sm leading-6 text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder='例: [data-page="dashboard"] button.bg-slate-900.text-white'
              />
              <p className="text-[11px] leading-5 text-slate-500">拡張機能が返す <code>:contains('...')</code> 付きの文字列もそのまま入れられます。文言指定がない場合は、通常のCSSセレクタとして扱います。</p>
            </div>
          </div>
        </${SectionCard}>

        <${SectionCard} title="光のパラメータ調整（検証用）">
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">発光色 (Glow Color)</label>
              <div className="grid grid-cols-5 gap-3">
                ${GLOW_COLOR_PRESETS.map((preset) => {
                  const selected = preset.value.toLowerCase() === String(sanitizedForm.glowColor || '').toLowerCase();
                  return html`
                    <button
                      key=${preset.name}
                      type="button"
                      title=${preset.name}
                      onClick=${() => updateField('glowColor', preset.value)}
                      className=${selected
                        ? 'h-16 rounded-2xl border-2 border-white ring-2 ring-slate-900 ring-offset-1'
                        : 'h-16 rounded-2xl border-2 border-white ring-2 ring-transparent'}
                      style=${{ backgroundColor: preset.value }}
                    />
                  `;
                })}
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value=${sanitizedForm.glowColor}
                  onChange=${(event) => updateField('glowColor', event.target.value)}
                  className="h-11 w-14 rounded border border-slate-300 bg-transparent p-1"
                />
                <input
                  type="text"
                  value=${sanitizedForm.glowColor}
                  onChange=${(event) => updateField('glowColor', event.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm"
                  placeholder="#3b82f6"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">光の広がり (Blur)</label>
                <span className="font-mono text-sm font-bold text-indigo-500">${sanitizedForm.blur}px</span>
              </div>
              <input
                type="range"
                min="12"
                max="48"
                step="1"
                value=${sanitizedForm.blur}
                onInput=${(event) => updateField('blur', event.target.value)}
                className="w-full accent-indigo-500"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">光の強さ (Opacity)</label>
                <span className="font-mono text-sm font-bold text-indigo-500">${sanitizedForm.opacity.toFixed(2).replace(/0+$/, '').replace(/\.$/, '')}</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="1"
                step="0.05"
                value=${sanitizedForm.opacity}
                onInput=${(event) => updateField('opacity', event.target.value)}
                className="w-full accent-indigo-500"
              />
            </div>

          </div>
        </${SectionCard}>
      </div>
    `,
    preview: html`
      <${PreviewPanel} darkMode=${false} headerNote="プレビューはサンプル要素を常時発光させています">
          <div className="py-2" dangerouslySetInnerHTML=${{ __html: previewHtml }} />
      </${PreviewPanel}>
    `,
    code: html`
      <div className="space-y-3">
        <${CodeOutputPanel} value=${outputHtml} onCopy=${handleCopy} />
        ${copied ? html`<div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">HTMLコードをコピーしました。</div>` : null}
      </div>
    `
  };
}
