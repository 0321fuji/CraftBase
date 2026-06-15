import { html, useMemo, useState } from '../../lib/react.js';
import {
  CTA_DEFAULTS,
  FONT_FAMILY_OPTIONS,
  FONT_SIZE_OPTIONS,
  GRADIENT_PRESETS,
  SOLID_PRESETS
} from './defaults.js';
import { buildCtaHtml } from './template.js';
import { copyText } from '../../utils/clipboard.js';
import { generateRandomId } from '../../utils/randomId.js';
import { SectionCard } from '../../components/ui/SectionCard.js';
import { PreviewPanel } from '../../components/ui/PreviewPanel.js';
import { CodeOutputPanel } from '../../components/ui/CodeOutputPanel.js';
import { getCtaCustomEventSelector } from './template.js';

function cloneDefaults() {
  return { ...CTA_DEFAULTS };
}

export function useCtaGenerator() {
  const [form, setForm] = useState(cloneDefaults);
  const [copied, setCopied] = useState(false);
  const [customEventCopied, setCustomEventCopied] = useState(false);
  const blockId = useMemo(() => generateRandomId(9), [JSON.stringify(form)]);
  const outputHtml = useMemo(() => buildCtaHtml(form, blockId), [form, blockId]);
  const customEventSelector = useMemo(() => getCtaCustomEventSelector(form.url, blockId), [form.url, blockId]);
  const presets = form.colorMode === 'solid' ? SOLID_PRESETS : GRADIENT_PRESETS;

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleActionTypeChange(value) {
    setForm((current) => ({ ...current, actionType: value }));
  }

  function applyPreset(preset) {
    if (form.colorMode === 'solid') {
      setForm((current) => ({ ...current, solidColor: preset.color }));
      return;
    }
    setForm((current) => ({
      ...current,
      gradientStart: preset.start,
      gradientEnd: preset.end
    }));
  }

  function handleNoBorderChange(checked) {
    setForm((current) => {
      if (checked) {
        return {
          ...current,
          noBorder: true,
          lastBorderWidth: current.borderWidth !== '0px' ? current.borderWidth : current.lastBorderWidth,
          borderWidth: '0px'
        };
      }
      return {
        ...current,
        noBorder: false,
        borderWidth: current.borderWidth === '0px' ? current.lastBorderWidth || '1px' : current.borderWidth
      };
    });
  }

  async function handleCopy() {
    await copyText(outputHtml);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  async function handleCopyCustomEventSelector() {
    await copyText(customEventSelector);
    setCustomEventCopied(true);
    window.setTimeout(() => setCustomEventCopied(false), 1600);
  }

  function resetAll() {
    setForm(cloneDefaults());
  }

  return {
    controls: html`
      <${SectionCard}
        title="CTAボタン"
        action=${html`
          <button
            type="button"
            onClick=${resetAll}
            className="text-xs text-slate-500 transition-colors hover:text-indigo-600"
          >
            初期化
          </button>
        `}
      >
        <div className="space-y-3">
          <label className="block text-sm font-bold text-slate-700">① ボタン押下時の動作</label>
          <select
            value=${form.actionType}
            onChange=${(event) => handleActionTypeChange(event.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="link">リンク先URLへ遷移</option>
            <option value="popup">ポップアップ起動</option>
            <option value="chat">チャット起動</option>
          </select>

          ${form.actionType === 'link'
            ? html`
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">リンク先URL (遷移先)</label>
                  <input
                    type="url"
                    value=${form.url}
                    onChange=${(event) => updateField('url', event.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="https://example.com"
                  />
                </div>
              `
            : null}

          ${form.actionType === 'popup'
            ? html`
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">ポップアップID</label>
                  <input
                    type="text"
                    value=${form.popupId}
                    onChange=${(event) => updateField('popupId', event.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="例: 4c5a4c5ed3bf50335dcba25e38006116"
                  />
                  <p className="text-[11px] text-slate-500">32桁の英数字IDを想定しています。</p>
                </div>
              `
            : null}

          ${form.actionType === 'chat'
            ? html`
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">チャットID</label>
                  <input
                    type="text"
                    value=${form.chatId}
                    onChange=${(event) => updateField('chatId', event.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="例: 805c6fc516cc5a5c044d73661c56af6f"
                  />
                  <p className="text-[11px] text-slate-500">32桁の英数字IDを想定しています。</p>
                </div>
              `
            : null}
        </div>

        <div className="space-y-2">
          <label className="flex items-center justify-between text-sm font-bold text-slate-700">
            <span>② ボタンテキスト</span>
            <span className=${form.buttonText.length > 20 ? 'text-xs text-amber-600' : 'text-xs font-normal text-slate-400'}>
              ${form.buttonText.length}/20文字
            </span>
          </label>
          <input
            type="text"
            value=${form.buttonText}
            maxLength="30"
            onChange=${(event) => updateField('buttonText', event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="例: 詳細をチェックする"
          />
        </div>

        <div className="space-y-4 border-t border-slate-100 pt-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-bold text-slate-700">③ 配色の設定</label>
            <div className="flex rounded-lg bg-slate-100 p-0.5 text-xs">
              <button
                type="button"
                onClick=${() => updateField('colorMode', 'solid')}
                className=${form.colorMode === 'solid'
                  ? 'rounded-md bg-white px-3 py-1 font-bold text-slate-800 shadow-sm'
                  : 'rounded-md px-3 py-1 font-bold text-slate-500'}
              >
                単色
              </button>
              <button
                type="button"
                onClick=${() => updateField('colorMode', 'gradient')}
                className=${form.colorMode === 'gradient'
                  ? 'rounded-md bg-white px-3 py-1 font-bold text-slate-800 shadow-sm'
                  : 'rounded-md px-3 py-1 font-bold text-slate-500'}
              >
                グラデーション
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <span className="block text-xs font-semibold text-slate-400">
              ${form.colorMode === 'solid' ? '単色: 推奨カラープリセット' : 'グラデ: 推奨カラープリセット'}
            </span>
            <div className="grid grid-cols-5 gap-2">
              ${presets.map((preset) => {
                const selected = form.colorMode === 'solid'
                  ? form.solidColor === preset.color
                  : form.gradientStart === preset.start && form.gradientEnd === preset.end;
                const style = form.colorMode === 'solid'
                  ? { backgroundColor: preset.color }
                  : { background: `linear-gradient(135deg, ${preset.start} 0%, ${preset.end} 100%)` };
                return html`
                  <button
                    key=${preset.name}
                    type="button"
                    title=${preset.name}
                    style=${style}
                    onClick=${() => applyPreset(preset)}
                    className=${selected
                      ? 'flex h-10 items-center justify-center rounded-lg border-2 border-white ring-2 ring-indigo-600 ring-offset-1'
                      : 'flex h-10 items-center justify-center rounded-lg border-2 border-white ring-2 ring-transparent'}
                  >
                    ${selected ? html`<span className="text-sm font-bold text-white">✓</span>` : null}
                  </button>
                `;
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 rounded-xl border border-slate-100 bg-slate-50 p-3">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                ${form.colorMode === 'solid' ? '単体カラー選択' : '開始色'}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value=${form.colorMode === 'solid' ? form.solidColor : form.gradientStart}
                  onChange=${(event) => updateField(form.colorMode === 'solid' ? 'solidColor' : 'gradientStart', event.target.value)}
                  className="h-8 w-8 cursor-pointer rounded border border-slate-300 bg-transparent p-0"
                />
                <input
                  type="text"
                  value=${form.colorMode === 'solid' ? form.solidColor : form.gradientStart}
                  onChange=${(event) => updateField(form.colorMode === 'solid' ? 'solidColor' : 'gradientStart', event.target.value)}
                  className="w-full rounded border border-slate-300 bg-white px-2 py-1 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className=${form.colorMode === 'solid' ? 'pointer-events-none space-y-1.5 opacity-40' : 'space-y-1.5'}>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">終了色</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value=${form.gradientEnd}
                  onChange=${(event) => updateField('gradientEnd', event.target.value)}
                  className="h-8 w-8 cursor-pointer rounded border border-slate-300 bg-transparent p-0"
                />
                <input
                  type="text"
                  value=${form.gradientEnd}
                  onChange=${(event) => updateField('gradientEnd', event.target.value)}
                  className="w-full rounded border border-slate-300 bg-white px-2 py-1 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2 rounded-xl border border-slate-100 bg-slate-50 p-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">枠線の色</label>
              <label className="inline-flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked=${form.noBorder}
                  onChange=${(event) => handleNoBorderChange(event.target.checked)}
                />
                <span className="text-[10px] font-bold text-slate-600">枠線なし</span>
              </label>
            </div>
            ${form.noBorder
              ? null
              : html`
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value=${form.borderColor}
                      onChange=${(event) => updateField('borderColor', event.target.value)}
                      className="h-8 w-8 cursor-pointer rounded border border-slate-300 bg-transparent p-0"
                    />
                    <input
                      type="text"
                      value=${form.borderColor}
                      onChange=${(event) => updateField('borderColor', event.target.value)}
                      className="w-full rounded border border-slate-300 bg-white px-2 py-1 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                `}
          </div>

          ${form.colorMode === 'gradient'
            ? html`
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">グラデーションの方向</label>
                  <select
                    value=${form.gradientAngle}
                    onChange=${(event) => updateField('gradientAngle', event.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="135deg">斜め右下 (135°)</option>
                    <option value="90deg">上から下 (90°)</option>
                    <option value="180deg">左から右 (180°)</option>
                    <option value="45deg">斜め右上 (45°)</option>
                  </select>
                </div>
              `
            : null}
        </div>

        <div className="space-y-4 border-t border-slate-100 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">角の丸み</label>
              <select value=${form.borderRadius} onChange=${(event) => updateField('borderRadius', event.target.value)} className="w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs">
                <option value="0px">直角 (0px)</option>
                <option value="4px">少し丸い (4px)</option>
                <option value="8px">標準 (8px)</option>
                <option value="12px">丸み強め (12px)</option>
                <option value="999px">丸 (999px)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">立体感 (影)</label>
              <select value=${form.shadowType} onChange=${(event) => updateField('shadowType', event.target.value)} className="w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs">
                <option value="none">なし (None)</option>
                <option value="light">弱 (Light)</option>
                <option value="medium">中 (Medium)</option>
                <option value="strong">強 (Strong)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">ボタンの高さ</label>
              <select value=${form.paddingY} onChange=${(event) => updateField('paddingY', event.target.value)} className="w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs">
                <option value="10px 24px">コンパクト</option>
                <option value="12px 32px">標準 (推奨)</option>
                <option value="16px 40px">大きめ</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">枠線の太さ</label>
              <select
                value=${form.borderWidth}
                disabled=${form.noBorder}
                onChange=${(event) => updateField('borderWidth', event.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs disabled:bg-slate-100 disabled:text-slate-400"
              >
                <option value="0px">なし (0px)</option>
                <option value="1px">細い (1px)</option>
                <option value="2px">普通 (2px)</option>
                <option value="3px">太い (3px)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">フォントの種類</label>
              <select value=${form.fontFamily} onChange=${(event) => updateField('fontFamily', event.target.value)} className="w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs">
                ${FONT_FAMILY_OPTIONS.map(
                  (option) => html`<option key=${option.label} value=${option.value}>${option.label}</option>`
                )}
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">フォントサイズ</label>
              <select value=${form.fontSize} onChange=${(event) => updateField('fontSize', event.target.value)} className="w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs">
                ${FONT_SIZE_OPTIONS.map(
                  (option) => html`<option key=${option.value} value=${option.value}>${option.label}</option>`
                )}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">配置位置</label>
              <select value=${form.alignment} onChange=${(event) => updateField('alignment', event.target.value)} className="w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs">
                <option value="left">左寄せ (Left)</option>
                <option value="center">中央揃え (Center)</option>
                <option value="right">右寄せ (Right)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">フォントサイズの目安</label>
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs leading-5 text-slate-500">
                ボタン文言を少し強く見せたいときは <span className="font-mono text-slate-700">18px</span> 以上、コンパクトにしたいときは <span className="font-mono text-slate-700">14px</span> 〜 <span className="font-mono text-slate-700">15px</span> が使いやすいです。
              </div>
            </div>
          </div>
        </div>
      </${SectionCard}>
    `,
    preview: html`
      <div className="space-y-3">
        <${PreviewPanel} darkMode=${form.isDarkMode} onToggleDarkMode=${() => updateField('isDarkMode', !form.isDarkMode)}>
          <div className="py-1" dangerouslySetInnerHTML=${{ __html: outputHtml }} />
        </${PreviewPanel}>
        <p className="text-xs text-slate-500">
          既存のCTA機能を、同じ出力思想のままこの画面で調整できるようにしています。
        </p>
      </div>
    `,
    code: html`
      <div className="space-y-3">
        <${CodeOutputPanel} value=${outputHtml} onCopy=${handleCopy} />
        <div className="space-y-3 rounded-2xl border border-indigo-100 bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-bold text-slate-900">カスタムイベント設定用</div>
              <div className="mt-1 text-xs leading-5 text-slate-500">
                Onboarding のカスタムイベントにそのまま貼れるセレクタです。クリック計測したい要素の指定に使えます。
              </div>
            </div>
            <button
              type="button"
              onClick=${handleCopyCustomEventSelector}
              className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-700 transition-colors hover:bg-indigo-100"
            >
              セレクタをコピー
            </button>
          </div>
          <div className="space-y-2">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">設定用セレクタ</label>
            <input
              type="text"
              readOnly
              value=${customEventSelector}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-sm text-slate-700 focus:outline-none"
            />
          </div>
          ${customEventCopied
            ? html`<div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">カスタムイベント用セレクタをコピーしました。</div>`
            : null}
        </div>
        ${copied ? html`<div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">HTMLコードをコピーしました。</div>` : null}
      </div>
    `
  };
}
