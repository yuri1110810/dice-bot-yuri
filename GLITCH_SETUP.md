# Glitch デプロイ手順

## 🚀 簡単3ステップでデプロイ

### ステップ1: Glitchアカウント作成
1. [Glitch.com](https://glitch.com/) にアクセス
2. 「Sign in」→「Sign in with GitHub」をクリック

### ステップ2: プロジェクトインポート
1. 「New Project」をクリック
2. 「Import from GitHub」を選択
3. リポジトリURL: `https://github.com/yuri1110810/dice-bot-yuri`
4. 「Import」をクリック

### ステップ3: 環境変数設定
1. 左側の「.env」ファイルをクリック
2. 以下の行を追加：
   ```
   DISCORD_TOKEN=あなたのDiscordボットトークン
   ```
3. 「Save」をクリック

## ✅ 完了！

- ボットが自動的に起動します
- プロジェクトURLにアクセスして「🎲 ダイスbot yuri is running!」が表示されれば成功
- Discordで「ヘルプ」コマンドを試してみてください

## 🔄 24時間稼働のために

Glitchは5分間非活動で一時停止しますが、以下のサービスで定期的にアクセスして稼働し続けられます：

1. **UptimeRobot**（推奨・無料）
   - [UptimeRobot](https://uptimerobot.com/)でアカウント作成
   - 「Add New Monitor」→「HTTP(s)」
   - URL: `https://your-project-name.glitch.me`
   - 監視間隔: 5分

2. **Pingdom**
   - 同様の設定で定期監視可能

これで完全に24時間稼働します！ 