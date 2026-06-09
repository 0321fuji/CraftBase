import { html, useMemo, useState } from '../../lib/react.js';
import { CodeOutputPanel } from '../../components/ui/CodeOutputPanel.js';
import { PreviewPanel } from '../../components/ui/PreviewPanel.js';
import { SectionCard } from '../../components/ui/SectionCard.js';
import { copyText } from '../../utils/clipboard.js';
import { generateRandomId } from '../../utils/randomId.js';
import {
  ALIGNMENT_OPTIONS,
  COMMON_VARIABLE_PRESETS,
  FONT_FAMILY_OPTIONS,
  FONT_SIZE_OPTIONS,
  FONT_WEIGHT_OPTIONS,
  LABEL_BORDER_RADIUS_OPTIONS,
  LABEL_PADDING_X_OPTIONS,
  LABEL_PADDING_Y_OPTIONS,
  LETTER_SPACING_OPTIONS,
  LINE_HEIGHT_OPTIONS,
  VARIABLE_INSERT_DEFAULTS
} from './defaults.js';
import { buildVariableInsertHtml } from './template.js';

function cloneDefaults() {
  return { ...VARIABLE_INSERT_DEFAULTS };
}

function buildPreviewDisplayText(form) {
  const prefixText = String(form.prefixText || '');
  const previewValue = String(form.previewValue || '').trim();
  const useSuffix = Boolean(form.useSuffix);
  const suffixText = String(form.suffixText || '');
  const fallbackText = String(form.fallbackText || '').trim();

  if (previewValue) {
    return `${prefixText}${previewValue}${useSuffix ? suffixText : ''}`;
  }

  return `${prefixText}${fallbackText}`;
}

function PreviewText({ form }) {
  const displayText = buildPreviewDisplayText(form);

  return html`
    <div>
      <div
        style=${{
          textAlign: form.alignment,
          paddingTop: form.paddingTop,
          paddingBottom: form.paddingBottom
        }}
      >
        <span
          style=${{
            display: 'inline-block',
            fontSize: form.fontSize,
            fontWeight: form.fontWeight,
            color: form.textColor,
            fontFamily: form.fontFamily,
            lineHeight: form.lineHeight,
            letterSpacing: form.letterSpacing,
            background: form.useLabelBackground ? form.labelBackgroundColor : 'transparent',
            borderRadius: form.useLabelBackground ? form.labelBorderRadius : '0px',
            padding: form.useLabelBackground ? `${form.labelPaddingY} ${form.labelPaddingX}` : '0'
          }}
        >
          ${displayText}
        </span>
      </div>
    </div>
  `;
}

export function useVariableInsertGenerator() {
  const [form, setForm] = useState(cloneDefaults);
  const [copied, setCopied] = useState(false);
  const blockId = useMemo(() => generateRandomId(8), [JSON.stringify(form)]);
  const outputHtml = useMemo(() => buildVariableInsertHtml(form, blockId), [form, blockId]);

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function applyPreset(preset) {
    setForm((current) => ({
      ...current,
      variableKey: preset.key,
      previewValue: preset.sampleValue,
      prefixText: preset.prefixText,
      useSuffix: preset.useSuffix,
      suffixText: preset.suffixText,
      fallbackText: preset.fallbackText
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
        title="変数差し込み"
        action=${html`
          <button type="button" onClick=${resetAll} className="text-xs text-slate-500 transition-colors hover:text-indigo-600">
            初期化
          </button>
        `}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700">よく使う変数</label>
            <div className="flex flex-wrap gap-2">
              ${COMMON_VARIABLE_PRESETS.map((preset) => html`
                <button
                  key=${preset.key}
                  type="button"
                  onClick=${() => applyPreset(preset)}
                  className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700 transition-colors hover:bg-indigo-100"
                >
                  ${preset.label}
                </button>
              `)}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">変数キー</label>
              <input
                type="text"
                value=${form.variableKey}
                onChange=${(event) => updateField('variableKey', event.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                placeholder="例: user_name"
              />
              <p className="text-[11px] leading-5 text-slate-500">Onboardingで渡されている QueryParam のキー名をそのまま入れます。</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">前に付ける文言</label>
              <input
                type="text"
                value=${form.prefixText}
                onChange=${(event) => updateField('prefixText', event.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                placeholder="例: ようこそ、"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">後ろに付ける文言</label>
              <input
                type="text"
                value=${form.suffixText}
                onChange=${(event) => updateField('suffixText', event.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                placeholder="例: 様"
              />
            </div>
          </div>

          <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
            <input
              type="checkbox"
              checked=${form.useSuffix}
              onChange=${(event) => updateField('useSuffix', event.target.checked)}
              className="rounded border-slate-300 text-indigo-600"
            />
            値が取れたときだけ後ろの文言を付ける
          </label>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">取得できないときの文言</label>
              <input
                type="text"
                value=${form.fallbackText}
                onChange=${(event) => updateField('fallbackText', event.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                placeholder="例: お客様"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">プレビュー用サンプル値</label>
              <input
                type="text"
                value=${form.previewValue}
                onChange=${(event) => updateField('previewValue', event.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                placeholder="例: 山田太郎"
              />
              <p className="text-[11px] leading-5 text-slate-500">この値は右のプレビュー確認専用です。出力コードには入りません。</p>
            </div>
          </div>

          <div className="space-y-3 border-t border-slate-100 pt-4">
            <label className="block text-sm font-bold text-slate-700">見た目の調整</label>
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-200 p-4">
                <div className="mb-3 text-xs font-bold tracking-wider text-slate-500">文字の調整</div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">文字サイズ</label>
                    <select value=${form.fontSize} onChange=${(event) => updateField('fontSize', event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2 py-2 text-xs">
                      ${FONT_SIZE_OPTIONS.map((option) => html`<option key=${option} value=${option}>${option}</option>`)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">文字の太さ</label>
                    <select value=${form.fontWeight} onChange=${(event) => updateField('fontWeight', event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2 py-2 text-xs">
                      ${FONT_WEIGHT_OPTIONS.map((option) => html`<option key=${option.value} value=${option.value}>${option.label}</option>`)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">文字色</label>
                    <input type="color" value=${form.textColor} onChange=${(event) => updateField('textColor', event.target.value)} className="mt-1 h-9 w-full rounded border border-slate-300" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">配置</label>
                    <select value=${form.alignment} onChange=${(event) => updateField('alignment', event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2 py-2 text-xs">
                      ${ALIGNMENT_OPTIONS.map((option) => html`<option key=${option.value} value=${option.value}>${option.label}</option>`)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">字間</label>
                    <select value=${form.letterSpacing} onChange=${(event) => updateField('letterSpacing', event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2 py-2 text-xs">
                      ${LETTER_SPACING_OPTIONS.map((option) => html`<option key=${option} value=${option}>${option}</option>`)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">行間</label>
                    <select value=${form.lineHeight} onChange=${(event) => updateField('lineHeight', event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2 py-2 text-xs">
                      ${LINE_HEIGHT_OPTIONS.map((option) => html`<option key=${option} value=${option}>${option}</option>`)}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">フォント指定</label>
                    <select
                      value=${form.fontFamily}
                      onChange=${(event) => updateField('fontFamily', event.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs"
                    >
                      ${FONT_FAMILY_OPTIONS.map((option) => html`
                        <option key=${option.value} value=${option.value}>${option.label}</option>
                      `)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 p-4">
                <div className="mb-3 text-xs font-bold tracking-wider text-slate-500">ラベル背景</div>
                <div className="space-y-3">
                  <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked=${form.useLabelBackground}
                      onChange=${(event) => updateField('useLabelBackground', event.target.checked)}
                      className="rounded border-slate-300 text-indigo-600"
                    />
                    角丸つきのラベル背景を付ける
                  </label>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">背景色</label>
                      <input type="color" value=${form.labelBackgroundColor} onChange=${(event) => updateField('labelBackgroundColor', event.target.value)} className="mt-1 h-9 w-full rounded border border-slate-300" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">角丸</label>
                      <select value=${form.labelBorderRadius} onChange=${(event) => updateField('labelBorderRadius', event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2 py-2 text-xs">
                        ${LABEL_BORDER_RADIUS_OPTIONS.map((option) => html`<option key=${option} value=${option}>${option}</option>`)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">左右余白</label>
                      <select value=${form.labelPaddingX} onChange=${(event) => updateField('labelPaddingX', event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2 py-2 text-xs">
                        ${LABEL_PADDING_X_OPTIONS.map((option) => html`<option key=${option} value=${option}>${option}</option>`)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">上下余白</label>
                      <select value=${form.labelPaddingY} onChange=${(event) => updateField('labelPaddingY', event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2 py-2 text-xs">
                        ${LABEL_PADDING_Y_OPTIONS.map((option) => html`<option key=${option} value=${option}>${option}</option>`)}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 p-4">
                <div className="mb-3 text-xs font-bold tracking-wider text-slate-500">外側の余白</div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">上余白</label>
                    <input type="text" value=${form.paddingTop} onChange=${(event) => updateField('paddingTop', event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-xs" placeholder="4px" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">下余白</label>
                    <input type="text" value=${form.paddingBottom} onChange=${(event) => updateField('paddingBottom', event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-xs" placeholder="4px" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </${SectionCard}>
    `,
    preview: html`
      <div className="space-y-3">
        <${PreviewPanel} darkMode=${false} headerNote="※Onboardingプレビュー機能では表示されません。本番環境タグ、検証環境タグのみに表示されます">
          <${PreviewText} form=${form} />
        </${PreviewPanel}>
        <p className="text-xs text-slate-500">
          実際の Onboarding 上では、${form.variableKey || '指定したキー'} に値があればその値、無ければ ${form.prefixText || ''}${form.fallbackText || 'フォールバック文言'} を表示します。
        </p>
      </div>
    `,
    code: html`
      <div className="space-y-3">
        <${CodeOutputPanel} value=${outputHtml} onCopy=${handleCopy} helperText="OnboardingのHTMLブロックにそのまま貼り付け対応" />
        ${copied ? html`<div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">HTMLコードをコピーしました。</div>` : null}
      </div>
    `
  };
}
