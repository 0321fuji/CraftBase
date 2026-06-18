# Craftmake 引き継ぎメモ

更新日: 2026-06-17

## リポジトリ / 実行前提
- リポジトリ: `0321fuji/CraftBase`
- 作業ディレクトリ: `react-app/`
- 開発起動: `npm --prefix react-app run dev`
- ビルド確認: `npm --prefix react-app run build`
- 公開物: `react-app/dist`
- 現在の主ブランチ: `main`

## 現在の公開状態
- GitHub に push 済みの最新コミットは `a899f9c Add branch card generator`
- `main` には、`Sync-AI` の導線分離と `基本フォーム` / `プルダウン`、`分岐カード` の実装が入っている
- `グローハイライト` は **まだ未push のローカル差分**

## 別チャンネルの Codex / Claude Code へ引き継ぐときの情報格納ルール

### 1. 最優先の格納場所
- **引き継ぎの一次ソースは `HANDOFF.md`**
- 別チャンネルに移る前に、少なくとも以下は `HANDOFF.md` に残す
  - 現在の目的
  - 完了済み
  - 未完了
  - 次に触るファイル
  - 注意点
  - push 済みか未pushか

### 2. コードの正本
- **コードの正本は GitHub の `main`**
- 別チャンネルでは、まず `HANDOFF.md` と最新 push 済みコミットを見る前提
- 「どこまで GitHub にあるか」は、`HANDOFF.md` の「現在の公開状態」に必ず書く

### 3. 未push の作業がある場合の残し方
- 未push の変更を別チャンネルへ渡したいときは、チャット履歴だけに頼らない
- `HANDOFF.md` に以下を明記する
  - 未push の有無
  - 対象ファイルのパス
  - 何を変えたか
  - ビルド確認の有無
  - その変更を commit / push してよいか

記載例:
- `未push ローカル差分あり`
- `対象: react-app/src/features/sync-ai/SyncAiPulldownGenerator.js`
- `内容: 追加ボタン位置をカード外へ移動`
- `build: 実行済み`

### 4. 仕様メモの置き場所
- 実装仕様・画面仕様・運用ルールは、基本的に **`HANDOFF.md` に要約して残す**
- 長文の一時メモを別ファイルに置くなら、`HANDOFF.md` に **そのファイルパスを必ず書く**
- 「ブラウザコメントで言われたこと」「ユーザー口頭で言ったこと」も、次チャンネルで必要なら要約して `HANDOFF.md` に転記する

### 5. 参照すべきファイルの書き方
- 別チャンネルの Codex がすぐ追えるよう、ファイルパスは具体的に書く
- 例:
  - `react-app/src/App.js`
  - `react-app/src/features/sync-ai/SyncAiPulldownGenerator.js`
  - `react-app/src/features/sync-ai/template.js`
  - `react-app/src/components/layout/GeneratorLayout.js`

### 6. 次チャンネル開始時のおすすめ手順
- 1. `HANDOFF.md` を読む
- 2. `git log --oneline -5` で最新コミット確認
- 3. `git status --short` でローカル差分確認
- 4. `HANDOFF.md` に書かれた対象ファイルだけ開く
- 5. その後に作業開始

## まず最初に把握してほしいこと
- このリポジトリは未整理のローカル差分が他にもある
- 今回の作業では **Sync-AI 関連と、その表示に必要な最小限のレイアウト変更だけ** を対象にしている
- 次回も staging は広げず、対象ファイルだけを明示的に `git add` する前提で進めるのが安全

## 現在の画面構成

### 1. 上位ナビ
`react-app/src/App.js`

- 画面上部に 2 系統の切替を追加済み
  - `HTML/CSSパーツ`
  - `Sync-AI`
- 既存の HTML/CSS 生成群と Sync-AI 群を導線ごと分離している

### 2. HTML/CSSパーツ 側
- 従来タブ群はこの配下に残している
- 現在の並び:
  - `固定コード`
  - `CTAボタン`
  - `分岐カード`
  - `グローハイライト`
  - `FAQアコーディオン`
  - `プルダウン`
  - `比較表`
  - `プログレスバー`
  - `インフォメーション`
  - `変数差し込み`
  - `紙吹雪演出`
  - `チェックリスト`
  - `動画ガイド`
  - `動画切り替え`

### 3. Sync-AI 側
- Sync-AI 専用の下位タブを別で持つ構成に変更済み
- 現在のタブ:
  - `基本フォーム`
  - `プルダウン`
  - `抽出生成`
- `抽出生成` はまだプレースホルダーのみ

## 実装済み内容

### A. Sync-AI 導線の分離
対象:
- `react-app/src/App.js`
- `react-app/src/components/layout/GeneratorLayout.js`

内容:
- `Sync-AI` を従来の共通タブ帯から切り離した
- `HTML/CSSパーツ` と `Sync-AI` の 2 階層導線にした
- `Sync-AI` 側だけ別タブセットを出せるようにした
- `GeneratorLayout` に `layoutMode: 'balanced'` を追加し、左フォーム / 右コードの 6:6 レイアウトが使えるようにした

### B. Sync-AI「基本フォーム」
対象:
- `react-app/src/features/sync-ai/SyncAiGenerator.js`
- `react-app/src/features/sync-ai/defaults.js`
- `react-app/src/features/sync-ai/template.js`

内容:
- もともとの以下テンプレートを Craftmake 上のフォームで生成できるようにした
  - `onb-ai-system-prompt`
  - `onb-ai-prompt-input`
  - `onb-ai-send-button`
- 調整可能なのは:
  - 事前プロンプト
  - プレースホルダー
  - 送信ボタン名
- **プレビューは intentionally 廃止**
  - AI が実際に応答するように誤解されるため削除済み
- 右カラムはコード出力のみ

### C. Sync-AI「プルダウン」
対象:
- `react-app/src/features/sync-ai/SyncAiPulldownGenerator.js`
- `react-app/src/features/sync-ai/defaults.js`
- `react-app/src/features/sync-ai/template.js`

内容:
- 以下テンプレートをフォーム生成できるようにした
  - 複数の `onb-ai-system-prompt`
  - `select.onb-ai-dropdown`
  - `textarea.onb-ai-prompt-input`
  - `button.onb-ai-send-button`
- 調整可能なのは:
  - ラベル
  - プレースホルダー
  - 送信ボタン名
  - 選択肢ごとの表示名
  - 選択肢ごとの対応プロンプト

#### プルダウン実装の仕様
- `option value` と `data-onb-prompt-key` は自動生成
  - 1件目 `a`
  - 2件目 `b`
  - 3件目 `c`
  - …という連番
- 各選択肢は折りたたみ式
- 選択肢追加 UI は **最後のカードの外側・一覧末尾の `＋` ボタン**
- 削除ボタンあり

#### 重要: 対応プロンプト欄の現在仕様
- フォーム上の `対応プロンプト` は **空でもよい**
- ユーザーに `Aの回答ルール` と書かせる前提ではない
- 入力が空のとき、生成HTML側では自動で:
  - `Aの回答ルールに従って回答してください。`
  - `Bの回答ルールに従って回答してください。`
  - …のように補完される
- 入力があるときは、その内容に対して末尾の `に従って回答してください。` を補う
- すでに `に従って回答してください。` まで入力されている場合は重複させない

この仕様は `react-app/src/features/sync-ai/template.js` の `buildPromptInstruction()` に寄っている。

### D. HTML/CSSパーツ「分岐カード」
対象:
- `react-app/src/App.js`
- `react-app/src/features/branch-card/BranchCardGenerator.js`
- `react-app/src/features/branch-card/defaults.js`
- `react-app/src/features/branch-card/template.js`

内容:
- `CTAボタン` の次に `分岐カード` タブを追加
- Onboarding ステップの外枠を前提に、親カードの外枠なしで出力
- 見出し + 補足文 + 複数の選択肢カードを生成できるようにした
- 各選択肢カードは `STANDSMotion.changeGoal()` でポップアップ起動
- カードにホバー時の浮き上がり、背景変化、枠色変化を追加
- 初期版は **ポップアップ起動専用** に絞っている

### E. HTML/CSSパーツ「グローハイライト」
対象:
- `react-app/src/App.js`
- `react-app/src/features/glow-highlight/GlowHighlightGenerator.js`
- `react-app/src/features/glow-highlight/defaults.js`
- `react-app/src/features/glow-highlight/template.js`

内容:
- `分岐カード` の次に `グローハイライト` タブを追加
- `ページURL` と `対象セレクタ` を指定して、対象要素へ常時発光クラスを付与するコードを生成
- `発光色` `光の広がり` `光の強さ` をフォームで調整可能
- プレビューは外部ページではなく、Craftmake内のサンプル要素を常時発光させる形
- `prefers-reduced-motion` 時はアニメーションを止める実装を含む

## 現在のファイル構成（Sync-AI）
- `react-app/src/features/sync-ai/defaults.js`
  - `SYNC_AI_DEFAULTS`
  - `SYNC_AI_PULLDOWN_DEFAULTS`
- `react-app/src/features/sync-ai/template.js`
  - `buildSyncAiHtml`
  - `buildSyncAiPulldownHtml`
- `react-app/src/features/sync-ai/SyncAiGenerator.js`
  - `基本フォーム`
- `react-app/src/features/sync-ai/SyncAiPulldownGenerator.js`
  - `プルダウン`

## 次にやる候補

### 優先0: 分岐カードの微調整
- 並び順は `CTAボタン` の次に追加済み
- 必要なら次に検討:
  - 横並びレイアウト対応
  - カード内アイコン
  - `リンク` / `チャット` 起動対応
  - ホバー演出の強さ調整

### 優先0-2: グローハイライトの微調整
- セレクタが長いケース向けに、`テキスト一致` や `アイコン名一致` を足すかは未判断
- 発光周期、色プリセット、強度の既定値は今後調整余地あり

### 優先1: Sync-AI「抽出生成」
- タブだけ存在し、まだ中身は未実装
- `SyncAiPlaceholderGenerator` で仮置きしている
- まずは仕様をもらって、`基本フォーム` / `プルダウン` と同じ構成でジェネレーター化するのが自然

### 優先2: プルダウンの細かい UX 調整
未確定だが起こりそうな要望:
- 新規追加時に新しい選択肢を自動で開く
- 開いている選択肢を 1 件だけに制限する
- 選択肢の並び替え
- `＋` ボタンをアイコンだけにする / 余白をさらに詰める
- 既定文言の表現を `Aの回答ルール` 以外へ可変にする

### 優先3: 説明文の整理
- 現在は説明テキストをかなり削っている
- ユーザー向けガイドを少し戻すかは未判断

## 実装上の注意点

### 1. プレビューは入れない
- Sync-AI は AI の応答を返すわけではない
- モーダル風プレビューは「動く」ように誤認されるので廃止済み
- 今後も **コード出力中心** の見せ方を維持するほうが安全

### 2. レイアウトは Sync-AI だけ別扱い
- `layoutMode: 'balanced'` を使って左右 2 カラム表示
- HTML/CSS パーツ側の既存 UX は壊さない方針

### 3. コミット対象に注意
現在の `git status` には、今回スコープ外の差分が残りやすい

例:
- `.claude/settings.local.json`
- `.gitignore`
- `react-app/README.md`
- `react-app/src/components/ui/SectionCard.js`
- `react-app/vite.config.js`
- `api/`
- `react-app/src/features/ai-consultation/`

次回も **対象ファイルだけ個別に add** すること。

## 未push ローカル差分
- あり
- 対象:
  - `react-app/src/App.js`
  - `react-app/src/features/glow-highlight/GlowHighlightGenerator.js`
  - `react-app/src/features/glow-highlight/defaults.js`
  - `react-app/src/features/glow-highlight/template.js`
  - `HANDOFF.md`
- 内容:
  - HTML/CSSパーツに `グローハイライト` タブを追加
  - `ページURL` と `対象セレクタ` を指定して常時発光コードを生成できるようにした
  - 発光色、広がり、強さをフォームから調整できるようにした
  - プレビューは Craftmake 内のサンプル要素を常時発光させる形
- build:
  - 実行済み
- commit / push:
  - まだ未実施

## 参考コマンド
- 開発起動:
  - `cd "/Users/takefumi_fujiwara/Documents/アプリ開発/Craftmake" && npm --prefix react-app run dev`
- ビルド確認:
  - `cd "/Users/takefumi_fujiwara/Documents/アプリ開発/Craftmake" && npm --prefix react-app run build`
- 差分確認（Sync-AIだけ）:
  - `git diff -- react-app/src/App.js react-app/src/components/layout/GeneratorLayout.js react-app/src/features/sync-ai`

## Claude Code 向けの最短理解メモ
- 入口は `react-app/src/App.js`
- Sync-AI は上位ナビで別セクション化済み
- 実装済みは `基本フォーム` と `プルダウン`
- `抽出生成` は未実装
- プルダウンの prompt 文言補完ロジックは `template.js` にある
- プレビューは不要、コード出力重視
- コミット時はスコープ外差分を巻き込まないこと
