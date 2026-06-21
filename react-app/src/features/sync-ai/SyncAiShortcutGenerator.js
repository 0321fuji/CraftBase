import { html, useMemo, useState } from '../../lib/react.js';
import { CodeOutputPanel } from '../../components/ui/CodeOutputPanel.js';
import { SectionCard } from '../../components/ui/SectionCard.js';
import { copyText } from '../../utils/clipboard.js';
import { SOLID_PRESETS } from '../cta/defaults.js';
import {
  createSyncAiButtonItem,
  createSyncAiShortcutBranch,
  createSyncAiShortcutBranches,
  SYNC_AI_SHORTCUT_DEFAULTS
} from './defaults.js';
import { buildSyncAiShortcutPrompt } from './template.js';

const MAX_BRANCHES = 3;
const MAX_CHOICES = 4;

function cloneDefaults() {
  return {
    ...SYNC_AI_SHORTCUT_DEFAULTS,
    buttonStyle: { ...SYNC_AI_SHORTCUT_DEFAULTS.buttonStyle },
    branches: createSyncAiShortcutBranches()
  };
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
  const solidColor = String(form.solidColor || '#0066cc').trim() || '#0066cc';

  return {
    color: String(source.color || '#FFFFFF').trim() || '#FFFFFF',
    backgroundColor: solidColor,
    borderColor: String(source.borderColor || solidColor).trim() || solidColor,
    borderRadius: String(source.borderRadius || '4px').trim() || '4px'
  };
}

function updateArrayItem(items, index, updater) {
  return items.map((item, itemIndex) => (itemIndex === index ? updater(item) : item));
}

function getChoiceSummary(choice, index) {
  return choice.label || choice.message || `選択肢${index + 1}`;
}

function buildLabelLinkedPatch(choice, nextLabel) {
  const currentLabel = String(choice.label || '');
  const currentMessage = String(choice.message || '');
  const patch = { label: nextLabel };

  if (!currentMessage || currentMessage === currentLabel) {
    patch.message = nextLabel;
  }

  return patch;
}

function getConditionLabel(index) {
  return `条件${String(index + 1).replace('1', '①').replace('2', '②').replace('3', '③')}`;
}

function getChoiceLabel(index) {
  return `選択肢${String(index + 1).replace('1', '①').replace('2', '②').replace('3', '③').replace('4', '④')}`;
}

export function useSyncAiShortcutGenerator() {
  const [form, setForm] = useState(cloneDefaults);
  const [selectedBranchIndex, setSelectedBranchIndex] = useState(0);
  const [selectedChoiceIndex, setSelectedChoiceIndex] = useState(0);
  const [previewInputs, setPreviewInputs] = useState([]);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const promptText = useMemo(() => buildSyncAiShortcutPrompt(form), [form]);
  const previewButtonStyle = useMemo(() => getPreviewButtonStyle(form), [form]);
  const presets = SOLID_PRESETS;
  const branches = Array.isArray(form.branches) && form.branches.length ? form.branches : createSyncAiShortcutBranches();
  const activeBranch = branches[selectedBranchIndex] || branches[0];
  const activeChoices = Array.isArray(activeBranch.items) ? activeBranch.items : [];
  const activeChoice = activeChoices[selectedChoiceIndex] || activeChoices[0];

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function updateButtonStyle(key, value) {
    setForm((current) => ({
      ...current,
      buttonStyle: {
        ...current.buttonStyle,
        [key]: value
      }
    }));
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

  function updateBranch(index, patch) {
    setForm((current) => ({
      ...current,
      branches: updateArrayItem(current.branches || [], index, (branch) => ({
        ...branch,
        ...patch
      }))
    }));
  }

  function updateChoice(branchIndex, choiceIndex, patch) {
    setForm((current) => ({
      ...current,
      branches: updateArrayItem(current.branches || [], branchIndex, (branch) => ({
        ...branch,
        items: updateArrayItem(branch.items || [], choiceIndex, (choice) => ({
          ...choice,
          ...patch
        }))
      }))
    }));
  }

  function addBranch() {
    setForm((current) => {
      const currentBranches = current.branches || [];
      if (currentBranches.length >= MAX_BRANCHES) {
        return current;
      }

      return {
        ...current,
        branches: [...currentBranches, createSyncAiShortcutBranch(currentBranches.length)]
      };
    });
    const nextIndex = Math.min(branches.length, MAX_BRANCHES - 1);
    setSelectedBranchIndex(nextIndex);
    setSelectedChoiceIndex(0);
    setPreviewInputs([]);
  }

  function addChoice() {
    const nextIndex = activeChoices.length;

    setForm((current) => ({
      ...current,
      branches: updateArrayItem(current.branches || [], selectedBranchIndex, (branch) => {
        const items = branch.items || [];
        if (items.length >= MAX_CHOICES) {
          return branch;
        }

        return {
          ...branch,
          items: [...items, createSyncAiButtonItem('shortcut', items.length)]
        };
      })
    }));
    setSelectedChoiceIndex(Math.min(nextIndex, MAX_CHOICES - 1));
  }

  function removeBranch(index) {
    setForm((current) => {
      const currentBranches = current.branches || [];
      if (currentBranches.length <= 1) {
        return current;
      }

      return {
        ...current,
        branches: currentBranches.filter((_, itemIndex) => itemIndex !== index)
      };
    });
    setSelectedBranchIndex((current) => Math.max(0, current > index ? current - 1 : Math.min(current, branches.length - 2)));
    setSelectedChoiceIndex(0);
    setPreviewInputs([]);
  }

  function removeChoice(index) {
    setForm((current) => ({
      ...current,
      branches: updateArrayItem(current.branches || [], selectedBranchIndex, (branch) => {
        const items = branch.items || [];
        if (items.length <= 1) {
          return branch;
        }

        return {
          ...branch,
          items: items.filter((_, itemIndex) => itemIndex !== index)
        };
      })
    }));
    setSelectedChoiceIndex((current) => Math.max(0, current > index ? current - 1 : Math.min(current, activeChoices.length - 2)));
  }

  function resetAll() {
    setForm(cloneDefaults());
    setSelectedBranchIndex(0);
    setSelectedChoiceIndex(0);
    setPreviewInputs([]);
  }

  function appendPreviewInput(choice) {
    const value = String(choice?.message || choice?.label || '').trim();

    if (!value) {
      return;
    }

    setPreviewInputs((current) => [...current, value]);
  }

  async function handleCopyPrompt() {
    await copyText(promptText);
    setCopiedPrompt(true);
    window.setTimeout(() => setCopiedPrompt(false), 1600);
  }

  const canAddBranch = branches.length < MAX_BRANCHES;
  const canAddChoice = activeChoices.length < MAX_CHOICES;

  return {
    controls: html`
      <div className="space-y-5">
        <${SectionCard}
          title="会話の選択肢"
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
          <div className="grid gap-4 xl:grid-cols-[260px_260px_minmax(360px,1fr)]">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-800">表示条件</h3>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-500">${branches.length}/${MAX_BRANCHES}</span>
              </div>

              <div className="space-y-2">
                ${branches.map((branch, index) => {
                  const selected = index === selectedBranchIndex;

                  return html`
                    <div
                      key=${index}
                      onClick=${() => {
                        setSelectedBranchIndex(index);
                        setSelectedChoiceIndex(0);
                        setPreviewInputs([]);
                      }}
                      className=${selected
                        ? 'space-y-3 rounded-xl border border-indigo-300 bg-indigo-50 px-3 py-3 shadow-sm'
                        : 'space-y-3 rounded-xl border border-slate-200 bg-white px-3 py-3 transition-colors hover:border-slate-300'}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-sm font-bold text-slate-800">${getConditionLabel(index)}</div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick=${(event) => {
                              event.stopPropagation();
                              removeBranch(index);
                            }}
                            disabled=${branches.length <= 1}
                            className="text-[11px] font-bold text-rose-600 transition-colors hover:text-rose-700 disabled:pointer-events-none disabled:opacity-40"
                          >
                            削除
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <textarea
                          rows="3"
                          value=${branch.condition || ''}
                          onClick=${(event) => event.stopPropagation()}
                          onChange=${(event) => updateBranch(index, { condition: event.target.value })}
                          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm leading-6 text-slate-700"
                          placeholder="例: 料金やプランについて質問されたとき"
                        />
                      </div>
                    </div>
                  `;
                })}
              </div>

              <button
                type="button"
                onClick=${addBranch}
                disabled=${!canAddBranch}
                title=${canAddBranch ? '' : '登録できる表示条件は最大3個までです'}
                className="flex w-full items-center justify-center rounded-lg border border-dashed border-indigo-200 bg-indigo-50/70 px-3 py-2 text-sm font-bold text-indigo-700 transition-colors hover:bg-indigo-100 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
              >
                ＋ 表示条件を追加
              </button>
            </div>

            <div className="space-y-3 border-l border-slate-200 pl-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-800">選択肢ボタン</h3>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-500">${activeChoices.length}/${MAX_CHOICES}</span>
              </div>

              <div className="space-y-2">
                ${activeChoices.map((choice, index) => {
                  const selected = index === selectedChoiceIndex;

                  return html`
                    <div
                      key=${index}
                      onClick=${() => setSelectedChoiceIndex(index)}
                      className=${selected
                        ? 'space-y-3 rounded-xl border border-indigo-300 bg-indigo-50 px-3 py-3 shadow-sm'
                        : 'space-y-3 rounded-xl border border-slate-200 bg-white px-3 py-3 transition-colors hover:border-slate-300'}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-slate-800">${getChoiceLabel(index)}</div>
                          <div className="truncate text-sm font-bold text-slate-800">${getChoiceSummary(choice, index)}</div>
                          <div className="mt-0.5 truncate text-[11px] font-medium text-slate-500">${choice.message || 'クリック時の入力値を入力'}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick=${(event) => {
                              event.stopPropagation();
                              removeChoice(index);
                            }}
                            disabled=${activeChoices.length <= 1}
                            className="text-[11px] font-bold text-rose-600 transition-colors hover:text-rose-700 disabled:pointer-events-none disabled:opacity-40"
                          >
                            削除
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-500">ボタン表示名</label>
                        <input
                          type="text"
                          value=${choice.label || ''}
                          onClick=${(event) => event.stopPropagation()}
                          onChange=${(event) => updateChoice(selectedBranchIndex, index, buildLabelLinkedPatch(choice, event.target.value))}
                          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                          placeholder="例: 個人向けプラン"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-500">クリック時の入力値</label>
                        <textarea
                          rows="3"
                          value=${choice.message || ''}
                          onClick=${(event) => event.stopPropagation()}
                          onChange=${(event) => updateChoice(selectedBranchIndex, index, { message: event.target.value })}
                          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm leading-6 text-slate-700"
                          placeholder="例: 個人向けプランについて知りたいです。"
                        />
                      </div>
                    </div>
                  `;
                })}
              </div>

              <button
                type="button"
                onClick=${addChoice}
                disabled=${!canAddChoice}
                title=${canAddChoice ? '' : '登録できる選択肢は最大4個までです'}
                className="flex w-full items-center justify-center rounded-lg border border-dashed border-indigo-200 bg-indigo-50/70 px-3 py-2 text-sm font-bold text-indigo-700 transition-colors hover:bg-indigo-100 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
              >
                ＋ 選択肢を追加
              </button>
            </div>

            <div className="space-y-4 border-l border-slate-200 pl-4">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="space-y-3">
                  <div className="flex flex-wrap justify-start gap-3">
                    ${activeChoices.map((choice, index) => html`
                      <button
                        key=${index}
                        type="button"
                        onClick=${() => appendPreviewInput(choice)}
                        className="px-5 py-2.5 text-sm font-bold shadow-sm"
                        style=${{
                          color: previewButtonStyle.color,
                          backgroundColor: previewButtonStyle.backgroundColor,
                          borderColor: index === selectedChoiceIndex ? previewButtonStyle.borderColor : '#CBD5E1',
                          borderRadius: previewButtonStyle.borderRadius,
                          borderStyle: 'solid',
                          borderWidth: index === selectedChoiceIndex ? '2px' : '1px'
                        }}
                      >
                        ${choice.label || `選択肢${index + 1}`}
                      </button>
                    `)}
                  </div>

                  ${previewInputs.length
                    ? html`
                        <div className="space-y-2">
                          ${previewInputs.map((value, index) => html`
                            <div key=${`${value}-${index}`} className="flex justify-end">
                              <div className="max-w-[85%] rounded-2xl rounded-br-md bg-white px-4 py-2.5 text-sm leading-6 text-slate-900 shadow-sm">
                                ${value}
                              </div>
                            </div>
                          `)}
                        </div>
                      `
                    : null}
                </div>
              </div>
            </div>
          </div>
        </${SectionCard}>

        <${SectionCard} title="ボタンの見た目">
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
                  <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-bold text-slate-700">配色の設定</label>
                        <div className="flex rounded-lg bg-slate-100 p-0.5 text-xs">
                          <button type="button" onClick=${() => updateField('colorMode', 'solid')} className="rounded-md bg-white px-3 py-1 font-bold text-slate-800 shadow-sm">単色</button>
                          <span title="現在はグラデーションカラーは使えません" className="inline-flex cursor-not-allowed">
                            <button type="button" disabled className="rounded-md px-3 py-1 font-bold text-slate-400">グラデーション</button>
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-5 gap-2">
                        ${presets.map((preset) => {
                          const selected = form.solidColor === preset.color;
                          return html`
                            <button
                              key=${preset.name}
                              type="button"
                              title=${preset.name}
                              style=${{ backgroundColor: preset.color }}
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

                      <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">単体カラー選択</label>
                        <div className="mt-1.5 flex items-center gap-2">
                          <input type="color" value=${normalizeHexColor(form.solidColor, '#0066cc')} onChange=${(event) => updateField('solidColor', event.target.value)} className="h-8 w-8 cursor-pointer rounded border border-slate-300 bg-transparent p-0" />
                          <input type="text" value=${form.solidColor} onChange=${(event) => updateField('solidColor', event.target.value)} className="w-full rounded border border-slate-300 bg-white px-2 py-1 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-1">
                      <div className="space-y-1.5">
                        <label className="block text-sm font-bold text-slate-700">文字色</label>
                        <div className="flex items-center gap-3">
                          <input type="color" value=${normalizeHexColor(form.buttonStyle.color, '#FFFFFF')} onChange=${(event) => updateButtonStyle('color', event.target.value)} className="h-11 w-14 rounded border border-slate-300 bg-transparent p-1" />
                          <input type="text" value=${form.buttonStyle.color} onChange=${(event) => updateButtonStyle('color', event.target.value)} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-mono" placeholder="#FFFFFF" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-sm font-bold text-slate-700">枠線色</label>
                        <div className="flex items-center gap-3">
                          <input type="color" value=${normalizeHexColor(form.buttonStyle.borderColor, form.solidColor)} onChange=${(event) => updateButtonStyle('borderColor', event.target.value)} className="h-11 w-14 rounded border border-slate-300 bg-transparent p-1" />
                          <input type="text" value=${form.buttonStyle.borderColor} onChange=${(event) => updateButtonStyle('borderColor', event.target.value)} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-mono" placeholder="#307AF0" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-sm font-bold text-slate-700">角丸</label>
                        <input type="text" value=${form.buttonStyle.borderRadius} onChange=${(event) => updateButtonStyle('borderRadius', event.target.value)} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-mono" placeholder="4px" />
                      </div>
                    </div>
                  </div>
                `
              : html`<p className="text-sm leading-6 text-slate-500">見た目を指定しない場合は、選択肢の条件と候補だけを含むプロンプトを作ります。</p>`}
          </div>
        </${SectionCard}>

        <${CodeOutputPanel}
          value=${promptText}
          onCopy=${handleCopyPrompt}
          helperText="Sync-AI の事前プロンプトへそのまま貼り付け"
          title="AIに設定するプロンプト"
          buttonLabel="プロンプト文をコピーする"
          rows=${24}
        />
        ${copiedPrompt ? html`<div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">プロンプト文をコピーしました。</div>` : null}
      </div>
    `,
    preview: null,
    code: null
  };
}
