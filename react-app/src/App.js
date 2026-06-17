import { html, useState } from './lib/react.js';
import { GeneratorLayout } from './components/layout/GeneratorLayout.js';
import { TabNavigation } from './components/layout/TabNavigation.js';
import { useCtaGenerator } from './features/cta/CtaGenerator.js';
import { useBranchCardGenerator } from './features/branch-card/BranchCardGenerator.js';
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
import { useSyncAiGenerator } from './features/sync-ai/SyncAiGenerator.js';
import { useSyncAiPulldownGenerator } from './features/sync-ai/SyncAiPulldownGenerator.js';
import { SectionCard } from './components/ui/SectionCard.js';

const sectionTabs = [
  { id: 'parts', label: 'HTML/CSSパーツ' },
  { id: 'sync-ai', label: 'Sync-AI' }
];

const partTabs = [
  { id: 'snippets', label: '固定コード' },
  { id: 'cta', label: 'CTAボタン' },
  { id: 'branch-card', label: '分岐カード' },
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

const syncAiTabs = [
  { id: 'sync-ai-basic', label: '基本フォーム' },
  { id: 'sync-ai-pulldown', label: 'プルダウン' },
  { id: 'sync-ai-extract', label: '抽出生成' }
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

function SyncAiPlaceholderGenerator({ label }) {
  return {
    controls: html`
      <${SectionCard} title=${label}>
        <div className="space-y-3 text-sm leading-7 text-slate-600">
          <p>このパーツは次に追加予定です。</p>
          <p>まずはタブ構成だけ先に用意しています。</p>
          <p>要件が固まったら、この場所に専用フォームとコード出力を追加します。</p>
        </div>
      </${SectionCard}>
    `,
    preview: null,
    code: null
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
  const [activeSection, setActiveSection] = useState('parts');
  const [activeTab, setActiveTab] = useState('cta');
  const [activeSyncAiTab, setActiveSyncAiTab] = useState('sync-ai-basic');
  const ctaGenerator = useCtaGenerator();
  const branchCardGenerator = useBranchCardGenerator();
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
  const syncAiGenerator = useSyncAiGenerator();
  const syncAiPulldownGenerator = useSyncAiPulldownGenerator();
  const snippetLibraryGenerator = createSnippetLibraryGenerator();
  const placeholderGenerator = PlaceholderGenerator({ label: partTabs.find((tab) => tab.id === activeTab)?.label || '未選択' });
  const syncAiPlaceholderGenerator = SyncAiPlaceholderGenerator({ label: syncAiTabs.find((tab) => tab.id === activeSyncAiTab)?.label || '未選択' });
  const generators = {
    cta: ctaGenerator,
    'branch-card': branchCardGenerator,
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
  const syncAiGenerators = {
    'sync-ai-basic': syncAiGenerator,
    'sync-ai-pulldown': syncAiPulldownGenerator,
    'sync-ai-extract': syncAiPlaceholderGenerator
  };
  const generator = activeSection === 'sync-ai'
    ? syncAiGenerators[activeSyncAiTab] || syncAiPlaceholderGenerator
    : generators[activeTab] || placeholderGenerator;
  const headerNav = html`
    <div className="max-w-full overflow-x-auto">
      <${TabNavigation}
        tabs=${sectionTabs}
        activeTab=${activeSection}
        onChange=${(sectionId) => {
          setActiveSection(sectionId);
          if (sectionId === 'parts') {
            setActiveTab((current) => (partTabs.some((tab) => tab.id === current) ? current : 'cta'));
          }
          if (sectionId === 'sync-ai') {
            setActiveSyncAiTab((current) => (syncAiTabs.some((tab) => tab.id === current) ? current : 'sync-ai-basic'));
          }
        }}
      />
    </div>
  `;
  const currentTabs = activeSection === 'parts' ? partTabs : syncAiTabs;
  const currentActiveTab = activeSection === 'parts' ? activeTab : activeSyncAiTab;
  const handleTabChange = activeSection === 'parts' ? setActiveTab : setActiveSyncAiTab;

  return html`
    <${GeneratorLayout}
      title="craftmake"
      badge="プロトタイプ"
      headerNav=${headerNav}
      TabComponent=${TabNavigation}
      tabItems=${currentTabs}
      activeTab=${currentActiveTab}
      onTabChange=${handleTabChange}
      controls=${generator.controls}
      preview=${generator.preview}
      code=${generator.code}
      layoutMode=${generator.layoutMode}
    />
  `;
}
