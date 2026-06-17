import { html, useMemo, useState } from '../../lib/react.js';
import { CodeOutputPanel } from '../../components/ui/CodeOutputPanel.js';
import { PreviewPanel } from '../../components/ui/PreviewPanel.js';
import { SectionCard } from '../../components/ui/SectionCard.js';
import { copyText } from '../../utils/clipboard.js';
import { generateRandomId } from '../../utils/randomId.js';
import { FONT_FAMILY_OPTIONS } from '../cta/defaults.js';
import { BRANCH_CARD_DEFAULTS } from './defaults.js';
import { buildBranchCardHtml } from './template.js';

function cloneDefaults() {
  return {
    ...BRANCH_CARD_DEFAULTS,
    items: BRANCH_CARD_DEFAULTS.items.map((item) => ({ ...item }))
  };
}

function updateItemAt(items, index, patch) {
  return items.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item));
}

function createAdditionalItem(index) {
  return {
    title: `追加の案内 ${index + 1}`,
    description: 'この選択肢向けに出したいガイド内容を短く補足できます。',
    popupId: ''
  };
}

export function useBranchCardGenerator() {
  const [form, setForm] = useState(cloneDefaults);
  const [copied, setCopied] = useState(false);
  const [openIndexes, setOpenIndexes] = useState([0]);
  const blockId = useMemo(() => generateRandomId(7), [JSON.stringify(form)]);
  const outputHtml = useMemo(() => buildBranchCardHtml(form, blockId), [form, blockId]);

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function updateItem(index, patch) {
    setForm((current) => ({
      ...current,
      items: updateItemAt(current.items, index, patch)
    }));
  }

  function addItem() {
    setForm((current) => {
      if (current.items.length >= 5) {
        return current;
      }

      return {
        ...current,
        items: [...current.items, createAdditionalItem(current.items.length)]
      };
    });
    setOpenIndexes((current) => [...current, form.items.length]);
  }

  function removeItem(index) {
    setForm((current) => {
      if (current.items.length <= 2) {
        return current;
      }

      return {
        ...current,
        items: current.items.filter((_, itemIndex) => itemIndex !== index)
      };
    });
    setOpenIndexes((current) => current.filter((itemIndex) => itemIndex !== index).map((itemIndex) => (itemIndex > index ? itemIndex - 1 : itemIndex)));
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
      <div className="space-y-5">
        <${SectionCard}
          title="分岐カード"
          action=${html`<button type="button" onClick=${resetAll} className="text-xs text-slate-500 transition-colors hover:text-indigo-600">初期化</button>`}
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">① 見出し</label>
              <input
                type="text"
                value=${form.heading}
                onChange=${(event) => updateField('heading', event.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="例: ご希望の内容を選んでください"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">② 補足文</label>
              <textarea
                rows="3"
                value=${form.description}
                onChange=${(event) => updateField('description', event.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-3 text-sm leading-6 text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="例: 目的にあわせて、最適なガイドを表示します。"
              />
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">共通フォント</label>
                <select
                  value=${form.fontFamily}
                  onChange=${(event) => updateField('fontFamily', event.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                >
                  ${FONT_FAMILY_OPTIONS.map((option) => html`<option key=${option.label} value=${option.value}>${option.label}</option>`)}
                </select>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">見出しサイズ</label>
                  <input
                    type="text"
                    value=${form.headingFontSize}
                    onChange=${(event) => updateField('headingFontSize', event.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    placeholder="例: 20px"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">補足文サイズ</label>
                  <input
                    type="text"
                    value=${form.descriptionFontSize}
                    onChange=${(event) => updateField('descriptionFontSize', event.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    placeholder="例: 14px"
                  />
                </div>
              </div>
            </div>
            <p className="text-[11px] leading-5 text-slate-500">サイズは px で入力します。数字だけ入れた場合も、出力時に px として扱います。</p>
          </div>
        </${SectionCard}>

        <${SectionCard}
          title="選択肢"
          action=${form.items.length < 5
            ? html`<button type="button" onClick=${addItem} className="rounded-lg bg-indigo-50 px-2.5 py-1.5 text-xs font-bold text-indigo-700 transition-colors hover:bg-indigo-100">選択肢を追加</button>`
            : html`<span className="text-xs font-medium text-slate-400">最大5つ</span>`}
        >
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">選択肢見出しサイズ</label>
                <input
                  type="text"
                  value=${form.itemTitleFontSize}
                  onChange=${(event) => updateField('itemTitleFontSize', event.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  placeholder="例: 16px"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">選択肢補足文サイズ</label>
                <input
                  type="text"
                  value=${form.itemBodyFontSize}
                  onChange=${(event) => updateField('itemBodyFontSize', event.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  placeholder="例: 13px"
                />
              </div>
            </div>

            <div className="space-y-3">
            ${form.items.map((item, index) => html`
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
                  <span className="truncate pr-3">${item.title || `選択肢 ${index + 1}`}</span>
                  <span className="text-xs text-slate-400">開閉</span>
                </summary>
                <div className="space-y-3 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">選択肢 ${index + 1}</span>
                    ${form.items.length > 2
                      ? html`<button type="button" onClick=${() => removeItem(index)} className="text-[11px] font-bold text-rose-600 transition-colors hover:text-rose-700">削除</button>`
                      : null}
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">カード見出し</label>
                    <input
                      type="text"
                      value=${item.title}
                      onChange=${(event) => updateItem(index, { title: event.target.value })}
                      className="mt-1 w-full rounded-lg border border-slate-300 px-2.5 py-2 text-sm"
                      placeholder="例: 初期設定を進めたい"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">補足文</label>
                    <textarea
                      rows="3"
                      value=${item.description || ''}
                      onChange=${(event) => updateItem(index, { description: event.target.value })}
                      className="mt-1 w-full rounded-lg border border-slate-300 px-2.5 py-2 text-sm"
                      placeholder="例: 最初に必要な設定手順をガイドで案内します。"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">ポップアップID</label>
                    <input
                      type="text"
                      value=${item.popupId}
                      onChange=${(event) => updateItem(index, { popupId: event.target.value })}
                      className="mt-1 w-full rounded-lg border border-slate-300 px-2.5 py-2 text-sm font-mono"
                      placeholder="例: 4c5a4c5ed3bf50335dcba25e38006116"
                    />
                    <p className="mt-1 text-[11px] leading-5 text-slate-500">押したときに起動したいポップアップIDを入れます。</p>
                  </div>
                </div>
              </details>
            `)}
            </div>
          </div>
        </${SectionCard}>

        <${SectionCard} title="見た目">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">角丸</label>
              <select
                value=${form.radius}
                onChange=${(event) => updateField('radius', event.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
              >
                <option value="10px">10px</option>
                <option value="14px">14px</option>
                <option value="18px">18px</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">通常時の背景色</label>
              <input
                type="color"
                value=${form.backgroundColor}
                onChange=${(event) => updateField('backgroundColor', event.target.value)}
                className="h-10 w-full rounded border border-slate-300 bg-transparent p-1"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">通常時の枠色</label>
              <input
                type="color"
                value=${form.borderColor}
                onChange=${(event) => updateField('borderColor', event.target.value)}
                className="h-10 w-full rounded border border-slate-300 bg-transparent p-1"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">ホバー時の背景色</label>
              <input
                type="color"
                value=${form.hoverBackgroundColor}
                onChange=${(event) => updateField('hoverBackgroundColor', event.target.value)}
                className="h-10 w-full rounded border border-slate-300 bg-transparent p-1"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">ホバー時の枠色</label>
              <input
                type="color"
                value=${form.hoverBorderColor}
                onChange=${(event) => updateField('hoverBorderColor', event.target.value)}
                className="h-10 w-full rounded border border-slate-300 bg-transparent p-1"
              />
            </div>
          </div>
        </${SectionCard}>
      </div>
    `,
    preview: html`
      <${PreviewPanel} darkMode=${false}>
        <div className="py-2" dangerouslySetInnerHTML=${{ __html: outputHtml }} />
      </${PreviewPanel}>
    `,
    code: html`
      <div className="space-y-3">
        <${CodeOutputPanel} value=${outputHtml} onCopy=${handleCopy} />
        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-600 shadow-sm">
          分岐カードは、見出しの下に複数のポップアップ起動カードを並べる用途を想定しています。Onboarding のステップ枠を生かす前提なので、外側の囲みは出力していません。
        </div>
        ${copied ? html`<div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">HTMLコードをコピーしました。</div>` : null}
      </div>
    `
  };
}
