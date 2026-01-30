# 🎮 10を作れ（Make Ten）

4つの数字と四則演算を使って「10」を作る脳トレパズルゲーム。

[![GitHub Pages](https://img.shields.io/badge/Play-GitHub%20Pages-blue?style=for-the-badge&logo=github)](https://tadfuji.github.io/10game/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

## 🎯 遊び方

1. 画面に表示された **4つの数字**（1〜9）を見る
2. **四則演算**（＋ − × ÷）を使って **10** を作る
3. 4つの数字を入力し終わると **自動で正解判定**
4. わからない時は「**こたえ**」ボタンで答えを確認

### 例
```
数字: 6 7 1 2
答え: 6 + 7 - 1 - 2 = 10 ✓
```

## ✨ 特徴

- 🎨 **究極のミニマルデザイン** - 真っ黒な背景に白い数字
- 📱 **モバイル最適化** - スマートフォンでの操作に最適化
- 🔢 **専用キーパッド** - タッチ操作しやすい大きなボタン
- 💡 **ヒント機能** - 答えがわからない時は「こたえ」ボタン
- 🎒 **小学生でも遊べる** - 括弧なしのシンプルなルール
- 📴 **オフライン対応** - PWAでインストール可能

## 🚀 デモ

**▶️ [今すぐプレイ](https://tadfuji.github.io/10game/)**

## 🛠 技術スタック

- HTML5
- CSS3（カスタムプロパティ、Flexbox、Grid）
- Vanilla JavaScript（ES6+）
- PWA（Progressive Web App）

## 📁 ファイル構成

```
10game/
├── index.html      # メインHTML
├── style.css       # スタイルシート
├── script.js       # ゲームロジック
├── manifest.json   # PWAマニフェスト
├── sw.js           # Service Worker
├── icons/          # アプリアイコン
│   ├── icon-192.png
│   └── icon-512.png
├── README.md       # このファイル
└── LICENSE         # MITライセンス
```

## 💻 ローカル開発

```bash
# リポジトリをクローン
git clone https://github.com/TadFuji/10game.git
cd 10game

# ローカルサーバーを起動
python3 -m http.server 8080

# ブラウザで開く
open http://localhost:8080
```

## 📝 ライセンス

MIT License - 詳細は [LICENSE](LICENSE) を参照してください。

## 🙏 クレジット

Made with ❤️ by [TadFuji](https://github.com/TadFuji)
