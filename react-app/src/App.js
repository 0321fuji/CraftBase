import { html, useState } from './lib/react.js';
import { GeneratorLayout } from './components/layout/GeneratorLayout.js';
import { TabNavigation } from './components/layout/TabNavigation.js';
import { useCtaGenerator } from './features/cta/CtaGenerator.js';
import { useFaqGenerator } from './features/faq/FaqGenerator.js';
import { useInformationGenerator } from './features/information/InformationGenerator.js';
import { useChecklistGenerator } from './features/checklist/ChecklistGenerator.js';
import { useProgressGenerator } from './features/progress/ProgressGenerator.js';
import { useCompareGenerator } from './features/compare/CompareGenerator.js';
import { useVideoGuideGenerator } from './features/video/VideoGuideGenerator.js';
import { useVideoSwitcherGenerator } from './features/video-switcher/VideoSwitcherGenerator.js';
import { usePulldownGenerator } from './features/pulldown/PulldownGenerator.js';
import { useVariableInsertGenerator } from './features/variable-insert/VariableInsertGenerator.js';
import { useConfettiGenerator } from './features/confetti/ConfettiGenerator.js';
import { SnippetSection } from './features/snippets/SnippetSection.js';
import { SectionCard } from './components/ui/SectionCard.js';

const tabs = [
  { id: 'snippets', label: '固定コード' },
  { id: 'cta', label: 'CTAボタン' },
  { id: 'faq', label: 'FAQアコーディオン' },
  { id: 'pulldown', label: 'プルダウン' },
  { id: 'compare', label: '比較表' },
  { id: 'progress', label: 'プログレスバー' },
  { id: 'information', label: 'インフォメーション' },
  { id: 'variable-insert', label: '変数差し込み' },
  { id: 'confetti', label: '紙吹雪演出' },
  { id: 'checklist', label: 'チェックリスト' },
  { id: 'video', label: '動画ガイド' },
  { id: 'video-switcher', label: '動画切り替え' }
];

function PlaceholderGenerator({ label }) {
  return {
    controls: html`
      <${SectionCard} title=${`${label} - 準備中`}>
        <div className="space-y-3 text-sm leading-7 text-slate-600">
          <p>このタブはまだ準備中です。</p>
          <p>既存の <code>index.html</code> 側はそのまま使えます。</p>
          <p>共通部品を使って、順番に追加していく想定です。</p>
        </div>
      </${SectionCard}>
    `,
    preview: html`
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
        ${label} のプレビューは、準備ができ次第ここに追加します。
      </div>
    `,
    code: html`
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-950/95 p-8 text-center text-sm text-slate-400 shadow-sm">
        コード出力も、準備ができ次第ここに追加します。
      </div>
    `
  };
}

function createSnippetLibraryGenerator() {
  return {
    controls: html`
      <div className="space-y-5">
        <${SnippetSection} />
      </div>
    `,
    preview: null,
    code: null
  };
}

export function App() {
  const [activeTab, setActiveTab] = useState('cta');
  const ctaGenerator = useCtaGenerator();
  const faqGenerator = useFaqGenerator();
  const informationGenerator = useInformationGenerator();
  const checklistGenerator = useChecklistGenerator();
  const progressGenerator = useProgressGenerator();
  const compareGenerator = useCompareGenerator();
  const videoGuideGenerator = useVideoGuideGenerator();
  const videoSwitcherGenerator = useVideoSwitcherGenerator();
  const pulldownGenerator = usePulldownGenerator();
  const variableInsertGenerator = useVariableInsertGenerator();
  const confettiGenerator = useConfettiGenerator();
  const snippetLibraryGenerator = createSnippetLibraryGenerator();
  const placeholderGenerator = PlaceholderGenerator({ label: tabs.find((tab) => tab.id === activeTab)?.label || '未選択' });
  const generators = {
    cta: ctaGenerator,
    faq: faqGenerator,
    compare: compareGenerator,
    progress: progressGenerator,
    information: informationGenerator,
    'variable-insert': variableInsertGenerator,
    confetti: confettiGenerator,
    snippets: snippetLibraryGenerator,
    checklist: checklistGenerator,
    video: videoGuideGenerator,
    'video-switcher': videoSwitcherGenerator,
    pulldown: pulldownGenerator
  };
  const generator = generators[activeTab] || placeholderGenerator;

  return html`
    <${GeneratorLayout}
      title="craftmake"
      badge="プロトタイプ"
      TabComponent=${TabNavigation}
      tabItems=${tabs}
      activeTab=${activeTab}
      onTabChange=${setActiveTab}
      controls=${generator.controls}
      preview=${generator.preview}
      code=${generator.code}
    />
  `;
}
