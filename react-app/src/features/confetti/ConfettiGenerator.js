import { html, useMemo, useState } from '../../lib/react.js';
import { CodeOutputPanel } from '../../components/ui/CodeOutputPanel.js';
import { PreviewPanel } from '../../components/ui/PreviewPanel.js';
import { SectionCard } from '../../components/ui/SectionCard.js';
import { copyText } from '../../utils/clipboard.js';
import { generateRandomId } from '../../utils/randomId.js';
import { CONFETTI_CARD_BACKGROUND_OPTIONS, CONFETTI_DEFAULTS, CONFETTI_OUTER_BACKGROUND_OPTIONS } from './defaults.js';
import { buildConfettiHtml, buildConfettiPreviewHtml } from './template.js';

function cloneDefaults() {
  return { ...CONFETTI_DEFAULTS };
}

export function useConfettiGenerator() {
  const [form, setForm] = useState(cloneDefaults);
  const [copied, setCopied] = useState(false);
  const blockId = useMemo(() => generateRandomId(8), [JSON.stringify(form)]);
  const outputHtml = useMemo(() => buildConfettiHtml(form, blockId), [form, blockId]);
  const previewHtml = useMemo(() => buildConfettiPreviewHtml(form, blockId), [form, blockId]);

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
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
        title="紙吹雪演出"
        action=${html`
          <button type="button" onClick=${resetAll} className="text-xs text-slate-500 transition-colors hover:text-indigo-600">
            初期化
          </button>
        `}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">メッセージ</label>
              <input
                type="text"
                value=${form.messageText}
                onChange=${(event) => updateField('messageText', event.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="例: おめでとうございます！"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">補足テキスト</label>
              <input
                type="text"
                value=${form.subText}
                onChange=${(event) => updateField('subText', event.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="例: ここから次のステップへ進めます。"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">絵文字</label>
              <input
                type="text"
                value=${form.emoji}
                onChange=${(event) => updateField('emoji', event.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="🎉"
                maxLength="4"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700">おめでとうカードの背景色</label>
            <select
              value=${form.cardBackground}
              onChange=${(event) => updateField('cardBackground', event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              ${CONFETTI_CARD_BACKGROUND_OPTIONS.map((option) => html`<option key=${option.value} value=${option.value}>${option.label}</option>`)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700">外側の背景色</label>
            <select
              value=${form.outerBackground}
              onChange=${(event) => updateField('outerBackground', event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              ${CONFETTI_OUTER_BACKGROUND_OPTIONS.map((option) => html`<option key=${option.value} value=${option.value}>${option.label}</option>`)}
            </select>
          </div>

          <p className="text-xs leading-6 text-slate-500">
            カラーパレット、量、広がり方、出現位置、再表示の扱い、演出時間は固定です。ステップが表示された瞬間に、軽い紙吹雪だけを出す構成にしています。
          </p>
        </div>
      </${SectionCard}>
    `,
    preview: html`
      <${PreviewPanel} darkMode=${false} headerNote="ステップ表示時の演出イメージ">
        <div className="py-2" dangerouslySetInnerHTML=${{ __html: previewHtml }} />
      </${PreviewPanel}>
    `,
    code: html`
      <${CodeOutputPanel}
        value=${outputHtml}
        onCopy=${handleCopy}
        helperText="OnboardingのHTMLブロックにそのまま貼り付け対応"
      />
      ${copied ? html`
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 shadow-sm">
          紙吹雪コードをコピーしました。
        </div>
      ` : null}
    `
  };
}
