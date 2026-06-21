import { html, useMemo, useState } from '../../lib/react.js';
import { CodeOutputPanel } from '../../components/ui/CodeOutputPanel.js';
import { PreviewPanel } from '../../components/ui/PreviewPanel.js';
import { SectionCard } from '../../components/ui/SectionCard.js';
import { copyText } from '../../utils/clipboard.js';
import { SOLID_PRESETS } from '../cta/defaults.js';
import {
  createSyncAiButtonItem,
  createSyncAiButtonItems,
  SYNC_AI_BUTTON_PURPOSE_OPTIONS,
  SYNC_AI_CUSTOM_TAG_DEFAULTS
} from './defaults.js';
import { buildSyncAiCustomTagPrompt } from './template.js';

const INLINE_BUTTON_PURPOSE_OPTIONS = SYNC_AI_BUTTON_PURPOSE_OPTIONS.filter((option) => option.value !== 'shortcut');

function cloneDefaults() {
  return {
    ...SYNC_AI_CUSTOM_TAG_DEFAULTS,
    buttonStyle: { ...SYNC_AI_CUSTOM_TAG_DEFAULTS.buttonStyle },
    items: createSyncAiButtonItems(SYNC_AI_CUSTOM_TAG_DEFAULTS.purpose)
  };
}

function updateItemAt(items, index, patch) {
  return items.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item));
}

function normalizeHexColor(value, fallback) {
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

function getPreviewButtonStyle(form) {
  const source = form.buttonStyle || {};
  const colorMode = form.colorMode || 'gradient';
  const solidColor = String(form.solidColor || '#0066cc').trim() || '#0066cc';
  const gradientStart = String(form.gradientStart || '#0052D4').trim() || '#0052D4';
  const gradientEnd = String(form.gradientEnd || '#4364F7').trim() || '#4364F7';

  return {
    color: String(source.color || '#FFFFFF').trim() || '#FFFFFF',
    backgroundColor: colorMode === 'solid' ? solidColor : gradientStart,
    backgroundImage: colorMode === 'gradient' ? `linear-gradient(135deg, ${gradientStart} 0%, ${gradientEnd} 100%)` : 'none',
    borderColor: String(source.borderColor || '#307AF0').trim() || '#307AF0',
    borderRadius: String(source.borderRadius || '4px').trim() || '4px'
  };
}

function getPreviewItems(form) {
  const items = Array.isArray(form.items) ? form.items : [];
  const guideButtons = items
    .filter((item) => String(item.label || '').trim())
    .slice(0, 3)
    .map((item) => item.label);

  if (guideButtons.length) {
    return guideButtons;
  }

  return ['ガイドを起動'];
}

function getPurposeMeta(purpose = 'popup') {
  if (purpose === 'javascript') {
    return {
      purposeLabel: 'JavaScript実行',
      listTitle: '① JavaScript実行',
      summaryFallback: '実行ボタン',
      buttonLabel: 'ボタン表示文言',
      actionLabel: '実行するJavaScript',
      actionPlaceholder: '例: window.alert(1)',
      labelPlaceholder: '例: 実行する',
      descriptionPlaceholder: '例: 詳細な処理を起動したいと言われた場合'
    };
  }

  return {
    purposeLabel: 'ポップアップ起動',
    listTitle: '① ポップアップ起動',
    summaryFallback: 'ポップアップボタン',
    buttonLabel: 'ボタン表示文言',
    actionLabel: 'ポップアップID',
    actionPlaceholder: '例: 6721e8ada26c3adf766d0c12d73799c5',
    labelPlaceholder: '例: ガイドを起動',
    descriptionPlaceholder: '例: セグメントの作成方法を聞かれた場合'
  };
}

function getGuideSummary(item, index) {
  return item.label || item.description || `ボタン ${index + 1}`;
}

function buildLabelLinkedPatch(item, nextLabel) {
  return { label: nextLabel };
}

export function useSyncAiCustomTagGenerator() {
  const [form, setForm] = useState(cloneDefaults);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [openIndexes, setOpenIndexes] = useState([0]);
  const promptText = useMemo(() => buildSyncAiCustomTagPrompt(form), [form]);
  const previewButtonStyle = useMemo(() => getPreviewButtonStyle(form), [form]);
  const previewItems = useMemo(() => getPreviewItems(form), [form]);
  const presets = SOLID_PRESETS;
  const purposeMeta = useMemo(() => getPurposeMeta(form.purpose), [form.purpose]);

  function updateButtonStyle(key, value) {
    setForm((current) => ({
      ...current,
      buttonStyle: {
        ...current.buttonStyle,
        [key]: value
      }
    }));
  }

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function applyPreset(preset) {
    setForm((current) => ({
      ...current,
      colorMode: 'solid',
      solidColor: preset.color,
      buttonStyle: {
        ...current.buttonStyle,
        borderColor: preset.color
      }
    }));
  }

  function updateItem(index, patch) {
    setForm((current) => ({
      ...current,
      items: updateItemAt(current.items, index, patch)
    }));
  }

  function handlePurposeChange(value) {
    setForm((current) => ({
      ...current,
      purpose: value,
      items: createSyncAiButtonItems(value)
    }));
    setOpenIndexes([0]);
  }

  function addItem() {
    setForm((current) => ({
      ...current,
      items: [...current.items, createSyncAiButtonItem(current.purpose, current.items.length)]
    }));
    setOpenIndexes((current) => [...current, form.items.length]);
  }

  function removeItem(index) {
    setForm((current) => {
      if (current.items.length <= 1) {
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

  async function handleCopyPrompt() {
    await copyText(promptText);
    setCopiedPrompt(true);
    window.setTimeout(() => setCopiedPrompt(false), 1600);
  }

  return {
    controls: html`
      <div className="space-y-5">
        <${SectionCard}
          title="会話の途中ボタン"
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
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">① 目的</label>
              <select
                value=${form.purpose}
                onChange=${(event) => handlePurposeChange(event.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                ${INLINE_BUTTON_PURPOSE_OPTIONS.map((option) => html`
                  <option key=${option.value} value=${option.value}>${option.label}</option>
                `)}
              </select>
            </div>
          </div>
        </${SectionCard}>

        <${SectionCard}
          title=${purposeMeta.listTitle}
          action=${html`
            <button
              type="button"
              onClick=${addItem}
              className="rounded-lg bg-indigo-50 px-2.5 py-1.5 text-xs font-bold text-indigo-700 transition-colors hover:bg-indigo-100"
            >
              ボタンを追加
            </button>
          `}
        >
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
                className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
                  <div className="min-w-0 truncate text-sm font-bold text-slate-700">${getGuideSummary(item, index)}</div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick=${(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        removeItem(index);
                      }}
                      disabled=${form.items.length <= 1}
                      className="text-[11px] font-bold text-rose-600 transition-colors hover:text-rose-700 disabled:pointer-events-none disabled:opacity-40"
                    >
                      削除
                    </button>
                    <span className="text-xs font-bold text-slate-400">開閉</span>
                  </div>
                </summary>

                <div className="space-y-3 p-4">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-bold text-slate-700">${purposeMeta.buttonLabel}</label>
                    <input
                      type="text"
                      value=${item.label || ''}
                      onChange=${(event) => updateItem(index, buildLabelLinkedPatch(item, event.target.value))}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                      placeholder=${purposeMeta.labelPlaceholder}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-sm font-bold text-slate-700">どんな質問のときに出すか</label>
                    <textarea
                      rows="3"
                      value=${item.description || ''}
                      onChange=${(event) => updateItem(index, { description: event.target.value })}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm leading-6 text-slate-700"
                      placeholder=${purposeMeta.descriptionPlaceholder}
                    />
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="block text-sm font-bold text-slate-700">${purposeMeta.actionLabel}</label>
                      ${form.purpose === 'javascript'
                        ? html`
                            <textarea
                              rows="3"
                              value=${item.action || ''}
                              onChange=${(event) => updateItem(index, { action: event.target.value })}
                              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm leading-6 text-slate-700 font-mono"
                              placeholder=${purposeMeta.actionPlaceholder}
                            />
                          `
                        : null}
                      ${form.purpose === 'popup'
                        ? html`
                            <input
                              type="text"
                              value=${item.goalId || ''}
                              onChange=${(event) => updateItem(index, { goalId: event.target.value })}
                              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-mono"
                              placeholder=${purposeMeta.actionPlaceholder}
                            />
                          `
                        : null}
                    </div>
                  </div>
                </div>
              </details>
            `)}
          </div>
        </${SectionCard}>

        <${SectionCard} title="② ボタンの見た目">
          <div className="space-y-4">
            <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                checked=${form.includeButtonStyle}
                onChange=${(event) => setForm((current) => ({ ...current, includeButtonStyle: event.target.checked }))}
                className="rounded border-slate-300 text-indigo-600"
              />
              ボタンの見た目もプロンプトに含める
            </label>

            ${form.includeButtonStyle
              ? html`
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-bold text-slate-700">配色の設定</label>
                      <div className="flex rounded-lg bg-slate-100 p-0.5 text-xs">
                        <button
                          type="button"
                          onClick=${() => updateField('colorMode', 'solid')}
                          className="rounded-md bg-white px-3 py-1 font-bold text-slate-800 shadow-sm"
                        >
                          単色
                        </button>
                        <span
                          title="現在はグラデーションカラーは使えません"
                          className="inline-flex cursor-not-allowed"
                        >
                          <button
                            type="button"
                            disabled
                            className="rounded-md px-3 py-1 font-bold text-slate-400"
                          >
                            グラデーション
                          </button>
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="block text-xs font-semibold text-slate-400">単色: 推奨カラープリセット</span>
                      <div className="grid grid-cols-5 gap-2">
                        ${presets.map((preset) => {
                          const selected = form.solidColor === preset.color;
                          const style = { backgroundColor: preset.color };

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

                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                      <div className="space-y-1.5">
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">単体カラー選択</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value=${normalizeHexColor(form.solidColor, '#0066cc')}
                            onChange=${(event) => updateField('solidColor', event.target.value)}
                            className="h-8 w-8 cursor-pointer rounded border border-slate-300 bg-transparent p-0"
                          />
                          <input
                            type="text"
                            value=${form.solidColor}
                            onChange=${(event) => updateField('solidColor', event.target.value)}
                            className="w-full rounded border border-slate-300 bg-white px-2 py-1 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="block text-sm font-bold text-slate-700">文字色</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value=${normalizeHexColor(form.buttonStyle.color, '#FFFFFF')}
                          onChange=${(event) => updateButtonStyle('color', event.target.value)}
                          className="h-11 w-14 rounded border border-slate-300 bg-transparent p-1"
                        />
                        <input
                          type="text"
                          value=${form.buttonStyle.color}
                          onChange=${(event) => updateButtonStyle('color', event.target.value)}
                          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-mono"
                          placeholder="#FFFFFF"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-sm font-bold text-slate-700">枠線色</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value=${normalizeHexColor(form.buttonStyle.borderColor, form.solidColor)}
                          onChange=${(event) => updateButtonStyle('borderColor', event.target.value)}
                          className="h-11 w-14 rounded border border-slate-300 bg-transparent p-1"
                        />
                        <input
                          type="text"
                          value=${form.buttonStyle.borderColor}
                          onChange=${(event) => updateButtonStyle('borderColor', event.target.value)}
                          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-mono"
                          placeholder="#307AF0"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-sm font-bold text-slate-700">角丸</label>
                      <div>
                        <input
                          type="text"
                          value=${form.buttonStyle.borderRadius}
                          onChange=${(event) => updateButtonStyle('borderRadius', event.target.value)}
                          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-mono"
                          placeholder="4px"
                        />
                      </div>
                    </div>
                  </div>
                `
              : html`<p className="text-sm leading-6 text-slate-500">見た目を指定しない場合は、呼び出しボタンの条件だけを含むプロンプトを作ります。</p>`}
          </div>
        </${SectionCard}>
      </div>
    `,
    preview: html`
      <div className="space-y-3">
        <${PreviewPanel} darkMode=${false} headerNote="見た目サンプルです。実際の出し分けは AI の回答内容に応じて行われます。">
          <div className="space-y-4 py-2">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-bold text-slate-800">ボタンの見え方</div>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  ${form.includeButtonStyle ? '選んだ色と角丸を使ったプレビューです。' : '見た目指定なしの標準プレビューです。'}
                </p>
              </div>
              ${form.includeButtonStyle
                ? html`<span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-500">${previewButtonStyle.borderRadius}</span>`
                : null}
            </div>

            <div className="flex flex-wrap gap-3">
              ${previewItems.map((label, index) => html`
                <button
                  key=${`${label}-${index}`}
                  type="button"
                  className="min-w-[160px] px-4 py-2.5 text-sm font-bold shadow-sm"
                  style=${form.includeButtonStyle
                    ? {
                        color: previewButtonStyle.color,
                        backgroundColor: previewButtonStyle.backgroundColor,
                        backgroundImage: previewButtonStyle.backgroundImage,
                        borderColor: previewButtonStyle.borderColor,
                        borderRadius: previewButtonStyle.borderRadius,
                        borderStyle: 'solid',
                        borderWidth: '1px'
                      }
                    : {
                        color: '#0F172A',
                        backgroundColor: '#FFFFFF',
                        borderColor: '#CBD5E1',
                        borderRadius: '8px',
                        borderStyle: 'solid',
                        borderWidth: '1px'
                      }}
                >
                  ${label}
                </button>
              `)}
            </div>
          </div>
        </${PreviewPanel}>
      </div>
    `,
    code: html`
      <div className="space-y-3">
        <${CodeOutputPanel}
          value=${promptText}
          onCopy=${handleCopyPrompt}
          helperText="Sync-AI の事前プロンプトへそのまま貼り付け"
          title="AIに設定するプロンプト"
          buttonLabel="プロンプト文をコピーする"
          rows=${24}
        />
        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-600 shadow-sm">
          ${purposeMeta.purposeLabel} 用の事前プロンプト文をそのままコピーして使えます。
        </div>
        ${copiedPrompt ? html`<div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">プロンプト文をコピーしました。</div>` : null}
      </div>
    `,
    layoutMode: 'balanced'
  };
}
