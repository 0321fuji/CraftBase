import { html, useMemo, useState } from '../../lib/react.js';
import { CodeOutputPanel } from '../../components/ui/CodeOutputPanel.js';
import { PreviewPanel } from '../../components/ui/PreviewPanel.js';
import { SectionCard } from '../../components/ui/SectionCard.js';
import { copyText } from '../../utils/clipboard.js';
import { generateRandomId } from '../../utils/randomId.js';
import { INFORMATION_DEFAULTS, INFORMATION_PRESETS } from './defaults.js';
import { buildInformationHtml } from './template.js';

function cloneDefaults() {
  return { ...INFORMATION_DEFAULTS };
}

function getPreset(type, tone) {
  return INFORMATION_PRESETS[type]?.[tone] || INFORMATION_PRESETS.info.soft;
}

export function useInformationGenerator() {
  const [form, setForm] = useState(cloneDefaults);
  const [copied, setCopied] = useState(false);
  const blockId = useMemo(() => generateRandomId(7), [JSON.stringify(form)]);
  const outputHtml = useMemo(() => buildInformationHtml(form, blockId), [form, blockId]);

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function applyPreset(type, tone) {
    const preset = getPreset(type, tone);
    setForm((current) => ({
      ...current,
      type,
      tone,
      bgColor: preset.bg,
      borderColor: preset.border,
      titleColor: preset.title,
      bodyColor: preset.body
    }));
  }

  async function handleCopy() {
    await copyText(outputHtml);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  function resetAll() {
    setForm(cloneDefaults());
  }

  return {
    controls: html`
      <${SectionCard}
        title="React移行: インフォメーション"
        action=${html`
          <button type="button" onClick=${resetAll} className="text-xs text-slate-500 transition-colors hover:text-indigo-600">
            初期化
          </button>
        `}
      >
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-bold text-slate-700">アイコン</label>
            <select
              value=${form.type}
              onChange=${(event) => applyPreset(event.target.value, form.tone)}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            >
              <option value="info">お知らせ</option>
              <option value="caution">注意</option>
              <option value="forbidden">禁止</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700">見た目の方向</label>
            <select
              value=${form.tone}
              onChange=${(event) => applyPreset(form.type, event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            >
              <option value="soft">やわらかい</option>
              <option value="strong">強めの警告</option>
              <option value="simple">シンプルな業務連絡</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-700">タイトル</label>
          <input
            type="text"
            value=${form.title}
            onChange=${(event) => updateField('title', event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-700">本文</label>
          <textarea
            rows="4"
            value=${form.body}
            onChange=${(event) => updateField('body', event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>

        <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
          <input
            type="checkbox"
            checked=${form.showIcon}
            onChange=${(event) => updateField('showIcon', event.target.checked)}
            className="rounded border-slate-300 text-indigo-600"
          />
          アイコンを表示する
        </label>

        <div className="space-y-3 border-t border-slate-100 pt-4">
          <label className="block text-sm font-bold text-slate-700">デザイン調整</label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">タイトル文字サイズ</label>
              <select value=${form.titleFontSize} onChange=${(event) => updateField('titleFontSize', event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2 py-2 text-xs">
                <option value="11px">11px</option>
                <option value="13px">13px</option>
                <option value="15px">15px</option>
                <option value="17px">17px</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">本文文字サイズ</label>
              <select value=${form.bodyFontSize} onChange=${(event) => updateField('bodyFontSize', event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2 py-2 text-xs">
                <option value="11px">11px</option>
                <option value="13px">13px</option>
                <option value="15px">15px</option>
                <option value="17px">17px</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">背景色</label>
              <input type="color" value=${form.bgColor} onChange=${(event) => updateField('bgColor', event.target.value)} className="mt-1 h-9 w-full rounded border border-slate-300" />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">枠線色</label>
              <input type="color" value=${form.borderColor} onChange=${(event) => updateField('borderColor', event.target.value)} className="mt-1 h-9 w-full rounded border border-slate-300" />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">タイトル色</label>
              <input type="color" value=${form.titleColor} onChange=${(event) => updateField('titleColor', event.target.value)} className="mt-1 h-9 w-full rounded border border-slate-300" />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">本文色</label>
              <input type="color" value=${form.bodyColor} onChange=${(event) => updateField('bodyColor', event.target.value)} className="mt-1 h-9 w-full rounded border border-slate-300" />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">角丸</label>
              <select value=${form.radius} onChange=${(event) => updateField('radius', event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2 py-2 text-xs">
                <option value="4px">4px</option>
                <option value="8px">8px</option>
                <option value="10px">10px</option>
                <option value="14px">14px</option>
              </select>
            </div>
          </div>
        </div>
      </${SectionCard}>
    `,
    preview: html`
      <${PreviewPanel} darkMode=${false}>
        <div className="py-2" dangerouslySetInnerHTML=${{ __html: outputHtml }} />
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

