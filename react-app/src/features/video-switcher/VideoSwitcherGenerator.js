import { html, useMemo, useState } from '../../lib/react.js';
import { CodeOutputPanel } from '../../components/ui/CodeOutputPanel.js';
import { PreviewPanel } from '../../components/ui/PreviewPanel.js';
import { SectionCard } from '../../components/ui/SectionCard.js';
import { copyText } from '../../utils/clipboard.js';
import { generateRandomId } from '../../utils/randomId.js';
import { VIDEO_SWITCHER_DEFAULTS } from './defaults.js';
import { buildVideoSwitcherHtml } from './template.js';

function cloneDefaults() {
  return {
    ...VIDEO_SWITCHER_DEFAULTS,
    channels: VIDEO_SWITCHER_DEFAULTS.channels.map((channel) => ({ ...channel }))
  };
}

function updateChannelAt(channels, index, patch) {
  return channels.map((channel, channelIndex) => (channelIndex === index ? { ...channel, ...patch } : channel));
}

export function useVideoSwitcherGenerator() {
  const [form, setForm] = useState(cloneDefaults);
  const [copied, setCopied] = useState(false);
  const [openIndexes, setOpenIndexes] = useState([0]);
  const blockId = useMemo(() => generateRandomId(7), [JSON.stringify(form)]);
  const outputHtml = useMemo(() => buildVideoSwitcherHtml(form, blockId), [form, blockId]);

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function updateChannel(index, patch) {
    setForm((current) => ({ ...current, channels: updateChannelAt(current.channels, index, patch) }));
  }

  function resetAll() {
    setForm(cloneDefaults());
    setOpenIndexes([0]);
  }

  async function handleCopy() {
    await copyText(outputHtml);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return {
    controls: html`
      <${SectionCard}
        title="動画切り替え設定"
        action=${html`<button type="button" onClick=${resetAll} className="text-xs text-slate-500 transition-colors hover:text-indigo-600">初期化</button>`}
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-bold text-slate-700">切り替え項目</label>
            <span className="text-xs font-medium text-slate-400">3つ固定</span>
          </div>
          <div className="space-y-3">
            ${form.channels.map(
              (channel, index) => html`
                <details
                  key=${index}
                  open=${openIndexes.includes(index)}
                  onToggle=${(event) => {
                    if (event.currentTarget.open) {
                      setOpenIndexes((current) => (current.includes(index) ? current : [...current, index]));
                    } else {
                      setOpenIndexes((current) => current.filter((itemIndex) => itemIndex !== index));
                    }
                  }}
                  className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between border-b border-slate-200 px-3 py-2.5 text-sm font-bold text-slate-700">
                    <span className="truncate pr-3">${channel.label || `項目 ${index + 1}`}</span>
                    <span className="text-xs text-slate-400">開閉</span>
                  </summary>
                  <div className="space-y-3 p-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">ボタン文言</label>
                      <input
                        type="text"
                        value=${channel.label}
                        onChange=${(event) => updateChannel(index, { label: event.target.value })}
                        className="mt-1 w-full rounded-lg border border-slate-300 px-2.5 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">YouTube URL</label>
                      <input
                        type="url"
                        value=${channel.youtubeUrl}
                        onChange=${(event) => updateChannel(index, { youtubeUrl: event.target.value })}
                        className="mt-1 w-full rounded-lg border border-slate-300 px-2.5 py-2 text-sm"
                        placeholder="https://www.youtube.com/watch?v=..."
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">URL未入力時の案内文</label>
                      <textarea
                        rows="2"
                        value=${channel.emptyText}
                        onChange=${(event) => updateChannel(index, { emptyText: event.target.value })}
                        className="mt-1 w-full rounded-lg border border-slate-300 px-2.5 py-2 text-sm"
                      />
                    </div>
                  </div>
                </details>
              `
            )}
          </div>
        </div>

        <details className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50" open>
          <summary className="flex cursor-pointer list-none items-center justify-between border-b border-slate-200 px-3 py-2.5 text-sm font-bold text-slate-700">
            <span>デザイン調整</span>
            <span className="text-xs text-slate-400">開閉</span>
          </summary>
          <div className="grid grid-cols-2 gap-3 p-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">表示幅</label>
              <select value=${form.width} onChange=${(event) => updateField('width', event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2 py-2 text-xs">
                <option value="100%">100%</option>
                <option value="420px">420px</option>
                <option value="460px">460px</option>
                <option value="520px">520px</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">画面高さ</label>
              <select value=${form.screenHeight} onChange=${(event) => updateField('screenHeight', event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2 py-2 text-xs">
                <option value="180px">180px</option>
                <option value="220px">220px</option>
                <option value="260px">260px</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">画面角丸</label>
              <select value=${form.screenRadius} onChange=${(event) => updateField('screenRadius', event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2 py-2 text-xs">
                <option value="0px">0px</option>
                <option value="8px">8px</option>
                <option value="12px">12px</option>
                <option value="16px">16px</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">ボタン角丸</label>
              <select value=${form.buttonRadius} onChange=${(event) => updateField('buttonRadius', event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2 py-2 text-xs">
                <option value="8px">8px</option>
                <option value="10px">10px</option>
                <option value="12px">12px</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">画面背景色</label>
              <input type="color" value=${form.screenBgColor} onChange=${(event) => updateField('screenBgColor', event.target.value)} className="mt-1 h-9 w-full rounded border border-slate-300" />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">通常ボタン背景</label>
              <input type="color" value=${form.buttonBgColor} onChange=${(event) => updateField('buttonBgColor', event.target.value)} className="mt-1 h-9 w-full rounded border border-slate-300" />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">通常ボタン文字</label>
              <input type="color" value=${form.buttonTextColor} onChange=${(event) => updateField('buttonTextColor', event.target.value)} className="mt-1 h-9 w-full rounded border border-slate-300" />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">選択中ボタン背景</label>
              <input type="color" value=${form.activeButtonBgColor} onChange=${(event) => updateField('activeButtonBgColor', event.target.value)} className="mt-1 h-9 w-full rounded border border-slate-300" />
            </div>
            <div className="col-span-2">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">選択中ボタン文字</label>
              <input type="color" value=${form.activeButtonTextColor} onChange=${(event) => updateField('activeButtonTextColor', event.target.value)} className="mt-1 h-9 w-full rounded border border-slate-300" />
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
