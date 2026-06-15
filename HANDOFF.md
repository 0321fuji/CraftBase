# Craftmake 引き継ぎメモ

更新日: 2026-06-16

## リポジトリ / 実行前提
- リポジトリ: `0321fuji/CraftBase`
- 作業ディレクトリ: `react-app/`
- 開発起動: `npm --prefix react-app run dev`
- ビルド確認: `npm --prefix react-app run build`
- 公開物: `react-app/dist`
- 現在の主ブランチ: `main`

## 現在の公開状態
- GitHub に push 済みの最新機能コミットは `bdd52e1 Add Sync-AI builders`
- このコミット時点で、`Sync-AI` の導線分離と `基本フォーム` / `プルダウン` の実装が入っている
- 今回の `HANDOFF.md` 更新もこのあと GitHub に push する想定

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
