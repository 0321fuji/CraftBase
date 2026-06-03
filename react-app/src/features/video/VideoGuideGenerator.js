import { html, useMemo, useState } from '../../lib/react.js';
import { CodeOutputPanel } from '../../components/ui/CodeOutputPanel.js';
import { PreviewPanel } from '../../components/ui/PreviewPanel.js';
import { SectionCard } from '../../components/ui/SectionCard.js';
import { copyText } from '../../utils/clipboard.js';
import { generateRandomId } from '../../utils/randomId.js';
import { VIDEO_GUIDE_DEFAULTS } from './defaults.js';
import { buildVideoGuideHtml, extractYoutubeId } from './template.js';

function cloneDefaults() {
  return { ...VIDEO_GUIDE_DEFAULTS };
}

export function useVideoGuideGenerator() {
  const [form, setForm] = useState(cloneDefaults);
  const [copied, setCopied] = useState(false);
  const blockId = useMemo(() => generateRandomId(7), [JSON.stringify(form)]);
  const outputHtml = useMemo(() => buildVideoGuideHtml(form, blockId), [form, blockId]);
  const videoId = extractYoutubeId(form.youtubeUrl);

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
      <${SectionCard}
        title="動画ガイド設定"
        action=${html`<button type="button" onClick=${resetAll} className="text-xs text-slate-500 transition-colors hover:text-indigo-600">初期化</button>`}
      >
        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-700">フォーマット</label>
          <select
            value=${form.format}
            onChange=${(event) => updateField('format', event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="button-bottom">ボタン下</option>
            <option value="button-side">ボタン横</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-700">YouTube URL</label>
          <input
            type="url"
            value=${form.youtubeUrl}
            onChange=${(event) => updateField('youtubeUrl', event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="https://www.youtube.com/watch?v=..."
          />
          ${videoId ? null : html`<p className="text-[11px] font-medium text-amber-600">動画IDを読み取れません。YouTubeのURLを確認してください。</p>`}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-700">タイトル</label>
          <input
            type="text"
            value=${form.title}
            onChange=${(event) => updateField('title', event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-700">本文</label>
          <textarea
            rows="4"
            value=${form.body}
            onChange=${(event) => updateField('body', event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
            <input type="checkbox" checked=${form.showTitle} onChange=${(event) => updateField('showTitle', event.target.checked)} className="rounded border-slate-300 text-indigo-600" />
            タイトル表示
          </label>
          <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
            <input type="checkbox" checked=${form.showBody} onChange=${(event) => updateField('showBody', event.target.checked)} className="rounded border-slate-300 text-indigo-600" />
            本文表示
          </label>
          <label className="col-span-2 inline-flex items-center gap-2 text-sm font-medium text-slate-700">
            <input type="checkbox" checked=${form.showActionButton} onChange=${(event) => updateField('showActionButton', event.target.checked)} className="rounded border-slate-300 text-indigo-600" />
            ボタンを表示する
          </label>
        </div>

        ${form.showActionButton
          ? html`
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">ボタン文言</label>
                <input type="text" value=${form.actionButtonText} onChange=${(event) => updateField('actionButtonText', event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">ボタンのリンク先URL</label>
                <input type="url" value=${form.actionUrl} onChange=${(event) => updateField('actionUrl', event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="https://example.com" />
              </div>
            `
          : null}

        <details className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50" open>
          <summary className="flex cursor-pointer list-none items-center justify-between border-b border-slate-200 px-3 py-2.5 text-sm font-bold text-slate-700">
            <span>デザイン調整</span>
            <span className="text-xs text-slate-400">開閉</span>
          </summary>
          <div className="grid grid-cols-2 gap-3 p-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">表示幅</label>
              <select value=${form.cardWidth} onChange=${(event) => updateField('cardWidth', event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2 py-2 text-xs">
                <option value="100%">100%</option>
                <option value="260px">260px</option>
                <option value="280px">280px</option>
                <option value="320px">320px</option>
                <option value="360px">360px</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">動画角丸</label>
              <select value=${form.videoRadius} onChange=${(event) => updateField('videoRadius', event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2 py-2 text-xs">
                <option value="0px">0px</option>
                <option value="6px">6px</option>
                <option value="8px">8px</option>
                <option value="12px">12px</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">タイトル文字サイズ</label>
              <select value=${form.titleFontSize} onChange=${(event) => updateField('titleFontSize', event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2 py-2 text-xs">
                <option value="13px">13px</option>
                <option value="15px">15px</option>
                <option value="17px">17px</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">本文文字サイズ</label>
              <select value=${form.bodyFontSize} onChange=${(event) => updateField('bodyFontSize', event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2 py-2 text-xs">
                <option value="11px">11px</option>
                <option value="12px">12px</option>
                <option value="14px">14px</option>
              </select>
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
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">ボタン背景色</label>
              <input type="color" value=${form.buttonBgColor} onChange=${(event) => updateField('buttonBgColor', event.target.value)} className="mt-1 h-9 w-full rounded border border-slate-300" />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">ボタン文字色</label>
              <input type="color" value=${form.buttonTextColor} onChange=${(event) => updateField('buttonTextColor', event.target.value)} className="mt-1 h-9 w-full rounded border border-slate-300" />
            </div>
          </div>
        </details>
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
