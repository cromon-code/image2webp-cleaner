# image2webp-cleaner
PNG/JPG/WebP を WebP に変換し、メタデータ削除＆軽量化するシンプルなブラウザアプリです。  
PNG / JPG / WebP をドラッグ＆ドロップすると、自動で **WebP に変換 & メタデータ削除 & 軽量化** してくれます。  

GitHub Pages 上で動作する、完全クライアントサイドツールです。  
（画像がサーバーに送信されることはありません）

## ✨ 主な機能

- PNG / JPG / WebP をまとめて **WebP に変換**
- **メタデータ削除**（Exif, GPS, 撮影情報など）
- **軽量化**（品質は固定で 0.8）
- 変換後は  
  - **個別ダウンロード**  
  - **ZIP一括ダウンロード** が可能
- ファイルサイズの **元 → 出力 → 差分 → 削減率** を表示
- **複数回ドロップ可能**（結果テーブルに追記）
- **ファイル名は全体通し番号で衝突回避**  
  - 例: `photo_1.webp`, `photo_2.webp` …
- **ZIPファイル名は日付付き**  
  - 例: `converted_20250831.zip`
- **ダークモード対応**（OS設定に自動追従＋手動切替）

## 🚀 使い方

1. [公開ページ (GitHub Pages)](https://cromon-code.github.io/image2webp-cleaner/) にアクセス  
2. PNG / JPG / WebP ファイルを **ドラッグ＆ドロップ**  
3. 自動的に WebP に変換され、結果がテーブルに表示されます  
4. 必要に応じて個別DL、または **ZIP一括DL**  

## 🛠 開発構成

- **HTML / CSS / JavaScript (Vanilla)**  
- **Bootstrap 5**（UI整形 + ダークモード対応）  
- 依存ライブラリ  
  - [JSZip](https://stuk.github.io/jszip/) （ZIP生成）  
  - [FileSaver.js](https://github.com/eligrey/FileSaver.js/) （保存処理）  

## 📂 ディレクトリ構成（リポジトリ直下に配置）

image2webp-cleaner/
├── index.html # メイン画面
├── style.css # カスタムCSS
├── script.js # ロジック
└── README.md
