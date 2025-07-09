const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
require('dotenv').config();

// ボットトークンを環境変数から取得
const TOKEN = process.env.DISCORD_TOKEN || 'YOUR_BOT_TOKEN_HERE';

// Discordクライアントを作成
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages
    ]
});

// ダイスロール関数
function rollDice(sides, count = 1) {
    const rolls = [];
    let total = 0;
    
    for (let i = 0; i < count; i++) {
        const roll = Math.floor(Math.random() * sides) + 1;
        rolls.push(roll);
        total += roll;
    }
    
    return { rolls, total };
}

// ダイス記法をパースする関数
function parseDiceNotation(notation) {
    // xdy+z形式をパース
    const match = notation.match(/^(\d+)d(\d+)(?:\+(\d+))?$/);
    if (!match) return null;
    
    return {
        count: parseInt(match[1]),
        sides: parseInt(match[2]),
        modifier: match[3] ? parseInt(match[3]) : 0
    };
}

// xdykz記法をパースする関数（上位z個を採用）
function parseDiceNotationWithKeep(notation) {
    const match = notation.match(/^(\d+)d(\d+)k(\d+)$/);
    if (!match) return null;
    
    return {
        count: parseInt(match[1]),
        sides: parseInt(match[2]),
        keep: parseInt(match[3])
    };
}

// ダイスロールして上位keep個を採用する関数
function rollDiceKeepHighest(sides, count, keep) {
    if (keep > count) keep = count;
    
    const rolls = [];
    for (let i = 0; i < count; i++) {
        rolls.push(Math.floor(Math.random() * sides) + 1);
    }
    
    // 降順でソート
    rolls.sort((a, b) => b - a);
    
    const keptRolls = rolls.slice(0, keep);
    const total = keptRolls.reduce((sum, roll) => sum + roll, 0);
    
    return { 
        allRolls: rolls, 
        keptRolls: keptRolls,
        total: total 
    };
}

// メッセージイベントのハンドラー
client.on('messageCreate', async (message) => {
    // ボット自身のメッセージは無視
    if (message.author.bot) return;
    
    const content = message.content.toLowerCase();
    
    // ヘルプコマンド
    if (content === 'ヘルプ') {
        const helpMessage = `
**ダイスbot yuri - コマンド一覧**

**基本的なダイスロール:**
• \`xdy\` - y面サイコロをx回振る（例: 3d6）
• \`xdy+z\` - y面サイコロをx回振って、結果にzを足す（例: 2d8+3）
• \`xdykz\` - xdyを振って上位z個を採用（例: 4d6k3）

**戦闘関連:**
• \`攻撃+a xdy+z\` - 攻撃ロール（1d20+a）とダメージロール（xdy+z）を実行
  例: \`攻撃+5 2d8+3\` または \`攻撃+3 1d6\`

**技能判定:**
• \`技能判定名 DC +修正値\` - 技能判定を実行（例: \`威圧 15 +3\`）
  任意の技能名（威圧、看破、説得など）が使用可能

**有利・不利:**
• \`xdy 有利\` - xdyを2回振って高い方を採用
• \`xdy 不利\` - xdyを2回振って低い方を採用

**セーヴィングスロー:**
• \`セーヴx\` または \`セーブx\` - 1d20を振ってx以上なら成功（例: セーヴ15）

**死亡セーヴィングスロー:**
• \`死亡セーヴ\` または \`死亡セーブ\` - 1d20を振って判定
  - 10以上: 成功
  - 9以下: 失敗
  - 1: 大失敗（失敗2つ分）
  - 20: 大成功（HP1で復活）

**キャラクター作成:**
• \`能力値作成\` - 4d6k3を6回振って初期能力値を決定
  6つの数値を生成し、好きな能力値に割り当て可能
        `;
        
        await message.reply(helpMessage);
        return;
    }
    
    // 死亡セーヴィングスロー
    if (content === '死亡セーヴ' || content === '死亡セーブ') {
        const { rolls, total } = rollDice(20, 1);
        const roll = rolls[0];
        let result = '';
        
        if (roll === 1) {
            result = '**大失敗！** (失敗2つ分)';
        } else if (roll === 20) {
            result = '**大成功！** (HP1で復活)';
        } else if (roll >= 10) {
            result = '**成功**';
        } else {
            result = '**失敗**';
        }
        
        await message.reply(`🎲 死亡セーヴィングスロー: **${roll}** → ${result}`);
        return;
    }
    
    // 能力値作成
    if (content === '能力値作成') {
        let resultText = '🎯 **キャラクター能力値作成** (4d6k3 × 6回)\n\n';
        let totalSum = 0;
        const results = [];
        
        for (let i = 0; i < 6; i++) {
            const result = rollDiceKeepHighest(6, 4, 3);
            totalSum += result.total;
            results.push(result.total);
            
            resultText += `**${i + 1}番目**: [${result.allRolls.join(', ')}] → `;
            resultText += `採用[${result.keptRolls.join(', ')}] = **${result.total}**\n`;
        }
        
        // 生成された能力値を見やすく表示
        const average = (totalSum / 6).toFixed(1);
        resultText += `\n📊 **生成された能力値**: [${results.join(', ')}]`;
        resultText += `\n📊 **合計値**: ${totalSum} (平均: ${average})`;
        
        // 能力値の評価
        if (totalSum >= 75) {
            resultText += '\n✨ 素晴らしい能力値です！';
        } else if (totalSum >= 70) {
            resultText += '\n👍 良い能力値です！';
        } else if (totalSum >= 65) {
            resultText += '\n👌 標準的な能力値です。';
        } else {
            resultText += '\n💪 チャレンジングなキャラクターになりそうです！';
        }
        
        resultText += '\n\n💡 これらの数値を好きな能力値（STR, DEX, CON, INT, WIS, CHA）に割り当ててください！';
        
        await message.reply(resultText);
        return;
    }
    
    // セーヴィングスロー
    const saveMatch = content.match(/^セー[ヴブ](\d+)$/);
    if (saveMatch) {
        const target = parseInt(saveMatch[1]);
        const { rolls, total } = rollDice(20, 1);
        const roll = rolls[0];
        const result = roll >= target ? '**成功**' : '**失敗**';
        
        await message.reply(`🎲 セーヴィングスロー (DC${target}): **${roll}** → ${result}`);
        return;
    }
    
    // xdykz形式のダイスロール（上位z個を採用）
    const keepMatch = content.match(/^(\d+)d(\d+)k(\d+)$/);
    if (keepMatch) {
        const parsed = parseDiceNotationWithKeep(keepMatch[0]);
        if (parsed) {
            const result = rollDiceKeepHighest(parsed.sides, parsed.count, parsed.keep);
            
            let resultText = `🎲 ${keepMatch[0]}: 全ての出目[${result.allRolls.join(', ')}]\n`;
            resultText += `→ 上位${parsed.keep}個を採用: [${result.keptRolls.join(', ')}] = **${result.total}**`;
            
            await message.reply(resultText);
            return;
        }
    }
    
    // 攻撃ロール（攻撃+a xdy+z形式）
    const attackMatch = content.match(/^攻撃\+(\d+)\s+(\d+d\d+(?:\+\d+)?)$/);
    if (attackMatch) {
        const attackBonus = parseInt(attackMatch[1]);
        const damageNotation = attackMatch[2];
        
        // 攻撃ロール
        const attackRoll = rollDice(20, 1);
        const attackTotal = attackRoll.rolls[0] + attackBonus;
        const isCrit = attackRoll.rolls[0] === 20;
        const isFumble = attackRoll.rolls[0] === 1;
        
        let attackResult = `⚔️ **攻撃ロール**: 1d20+${attackBonus} = [${attackRoll.rolls[0]}]+${attackBonus} = **${attackTotal}**`;
        if (isCrit) attackResult += ' 💥**クリティカル！**';
        if (isFumble) attackResult += ' 💔**ファンブル！**';
        
        // ダメージロール
        const damageParsed = parseDiceNotation(damageNotation);
        if (damageParsed) {
            let damageResult = '';
            
            if (isCrit) {
                // クリティカル時はダイスを2倍
                const damage1 = rollDice(damageParsed.sides, damageParsed.count);
                const damage2 = rollDice(damageParsed.sides, damageParsed.count);
                const critTotal = damage1.total + damage2.total + damageParsed.modifier;
                
                damageResult = `\n🎲 **ダメージ**: ${damageNotation} (クリティカル)\n`;
                damageResult += `通常: [${damage1.rolls.join(', ')}] + クリティカル: [${damage2.rolls.join(', ')}]`;
                if (damageParsed.modifier > 0) {
                    damageResult += ` + ${damageParsed.modifier}`;
                }
                damageResult += ` = **${critTotal}**`;
            } else if (!isFumble) {
                const damage = rollDice(damageParsed.sides, damageParsed.count);
                const damageTotal = damage.total + damageParsed.modifier;
                
                damageResult = `\n🎲 **ダメージ**: ${damageNotation} = [${damage.rolls.join(', ')}]`;
                if (damageParsed.modifier > 0) {
                    damageResult += ` + ${damageParsed.modifier}`;
                }
                damageResult += ` = **${damageTotal}**`;
            }
            
            await message.reply(attackResult + damageResult);
            return;
        }
    }
    
    // 技能判定（任意の技能名 DC +修正値）
    const skillMatch = content.match(/^(.+?)\s+(\d+)\s+\+(\d+)$/);
    if (skillMatch) {
        const skillName = skillMatch[1];
        const dc = parseInt(skillMatch[2]);
        const modifier = parseInt(skillMatch[3]);
        
        const roll = rollDice(20, 1);
        const rollValue = roll.rolls[0];
        const total = rollValue + modifier;
        const isSuccess = total >= dc;
        const isCrit = rollValue === 20;
        const isFumble = rollValue === 1;
        
        let resultText = `🎯 **${skillName}判定** (DC${dc})\n`;
        resultText += `1d20+${modifier} = [${rollValue}]+${modifier} = **${total}**\n`;
        resultText += `→ ${isSuccess ? '**成功！**' : '**失敗...**'}`;
        
        if (isCrit) resultText += ' 🌟**出目20！**';
        if (isFumble) resultText += ' 💀**出目1！**';
        
        await message.reply(resultText);
        return;
    }
    
    // 有利・不利を含むダイスロール
    const advantageMatch = content.match(/^(\d+d\d+(?:\+\d+)?)\s*(有利|不利)$/);
    if (advantageMatch) {
        const diceNotation = advantageMatch[1];
        const type = advantageMatch[2];
        const parsed = parseDiceNotation(diceNotation);
        
        if (parsed) {
            // 2回ロール
            const roll1 = rollDice(parsed.sides, parsed.count);
            const roll2 = rollDice(parsed.sides, parsed.count);
            
            const total1 = roll1.total + parsed.modifier;
            const total2 = roll2.total + parsed.modifier;
            
            const chosen = type === '有利' 
                ? (total1 >= total2 ? { roll: roll1, total: total1, num: 1 } : { roll: roll2, total: total2, num: 2 })
                : (total1 <= total2 ? { roll: roll1, total: total1, num: 1 } : { roll: roll2, total: total2, num: 2 });
            
            let resultText = `🎲 ${diceNotation} (${type})\n`;
            resultText += `1回目: [${roll1.rolls.join(', ')}]${parsed.modifier > 0 ? '+' + parsed.modifier : ''} = **${total1}**\n`;
            resultText += `2回目: [${roll2.rolls.join(', ')}]${parsed.modifier > 0 ? '+' + parsed.modifier : ''} = **${total2}**\n`;
            resultText += `→ ${chosen.num}回目を採用: **${chosen.total}**`;
            
            await message.reply(resultText);
            return;
        }
    }
    
    // 通常のダイスロール
    const diceMatch = content.match(/^(\d+d\d+(?:\+\d+)?)$/);
    if (diceMatch) {
        const parsed = parseDiceNotation(diceMatch[1]);
        
        if (parsed) {
            const { rolls, total } = rollDice(parsed.sides, parsed.count);
            const finalTotal = total + parsed.modifier;
            
            let resultText = `🎲 ${diceMatch[1]}: [${rolls.join(', ')}]`;
            if (parsed.modifier > 0) {
                resultText += ` + ${parsed.modifier} = **${finalTotal}**`;
            } else {
                resultText += ` = **${finalTotal}**`;
            }
            
            await message.reply(resultText);
            return;
        }
    }
});

// ボットがログインしたときの処理
client.once('ready', () => {
    console.log(`ダイスbot yuri がログインしました！`);
    client.user.setActivity('D&D5e | ヘルプ でコマンド一覧', { type: ActivityType.Playing });
});

// エラーハンドリング
client.on('error', console.error);

// ログイン時のエラーをキャッチ
client.login(TOKEN).catch(error => {
    console.error('ログインエラー:', error);
    console.error('トークンの長さ:', TOKEN.length);
    if (error.message.includes('disallowed intents')) {
        console.error('\n⚠️ MESSAGE CONTENT INTENTが有効になっていません！');
        console.error('Discord Developer Portalで以下を確認してください:');
        console.error('1. Bot > Privileged Gateway Intents');
        console.error('2. MESSAGE CONTENT INTENTをONに設定');
        console.error('3. Save Changesをクリック\n');
    }
}); 