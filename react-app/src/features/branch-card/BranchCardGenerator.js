import { html, useMemo, useState } from '../../lib/react.js';
import { CodeOutputPanel } from '../../components/ui/CodeOutputPanel.js';
import { PreviewPanel } from '../../components/ui/PreviewPanel.js';
import { SectionCard } from '../../components/ui/SectionCard.js';
import { FontSizeField } from '../../components/ui/FontSizeField.js';
import { copyText } from '../../utils/clipboard.js';
import { generateRandomId } from '../../utils/randomId.js';
import { FONT_FAMILY_OPTIONS } from '../cta/defaults.js';
import { BRANCH_CARD_DEFAULTS } from './defaults.js';
import { buildBranchCardHtml } from './template.js';

const ACTION_OPTIONS = [
  { value: 'popup', label: 'ポップアップ起動' },
  { value: 'chat', label: 'チャット起動' },
  { value: 'link', label: 'リンク先URLへ遷移' }
];

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
    actionType: 'popup',
    title: `追加の案内 ${index + 1}`,
    description: 'この選択肢向けに出したいガイド内容を短く補足できます。',
    popupId: '',
    chatId: '',
    url: ''
  };
}

function getActionValueKey(actionType) {
  if (actionType === 'chat') {
    return 'chatId';
  }

  if (actionType === 'link') {
    return 'url';
  }

  return 'popupId';
}

function getActionFieldLabel(actionType) {
  if (actionType === 'chat') {
    return 'チャットID';
  }

  if (actionType === 'link') {
    return 'リンク先URL';
  }

  return 'ポップアップID';
}

function getActionPlaceholder(actionType) {
  if (actionType === 'chat') {
    return '例: 805c6fc516cc5a5c044d73661c56af6f';
  }

  if (actionType === 'link') {
    return 'https://example.com';
  }

  return '例: 4c5a4c5ed3bf50335dcba25e38006116';
}

function getActionHelperText(actionType) {
  if (actionType === 'chat') {
    return '押したときに起動したいチャットIDを入れます。';
  }

  if (actionType === 'link') {
    return '押したときに開きたいリンク先URLを入れます。';
  }

  return '押したときに起動したいポップアップIDを入れます。';
}

function getActionSummary(item) {
  const actionType = item.actionType || 'popup';

  if (actionType === 'chat') {
    return item.chatId ? `チャット: ${item.chatId}` : 'チャットID未入力';
  }

  if (actionType === 'link') {
    return item.url ? `リンク: ${item.url}` : 'リンク先URL未入力';
  }

  return item.popupId ? `ポップアップ: ${item.popupId}` : 'ポップアップID未入力';
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
    let nextIndex = form.items.length;

    setForm((current) => {
      if (current.items.length >= 5) {
        nextIndex = current.items.length - 1;
        return current;
      }

      nextIndex = current.items.length;

      return {
        ...current,
        items: [...current.items, createAdditionalItem(current.items.length)]
      };
    });
    setOpenIndexes((current) => (current.includes(nextIndex) ? current : [...current, nextIndex]));
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
                <${FontSizeField}
                  label="見出しサイズ"
                  value=${form.headingFontSize}
                  onChange=${(value) => updateField('headingFontSize', value)}
                  inputClassName="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono"
                />
                <${FontSizeField}
                  label="補足文サイズ"
                  value=${form.descriptionFontSize}
                  onChange=${(value) => updateField('descriptionFontSize', value)}
                  inputClassName="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono"
                />
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
              <${FontSizeField}
                label="選択肢見出しサイズ"
                value=${form.itemTitleFontSize}
                onChange=${(value) => updateField('itemTitleFontSize', value)}
                inputClassName="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono"
              />
              <${FontSizeField}
                label="選択肢補足文サイズ"
                value=${form.itemBodyFontSize}
                onChange=${(value) => updateField('itemBodyFontSize', value)}
                inputClassName="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono"
              />
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
                <summary className="flex cursor-pointer list-none items-start justify-between gap-3 border-b border-slate-200 px-3 py-3 text-sm text-slate-700">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1.5 text-[10px] font-bold text-slate-500 ring-1 ring-slate-200">${index + 1}</span>
                      <span className="truncate text-sm font-bold text-slate-800">${item.title || `選択肢 ${index + 1}`}</span>
                    </div>
                    <p className="mt-1 max-h-10 overflow-hidden text-xs leading-5 text-slate-500">${item.description || '補足文は未入力です。'}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center rounded-full bg-white px-2 py-1 text-[10px] font-bold text-slate-600 ring-1 ring-slate-200">
                        ${ACTION_OPTIONS.find((option) => option.value === (item.actionType || 'popup'))?.label || 'ポップアップ起動'}
                      </span>
                      <span className="min-w-0 break-all text-[10px] font-medium text-slate-400">${getActionSummary(item)}</span>
                    </div>
                  </div>
                  <span className="shrink-0 text-xs text-slate-400">${openIndexes.includes(index) ? 'たたむ' : '開く'}</span>
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
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">クリック時の動作</label>
                    <select
                      value=${item.actionType || 'popup'}
                      onChange=${(event) => updateItem(index, { actionType: event.target.value })}
                      className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-sm"
                    >
                      ${ACTION_OPTIONS.map((option) => html`<option key=${option.value} value=${option.value}>${option.label}</option>`)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">${getActionFieldLabel(item.actionType || 'popup')}</label>
                    <input
                      type=${(item.actionType || 'popup') === 'link' ? 'url' : 'text'}
                      value=${item[getActionValueKey(item.actionType || 'popup')] || ''}
                      onChange=${(event) => updateItem(index, { [getActionValueKey(item.actionType || 'popup')]: event.target.value })}
                      className="mt-1 w-full rounded-lg border border-slate-300 px-2.5 py-2 text-sm font-mono"
                      placeholder=${getActionPlaceholder(item.actionType || 'popup')}
                    />
                    <p className="mt-1 text-[11px] leading-5 text-slate-500">${getActionHelperText(item.actionType || 'popup')}</p>
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
          分岐カードは、見出しの下に複数の導線カードを並べる用途を想定しています。各カードごとにポップアップ起動、チャット起動、リンク遷移を切り替えられます。Onboarding のステップ枠を生かす前提なので、外側の囲みは出力していません。
        </div>
        ${copied ? html`<div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">HTMLコードをコピーしました。</div>` : null}
      </div>
    `
  };
}
