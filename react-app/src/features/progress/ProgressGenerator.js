import { html, useMemo, useState } from '../../lib/react.js';
import { PreviewPanel } from '../../components/ui/PreviewPanel.js';
import { SectionCard } from '../../components/ui/SectionCard.js';
import { copyText } from '../../utils/clipboard.js';
import { generateRandomId } from '../../utils/randomId.js';
import { PROGRESS_DEFAULTS } from './defaults.js';
import { buildAllProgressHtml, buildProgressHtml } from './template.js';

function cloneDefaults() {
  return { ...PROGRESS_DEFAULTS };
}

function normalizeTotal(value) {
  return Math.min(8, Math.max(2, Number(value) || 4));
}

export function useProgressGenerator() {
  const [form, setForm] = useState(cloneDefaults);
  const [copiedLabel, setCopiedLabel] = useState('');
  const blockId = useMemo(() => generateRandomId(7), [JSON.stringify(form)]);
  const stepHtml = useMemo(() => buildAllProgressHtml(form, blockId), [form, blockId]);
  const previewHtml = useMemo(() => buildProgressHtml(form, blockId, form.currentStep), [form, blockId]);

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function updateTotal(value) {
    const total = normalizeTotal(value);
    setForm((current) => ({
      ...current,
      totalSteps: total,
      currentStep: Math.min(total, Math.max(1, current.currentStep))
    }));
  }

  async function copyStep(index) {
    await copyText(stepHtml[index]);
    setCopiedLabel(`ステップ ${index + 1} 用コードをコピーしました。`);
    window.setTimeout(() => setCopiedLabel(''), 1600);
  }

  async function copyAll() {
    await copyText(stepHtml.join('\n\n'));
    setCopiedLabel('全ステップ分のコードをコピーしました。');
    window.setTimeout(() => setCopiedLabel(''), 1600);
  }

  function resetAll() {
    setForm(cloneDefaults());
  }

  return {
    controls: html`
      <${SectionCard}
        title="プログレスバー"
        action=${html`<button type="button" onClick=${resetAll} className="text-xs text-slate-500 transition-colors hover:text-indigo-600">初期化</button>`}
      >
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-bold text-slate-700">総ステップ数</label>
            <select value=${form.totalSteps} onChange=${(event) => updateTotal(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm">
              ${[2, 3, 4, 5, 6, 7, 8].map((count) => html`<option key=${count} value=${count}>${count}</option>`)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700">プレビュー中のステップ</label>
            <select value=${form.currentStep} onChange=${(event) => updateField('currentStep', Number(event.target.value))} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm">
              ${Array.from({ length: normalizeTotal(form.totalSteps) }, (_, index) => html`<option key=${index + 1} value=${index + 1}>${index + 1} / ${normalizeTotal(form.totalSteps)}</option>`)}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-700">ラベル</label>
          <input type="text" value=${form.labelPrefix} onChange=${(event) => updateField('labelPrefix', event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        </div>

        <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
          <input type="checkbox" checked=${form.showCounter} onChange=${(event) => updateField('showCounter', event.target.checked)} className="rounded border-slate-300 text-indigo-600" />
          数字表示を出す
        </label>

        <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">進捗色</label>
            <input type="color" value=${form.activeColor} onChange=${(event) => updateField('activeColor', event.target.value)} className="mt-1 h-9 w-full rounded border border-slate-300" />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">背景色</label>
            <input type="color" value=${form.inactiveColor} onChange=${(event) => updateField('inactiveColor', event.target.value)} className="mt-1 h-9 w-full rounded border border-slate-300" />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">ラベル色</label>
            <input type="color" value=${form.labelColor} onChange=${(event) => updateField('labelColor', event.target.value)} className="mt-1 h-9 w-full rounded border border-slate-300" />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">数字色</label>
            <input type="color" value=${form.metaColor} onChange=${(event) => updateField('metaColor', event.target.value)} className="mt-1 h-9 w-full rounded border border-slate-300" />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">ラベル文字サイズ</label>
            <select value=${form.labelFontSize} onChange=${(event) => updateField('labelFontSize', event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2 py-2 text-xs">
              <option value="10px">10px</option>
              <option value="12px">12px</option>
              <option value="14px">14px</option>
              <option value="16px">16px</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">バーの高さ</label>
            <select value=${form.barHeight} onChange=${(event) => updateField('barHeight', event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2 py-2 text-xs">
              <option value="4px">4px</option>
              <option value="6px">6px</option>
              <option value="8px">8px</option>
              <option value="12px">12px</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">全体幅</label>
            <select value=${form.width} onChange=${(event) => updateField('width', event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2 py-2 text-xs">
              <option value="100%">100%</option>
              <option value="90%">90%</option>
              <option value="80%">80%</option>
              <option value="70%">70%</option>
              <option value="60%">60%</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">配置</label>
            <select value=${form.alignment} onChange=${(event) => updateField('alignment', event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2 py-2 text-xs">
              <option value="left">左</option>
              <option value="center">中央</option>
              <option value="right">右</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">角丸</label>
            <select value=${form.radius} onChange=${(event) => updateField('radius', event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2 py-2 text-xs">
              <option value="0px">0px</option>
              <option value="4px">4px</option>
              <option value="999px">丸</option>
            </select>
          </div>
        </div>
      </${SectionCard}>
    `,
    preview: html`
      <${PreviewPanel} darkMode=${false}>
        <div className="py-2" dangerouslySetInnerHTML=${{ __html: previewHtml }} />
      </${PreviewPanel}>
    `,
    code: html`
      <div className="space-y-3 rounded-2xl bg-slate-900 p-6 text-slate-300 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <span className="text-sm font-bold text-slate-100">ステップ別コード</span>
          <button type="button" onClick=${copyAll} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-indigo-500">全てコピー</button>
        </div>
        <div className="space-y-3">
          ${stepHtml.map(
            (code, index) => html`
              <details key=${index} open=${index + 1 === form.currentStep} className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950/70">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 border-b border-slate-800 px-4 py-3">
                  <span className="text-xs font-bold text-slate-200">ステップ ${index + 1} 用コード</span>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick=${(event) => { event.preventDefault(); copyStep(index); }} className="rounded-lg bg-slate-800 px-2.5 py-1 text-[11px] font-bold text-slate-100 transition-colors hover:bg-slate-700">コピー</button>
                    <span className="text-[11px] font-bold text-slate-500">開閉</span>
                  </div>
                </summary>
                <div className="p-4">
                  <textarea readOnly rows="8" value=${code} className="w-full resize-none bg-transparent font-mono text-xs text-indigo-300 focus:outline-none" />
                </div>
              </details>
            `
          )}
        </div>
        ${copiedLabel ? html`<div className="rounded-xl border border-emerald-700 bg-emerald-950 px-4 py-3 text-sm font-medium text-emerald-200">${copiedLabel}</div>` : null}
      </div>
    `
  };
}

