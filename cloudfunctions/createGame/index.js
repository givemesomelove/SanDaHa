// step: 游戏进程0:准备中; 1准备好了，叫分中; 2叫分结束，看底，埋底,选主色；3开始出牌；4一圈出完，第一个选谁最大； 5开始下一轮出牌;  6:结束胜负已分

// 云函数入口文件
const cloud = require('wx-server-sdk')
console.log('当前环境是:', cloud.DYNAMIC_CURRENT_ENV)
cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境
const db = cloud.database();


// 删除上把游戏
const deleteGame = async () => {
    console.log("删除")
    try {
        await db.collection('game').where({
            "_id": db.command.neq("0")
        }).remove();
    } catch (err) {
        console.error(err);
    }
}

// 洗牌、接拍、发牌
const washCard = async () => {
    // 随机打乱数组顺序(洗牌)
    const shuffleArray = array => {
        for (let i = array.length - 1; i > 0; i--) {
            // 生成一个0到i之间的随机索引
            const j = Math.floor(Math.random() * (i + 1));
            // 交换元素
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // 从数据库里读取需要的牌
    const cards = await db.collection('card').where({
        num: db.command.nin([3, 4, 6])
    }).get();
    console.log(cards)
    // 获取cardid列表
    let cur_cards = cards["data"].map(card => card["id"])
    // 变成两副牌
    cur_cards = cur_cards.concat(cur_cards);
    // 洗牌
    cur_cards = shuffleArray(cur_cards);
    return cur_cards
}

// 给扑克牌排序


// 准备完毕
const game_ready = async (players) => {
    const cards = await washCard();
    gameData = {}
    gameData["step"] = 1;
    gameData["enemyPlayer"] = "";
    gameData["bottomStartCards"] = cards.slice(0, 8);
    gameData["bottomEndCards"] = [];
    gameData["mainColor"] = 0;
    gameData["focusPlayer"] = players[0];
    gameData["curScore"] = 0;
    gameData["turnPlayers"] = players;
    gameData["scorePlayers"] = players;

    player1 = {}
    player1["startCards"] = cards.slice(8, 8 + 19);
    player1["turnsCards"] = [];
    player1["turnCards"] = [];
    player1["handCards"] = cards.slice(8, 8 + 19);
    player1["playerId"] = players[0];
    gameData["player1Info"] = player1;

    player2 = {}
    player2["startCards"] = cards.slice(27, 27 + 19);
    player2["turnsCards"] = [];
    player2["turnCards"] = [];
    player2["handCards"] = cards.slice(27, 27 + 19);
    player2["playerId"] = players[1];
    gameData["player2Info"] = player2;

    player3 = {}
    player3["startCards"] = cards.slice(46, 46 + 19);
    player3["turnsCards"] = [];
    player3["turnCards"] = [];
    player3["handCards"] = cards.slice(46, 46 + 19);
    player3["playerId"] = players[2];
    gameData["player3Info"] = player3;

    player4 = {}
    player4["startCards"] = cards.slice(65, 65 + 19);
    player4["turnsCards"] = [];
    player4["turnCards"] = [];
    player4["handCards"] = cards.slice(65, 65 + 19);
    player4["playerId"] = players[3];
    gameData["player4Info"] = player4;

    await db.collection('game').add({
        data: gameData
    });
}

// 玩家叫分
const call_score = async (userId, score) => {
    const gameResult = await db.collection('game').limit(1).get();
    const gameData = gameResult.data[0];
    const curGame = {};
    curGame["enemyPlayer"] = userId;
    curGame["targetScore"] = score;
    curGame["step"] = 2;
    curGame["focusPlayer"] = userId;
    await db.collection('game').doc(gameData._id).update({
        data: curGame
    });
}

// 庄家埋地，选主色
const select_bottomAndColor = async (cards, userKey, color) => {
    const gameResult = await db.collection('game').limit(1).get();
    const gameData = gameResult.data[0];
    // 换底牌
    const bottomStartCards = gameData["bottomStartCards"];
    const player = gameData[userKey];
    const playerStartCards = player["startCards"];
    let handCards = playerStartCards.concat(bottomStartCards)
    handCards = handCards.filter(card => !cards.includes(card));
    player["handCards"] = handCards;

    const curGame = {};
    curGame["step"] = 3;
    curGame[userKey] = player;
    curGame["bottomEndCards"] = cards;
    curGame["mainColor"] = color;
    await db.collection('game').doc(gameData._id).update({
        data: curGame
    });
}

// 下一位
const nextPlayer = (players, player) => {
    const index = players.indexOf(player);
    if (index === players.length - 1) {
        return players[0];
    }
    return players[index + 1];
}

// 出牌
const pick_card = async (cards, userKey, userId) => {
    // 判断玩家本轮是否都出完了,都出完了返回修改后的game，没有出完返回空
    const checkTurn = (game) => {
        player1 = game["player1Info"]["turnCards"];
        if (player1.length == 0) {
            return false;
        }
        player2 = game["player2Info"]["turnCards"];
        if (player2.length == 0) {
            return false;
        }
        player3 = game["player3Info"]["turnCards"];
        if (player3.length == 0) {
            return false;
        }
        player4 = game["player4Info"]["turnCards"];
        if (player4.length == 0) {
            return false;
        }
        return true;
    }

    const gameResult = await db.collection('game').limit(1).get();
    const gameData = gameResult.data[0];
    // 玩家出牌
    const player = gameData[userKey];
    const turnsCards = player["turnsCards"];
    turnsCards.push(cards);
    player["turnsCards"] = turnsCards;
    player["turnCards"] = cards;
    const handCards = player["handCards"];
    player["handCards"] = handCards.filter(card => !cards.includes(card));

    const curGame = {};
    curGame[userKey] = player;
    curGame["focusPlayer"] = nextPlayer(gameData["turnPlayers"], userId);
    // 是否出牌结束
    gameData[userKey] = player;
    if (checkTurn(gameData)) {
        curGame["step"] = 4;
    }
    await db.collection('game').doc(gameData._id).update({
        data: curGame
    });
}

// 选谁最大
const select_turn_winner = async (userId) => {
    // 计算当前牌的总分数
    const sumScore = (cards) => {
        let score = 0;
        for (const card in cards) {
            if (card["num"] == 5 || card["num"] == 10) {
                score = score + card["num"];
            } else if (card["num"] == 13) {
                score = score + 10;
            }
        }
        return score;
    }

    // 判断当前玩家是否要算分数
    const isPlayerWin = (player, winner, enemy) => {
        const isEnemyWin = winner == enemy;
        if (player["playerId"] == userId) {
            return true;
        }

        if (!isEnemyWin && player["playerId"] != enemy) {
            return true;
        }
        return false;
    }

    const gameResult = await db.collection('game').limit(1).get();
    const gameData = gameResult.data[0];
    // 算分
    let score = 0;
    const isPlayer1Win = isPlayerWin(gameData["player1Info"], userId, gameData["enemy"]);
    if (isPlayerWin) {
        score += sumScore(gameData["player1Info"]["turnCards"])
    }
    const isPlayer2Win = isPlayerWin(gameData["player2Info"], userId, gameData["enemy"]);
    if (isPlayerWin) {
        score += sumScore(gameData["player2Info"]["turnCards"])
    }
    const isPlayer3Win = isPlayerWin(gameData["player3Info"], userId, gameData["enemy"]);
    if (isPlayerWin) {
        score += sumScore(gameData["player3Info"]["turnCards"])
    }
    const isPlayer4Win = isPlayerWin(gameData["player4Info"], userId, gameData["enemy"]);
    if (isPlayerWin) {
        score += sumScore(gameData["player4Info"]["turnCards"])
    }
    gameData["curScore"] += score;

    // 改变游戏状态
    if (gameData.player1Info.handCards.length == 0) {
        gameData["step"] = 6;
    } else {
        // 换玩家
        gameData["focusPlayer"] = userId;
        gameData["step"] = 3;

        // 清空所有玩家本轮出牌
        gameData["player1Info"]["turnCards"] = [];
        gameData["player2Info"]["turnCards"] = [];
        gameData["player3Info"]["turnCards"] = [];
        gameData["player4Info"]["turnCards"] = [];
    }

    const did = gameData._id
    delete gameData._id
    await db.collection('game').doc(did).update({
        data: gameData
    });
}


// 云函数入口函数:
// 1删除上局游戏; 2洗牌结果; 3准备结束; 4玩家叫分; 5庄家埋底; 6选主色; 7开始出牌; 8选谁大; 9算分; 10结束; 11刷新玩家手牌; 12庄家看底; 13刷新主色; 14刷新分数; 15清空当前出牌
exports.main = async (event, context) => {
    type = event["type"];
    userId = event["userId"];
    // players = [
    //     "7258032d6791d0ce01a518c43727f177",
    //     "c69c6e4c6791d0e101a7e5ad245999cb",
    //     "11ad50236792662901aeea2b4791c574",
    //     "a40fc0746792663c051b52307e36f128"
    // ]
    players = event["players"];
    console.log("!!!!!", event)
    switch (type) {
        case 1: {
            await deleteGame();
            break;
        }
        case 2: {
            cards = await washCard();
            console.log(cards)
            break;
        }
        case 3: {
            await game_ready(players);
            break;
        }
        case 4: {
            score = event["score"];
            await call_score(userId, score);
            break;
        }
        case 5: {
            cards = event["cards"];
            userKey = event["userKey"];
            color = event["color"];
            await select_bottomAndColor(cards, userKey, color);
            break;
        }
        case 6: {
            const cards = event["cards"];
            userKey = event["userKey"];
            await pick_card(cards, userKey, userId);
            break;
        }
        case 7: {
            await select_turn_winner(userId);
            break;
        }
    }
    return {
        success: true
    };
}