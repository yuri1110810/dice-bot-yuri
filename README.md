# ダイスbot yuri

D&D5e用のDiscordダイスボットです。

![Discord](https://img.shields.io/badge/Discord-Bot-7289DA)
![Node.js](https://img.shields.io/badge/Node.js-v16+-339933)
![License](https://img.shields.io/badge/License-MIT-blue)
![GitHub Stars](https://img.shields.io/github/stars/yuri1110810/dice-bot-yuri?style=social)
![GitHub Issues](https://img.shields.io/github/issues/yuri1110810/dice-bot-yuri)

## 🎲 特徴

- **完全無料** - 誰でも自由に使用・改造可能
- **日本語対応** - すべての機能が日本語で利用可能
- **D&D5e特化** - D&Dルールに特化した便利機能
- **簡単セットアップ** - 詳しい手順書付き

## 機能一覧

### 🎲 基本的なダイスロール
- `xdy` - y面サイコロをx回振る（例: 3d6）
- `xdy+z` - 結果にzを足す（例: 2d8+3）
- `xdykz` - 上位z個を採用（例: 4d6k3）

### ⚔️ 戦闘機能
- `攻撃+a xdy+z` - 攻撃ロールとダメージロールを同時実行
- クリティカル時のダメージダイス自動倍化

### 🎯 判定機能
- `技能名 DC +修正値` - 任意の技能判定（例: 威圧 15 +3）
- `セーヴx` - セーヴィングスロー
- `死亡セーヴ` - 死亡セーヴィングスロー

### 🎭 キャラクター作成
- `能力値作成` - 4d6k3×6回で6つの数値を生成、好きな能力値に割り当て可能

### 🌟 その他
- `xdy 有利/不利` - Advantage/Disadvantage
- `ヘルプ` - コマンド一覧表示

## セットアップ手順

### 1. Node.jsのインストール

[Node.js公式サイト](https://nodejs.org/)から最新のLTS版をダウンロードしてインストールしてください。

### 2. 依存関係のインストール

プロジェクトディレクトリで以下のコマンドを実行:

```bash
npm install
```

### 3. Discord Botの作成

1. [Discord Developer Portal](https://discord.com/developers/applications)にアクセス
2. 「New Application」をクリックして新しいアプリケーションを作成
3. アプリケーション名を「ダイスbot yuri」に設定
4. 左側メニューから「Bot」を選択
5. 「Add Bot」をクリック
6. 「TOKEN」セクションの「Copy」ボタンをクリックしてトークンをコピー

### 4. トークンの設定

**方法1: 環境変数ファイルを使用（推奨）**

1. プロジェクトディレクトリに`.env`ファイルを作成
2. 以下の内容を`.env`ファイルに記述し、`YOUR_ACTUAL_BOT_TOKEN`を実際のトークンに置き換え

```bash
# .envファイルを作成
touch .env
```

`.env`ファイルの内容:
```
DISCORD_TOKEN=YOUR_ACTUAL_BOT_TOKEN
```

**方法2: 直接コードに記述**

`bot.js`ファイルの5行目にある `YOUR_BOT_TOKEN_HERE` を、コピーしたトークンに置き換えてください:

```javascript
const TOKEN = process.env.DISCORD_TOKEN || 'ここにあなたのボットトークンを貼り付け';
```

**⚠️ 重要: トークンは絶対に公開しないでください！**

### 5. ボットの権限設定

1. Discord Developer Portalで左側メニューから「OAuth2」→「URL Generator」を選択
2. 「SCOPES」で以下を選択:
   - `bot`
3. 「BOT PERMISSIONS」で以下を選択:
   - `Send Messages`
   - `Read Message History`
   - `View Channels`
4. 生成されたURLをコピー

### 6. ボットをサーバーに招待

1. 上記でコピーしたURLをブラウザで開く
2. 招待したいサーバーを選択
3. 「認証」をクリック

### 7. ボットの起動

```bash
npm start
```

または

```bash
node bot.js
```

## 使用例

### 基本的なダイスロール
- `3d6` → 6面ダイスを3個振る
- `1d20+5` → 20面ダイスを1個振って5を足す

### 有利・不利
- `1d20 有利` → 1d20を2回振って高い方を採用
- `1d20 不利` → 1d20を2回振って低い方を採用

### セーヴィングスロー
- `セーヴ15` → 1d20を振ってDC15以上なら成功

### 死亡セーヴィングスロー
- `死亡セーヴ` → 特別なルールに従って判定

## トラブルシューティング

### ボットがオンラインにならない
- トークンが正しく設定されているか確認
- インターネット接続を確認
- `npm install`が正常に完了しているか確認

### ボットが反応しない
- ボットに必要な権限があるか確認
- メッセージを送信しているチャンネルをボットが見れるか確認

## 🤝 貢献・改造について

このボットは完全にオープンソースです！

### 改造・拡張歓迎
- 新機能の追加
- バグ修正
- UIの改善
- 多言語対応

### Pull Requestの送り方
1. このリポジトリをFork
2. 新しいブランチを作成
3. 変更を実装
4. Pull Requestを送信

## 📞 サポート

### 質問・要望がある場合
- GitHubのIssuesで報告
- 新機能のリクエスト歓迎
- バグ報告はテンプレートに従って記載

### コミュニティ
- ディスカッションで情報交換
- 改造版の共有
- D&Dセッションでの使用報告

## ⭐ このプロジェクトが気に入ったら

- ⭐ **Star**をつけてください！
- 🍴 **Fork**して改造してみてください！
- 🐦 **SNS**でシェアしてください！

## ライセンス

MIT License - 自由に使用・改造・配布可能です
