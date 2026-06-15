# Craftmake 引き継ぎメモ

更新日: 2026-06-15

## 現在の公開状態
- `main` に push 済み
- 最新の公開コミット: `342dde5 Widen snippet list layout`
- React 本体は `react-app/`
- ビルド確認は `npm --prefix react-app run build`

## ここまで公開済みの主な変更
- `よく使うコード` タブを追加
- スニペットカードを横並び表示に調整
- コードブロックをデフォルトで閉じる構成に変更
- `CTAボタン` にフォントサイズ変更を追加
- `CTAボタン` にカスタムイベント設定用セレクタ欄を追加

## スニペットタブの内容
- ステップ・イントロの `次へ` / `終了` ボタン非表示
- ステップ・イントロの `✕` ボタン非表示
- 各カードはコピー可能
- コードは開閉式で、初期状態は閉じたまま

## ローカルで残っているもの
- `.claude/settings.local.json` など、GitHub に載せていないローカル設定がある
- `react-app/src/features/ai-consultation/` は実装途中で、まだ公開前提ではない
- `api/` も引き継ぎ前提の未整理差分として残っている

## 次回の着手候補
1. `よく使うコード` のスニペット追加
2. CTA の見た目微調整
3. AI相談機能の整理を別スコープで再開

## 参考コマンド
- 開発起動: `cd "/Users/takefumi_fujiwara/Documents/アプリ開発/Craftmake" && npm --prefix react-app run dev`
- ビルド確認: `cd "/Users/takefumi_fujiwara/Documents/アプリ開発/Craftmake" && npm --prefix react-app run build`
