import { GatewayIntentBits, Client, Partials, Message } from "discord.js";
import dotenv from "dotenv";
import logger from "./lib/logger";
import { z } from "zod";
import fs from "fs";

//.envファイルを読み込む
dotenv.config();

// Botで使うGatewayIntents、partials
const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Message, Partials.Channel],
});

const fastHunt = process.env.FASTHUNT; //コマンドの先頭文字
const prob = Number(process.env.PROB); //確率
const bet = Number(process.env.BET);   //1玉何円か

// プレイヤーデータ
let data: {
  userId: string;
  score: number; //スコア
  num: number; //RUSHまでの回数
}[]

// サーバ閉じたときにプレイヤーデータを保存する
process.on("SIGINT", () => {
  logger.info("Ctrl + C Pressed.")
  fs.writeFileSync("src/data/userData.json", JSON.stringify({userData: data}));
  process.exit(0);
});

// Bot起動確認
client.once("ready", async () => {
  const envSchema = z.object({
    fastHunt: z.string(),
    prob: z.number(),
    bet: z.number(),
  }).safeParse({
    fastHunt, prob, bet
  });

  // 環境変数の設定ミス検知
  if (!envSchema.success) {
    logger.error(`fastHunt=${fastHunt} prob=${prob} bet=${bet}`);
    process.exit(-1);;
  }

  // src/data/userData.jsonが存在するか検知
  if (!fs.existsSync("src/data/userData.json")) {
    logger.error(`src/data/userData.json does not exist. Please create src/data/userData.json and write {"userData":[]} in it.`);
    process.exit(-1);
  }

  logger.info(`Bot Online! (${new Date().toLocaleString()})`);

  if (client.user) {
    logger.info(client.user.tag);
  }

  // データ初回読み込み
  data = await import("./data/userData.json").then((data) => data.userData)
  logger.info(data);
});

client.on("messageCreate", async (message: Message) => {
  if (message.author.bot) return;

  // パチンココマンド(!p123)
  else if (new RegExp(`^${fastHunt}p[0-9]+$`).test(message.content)) {
    logger.debug(`message: ${message.content}`);
    logger.debug(`userId: ${message.author.id}`);
    logger.debug(data.find((d) => d.userId === message.author.id));
    logger.debug(data.find((d) => d.userId === "011"));

    // プレイヤーデータがなければ、作成
    if (!data.find((d) => d.userId === message.author.id)) {
      logger.warn(`${message.author.id} not found.`);
      void message.channel.send("プレイヤーデータが存在しません。作成します。");
      addPlayer(message.author.id);
    }

    // プレイヤーデータのインデックスを取得
    const index = data.findIndex((d) => d.userId === message.author.id);
    logger.debug(`index: ${index}`);

    // プレイヤーの手
    const p = Number(message.content.substring(2));
    logger.debug(`player: ${p}`);

    // 回数+1
    data[index].num += 1;

    // 1回入るのに平均12.5発
    data[index].score -= 12.5 * bet;

    // botの手(1~prob)
    const b = Math.floor(Math.random() * prob) + 1;
    logger.debug(`bot: ${b}`);
    void message.channel.send(`${b} [${data[index].num}] (￥${data[index].score.toLocaleString()})`);

    // ラッシュ突入、回数初期化
    if (p === b) {
      logger.debug(`Maching!!! num:${data[index].num}`);
      data[index].num = 0;
      await rush(message, index);
    }
  }

  // 参照コマンド(!show)
  else if (new RegExp(`^${fastHunt}show$`).test(message.content)) {
    // プレイヤーデータがなければ、警告
    if (!data.find((d) => d.userId === message.author.id)) {
      logger.warn(`${message.author.id} not found.`);
      void message.channel.send(`プレイヤーデータが存在しません。${message.author.displayName}を登録します。`);
      addPlayer(message.author.id);
    }

    // プレイヤーデータのインデックスを取得
    const index = data.findIndex((d) => d.userId === message.author.id);
    logger.debug(`index: ${index}`);

    void message.channel.send(`【${message.author.displayName}のデータ】\n所持金：￥${data[index].score.toLocaleString()}\n回数：${data[index].num}回`);
  }
});

async function rush(message: Message, index: number) {
  logger.debug("Rush Event.")

  // ラッシュ回数
  let rush_num = 0;

  // 前回ラッシュ復活フラグ
  let revivedFlag = false;

  // 突入判定
  await sleep(200);
  void message.channel.send("RUSHチャンス!!60以下でRUSH突入!!");
  let r = Math.floor(Math.random() * 100) + 1;

  // 値出力
  await sleep(1000);
  void message.channel.send(`${r}`);
  await sleep(200);
  data[index].score += 450 * bet;
  if (r > 60) {
    void message.channel.send(`RUSH失敗... (￥${data[index].score.toLocaleString()})`);
    return;
  }

  // ラッシュ突入
  void message.channel.send("RUST突入!!80以下でRUSH継続!!");
  logger.debug(`${r} - RUSH start.`);
  let f = true;
  while(f) {
    // 値出力
    r = Math.floor(Math.random() * 100) + 1;
    await sleep(1000);
    void message.channel.send(`${r}`);
    rush_num += 1;
    data[index].score += 1500 * bet;

    // 継続判定
    await sleep(200);
    if (revivedFlag) {
      void message.channel.send(`[${rush_num}] (￥${data[index].score.toLocaleString()})`);
      revivedFlag = false;
    } else if(r <= 80) {
      void message.channel.send(`RUSH継続!! [${rush_num}] (￥${data[index].score.toLocaleString()})`);
    } else if(r === 100) {
      void message.channel.send(`RUSH終了 [${rush_num}] (￥${data[index].score.toLocaleString()})`);
      await sleep(1000);
      void message.channel.send("・・・");
      revivedFlag = true;
      await sleep(1000);
      void message.channel.send(`RUSH復活!!!`);
    } else {
      f = false;
      void message.channel.send(`RUSH終了 [${rush_num}] (￥${data[index].score.toLocaleString()})`);
      logger.debug(`${r} - RUSH end.`)
    }
  }
}

/**
 * 待機関数
 * @param ms ミリ秒
 * @returns
 */
function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms))
};

/**
 * プレイヤーの追加
 * @param userId ユーザID
 */
function addPlayer(userId: string) {
  data.push({
    userId,
    score: 0,
    num: 0,
  })
}

void client.login(process.env.PACHINKO_TOKEN);
