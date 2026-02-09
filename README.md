# unitone Link Modal Ext

unitone テーマのメディアリンク機能を拡張し、リンク先をモーダル（iframe）で表示できるようにするWordPressプラグインです。

## 機能

- **メディアリンクの拡張**: `data-unitone-media-type="external"` を持つ `.unitone-media-link` をクリックすると、リンク先をiframe内でモーダル表示
- **外部リンクの自動モーダル表示**: `.unitone-media-link` で `data-unitone-media-type` が未指定の場合、外部URLを自動的にモーダルで表示
- **クエリーループブロック対応**: ブロックエディターでクエリーループブロックにモーダル表示オプションを追加
- **YouTube除外**: YouTubeリンクはテーマ標準のライトボックス機能を使用

## 動作要件

- WordPress 6.0以上
- PHP 7.4以上
- unitone テーマ

## インストール

1. プラグインフォルダを `wp-content/plugins/` にアップロード
2. WordPress管理画面の「プラグイン」から「unitone Link Modal Ext」を有効化

## 使用方法

### メディアリンクでの使用

unitone テーマのメディアリンク機能で、外部サイトへのリンクを設定すると自動的にモーダル表示されます。

```html
<!-- 外部リンクを明示的に指定 -->
<a href="https://example.com" class="unitone-media-link" data-unitone-media-type="external">
  外部サイトを開く
</a>

<!-- media-type未指定で外部URLの場合も自動でモーダル表示 -->
<a href="https://example.com" class="unitone-media-link">
  外部サイトを開く
</a>
```

### クエリーループブロックでの使用

1. ブロックエディターでクエリーループブロックを選択
2. サイドバーの「Link Modal Ext」パネルを開く
3. 「Open links in modal」をオンにする

これにより、クエリーループ内のすべてのリンクがモーダルで表示されます。

## 除外されるリンク

以下のリンクはモーダル表示されません：

- YouTubeリンク（テーマ標準のライトボックスを使用）
- `javascript:` リンク
- `mailto:` リンク
- `tel:` リンク
- `#` アンカーリンク

## 開発

### ビルド

```bash
cd wp-content/plugins/unitone-link-modal-ext
npm install
npm run build
```

### 開発モード

```bash
npm run start
```

## ファイル構成

```
unitone-link-modal-ext/
├── unitone-link-modal-ext.php  # メインプラグインファイル
├── package.json                 # npm設定
├── src/
│   └── index.js                # エディター拡張ソース
├── build/
│   ├── index.js                # ビルド済みエディタースクリプト
│   └── index.asset.php         # 依存関係情報
└── assets/
    ├── css/
    │   └── style.css           # モーダルスタイル
    └── js/
        └── link-modal-ext.js   # フロントエンドスクリプト
```

## ライセンス

GPL-2.0-or-later

## 作者

NExT-Season
