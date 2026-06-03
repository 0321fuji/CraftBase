# Craftmake React App

React移行版の作業ディレクトリです。既存の `../index.html` は残したまま、各ジェネレーターを `src/features/` 配下へ分割しています。

## 起動

```bash
npm install
npm run dev
```

ブラウザでは `http://localhost:4173` を開きます。

## 構成

- `src/App.js`: タブと全体レイアウト
- `src/components/`: 共通UI
- `src/features/`: 各ジェネレーター
- `src/utils/`: HTMLエスケープやコピー処理

