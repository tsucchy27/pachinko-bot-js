# pachinko-bot-js

## src/data/userData.json

プレイヤーデータの保存場所

```json:src/data/userData.json
{
  "userData": [
    {
      "userId": "123456789011234567890",
      "score": 0,
      "num": 0
    }
  ]
}
```

## .env

* `PACHINKO_TOKEN`・・・discordBotのTOKEN
* `FASTHUNT`・・・コマンドの前に付ける記号
* `PROB`・・・何分の1でラッシュ判定に入るか
* `BET`・・・何円パチンコか

```
# Bot Token
PACHINKO_TOKEN = "TOKEN"

# Settings
FASTHUNT = "!"
PROB = "319"
BET = "4"
```
