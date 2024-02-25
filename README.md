# pachinko-bot-js

## 使い方

```sh
yarn
mkdir src/data
touch src/data/userData.json
echo {"userData":[]} >> src/data/userData.json
```

## git管理でないファイル

### src/data/userData.json

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

### .env

* `PACHINKO_TOKEN`・・・discordBotのTOKEN
* `TEST_TOKEN`・・・test用のTOKEN
* `FASTHUNT`・・・コマンドの前に付ける記号
* `PROB`・・・何分の1でラッシュ判定に入るか
* `BET`・・・何円パチンコか
* `RATE`・・・借金の利息(％)

```
# Bot Token
PACHINKO_TOKEN = "TOKEN"
TEST_TOKEN = "TOKEN"

# Settings
FASTHUNT = "!"
PROB = "319"
BET = "4"
RATE = "10"
```
