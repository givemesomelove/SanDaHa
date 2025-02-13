// step: 游戏进程0:准备中; 1准备好了，叫分中; 2叫分结束，看底，埋底,选主色；3开始出牌；4一圈出完，第一个选谁最大； 5开始下一轮出牌;  6:结束胜负已分

// 云函数入口文件
const cloud = require('wx-server-sdk');
console.log('当前环境是:', cloud.DYNAMIC_CURRENT_ENV)
cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境
const db = cloud.database();

// 获取当前进行中的游戏信息
const db_getCurGame = async () => {
    const games = await db.collection('game').get();
    if (games.data && games.data.length > 0) {
        return games.data[0]
    }
    return null
}

// 获取所有卡牌列表
const db_getCardList = async () => {
    const cardData = await db.collection('card').get();
    if (cardData.data && cardData.data.length > 0) {
        return cardData.data
    }
    return null
}

// 删除上把游戏
const deleteGame = async () => {
    const game = await db_getCurGame()
    if (!game) {
        return '当前不存在游戏'
    }

    try {
        await db.collection('game').where({
            "_id": db.command.neq("0")
        }).remove()
        return ''
    } catch (err) {
        console.error(err)
        return '删除发生了错误'
    }
}

// 下一位
const nextPlayer = (players, player) => {
    const index = players.indexOf(player);
    if (index === 0) {
        return players[players.length - 1];
    }
    return players[index - 1];
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
    // 获取cardid列表
    let cur_cards = cards["data"].map(card => card["id"])
    // 变成两副牌
    cur_cards = cur_cards.concat(cur_cards);
    // 洗牌
    cur_cards = shuffleArray(cur_cards);
    return cur_cards
}

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

    // gameData["callScore"] = null
    // gameData["curCaller"] = null
    gameData["pickDefeat"] = false
    gameData["callPlayers"] = players

    await db.collection('game').add({
        data: gameData
    });
}

// 玩家叫分
const call_score = async (userId, score) => {
    const game = await db_getCurGame()
    if (!game) return '游戏不存在'
    // 当前是否是这个玩家叫分
    if (game.focusPlayer != userId) {
        return '没轮到你叫分'
    }

    if (score == 0) {
        // 0表示不要了
        const curGame = {}
        let players = game.callPlayers.filter(item => item != userId)
        curGame["callPlayers"] = players
        if (players.length == 1) {
            const winner = players[0]
            curGame["enemyPlayer"] = winner;
            curGame["targetScore"] = game["callScore"];
            curGame["step"] = 2;
            curGame["focusPlayer"] = winner;
        } else {
            const next = nextPlayer(game.callPlayers, userId)
            curGame["focusPlayer"] = next
        }
        await db.collection('game').doc(game._id).update({
            data: curGame
        });
    } else if (score == 5) {
        // 直接叫到庄家
        const curGame = {}
        curGame["callScore"] = 5
        curGame["curCaller"] = userId
        curGame["callPlayers"] = [userId]

        curGame["targetScore"] = 5
        curGame["enemyPlayer"] = userId
        curGame["step"] = 2
        curGame["focusPlayer"] = userId;
        await db.collection('game').doc(game._id).update({
            data: curGame
        });
    } else {
        const curGame = {}
        curGame["callScore"] = score
        curGame["curCaller"] = userId
        const next = nextPlayer(game.callPlayers, userId)
        curGame["focusPlayer"] = next;
        await db.collection('game').doc(game._id).update({
            data: curGame
        });
    }
    return ''
}

// 庄家埋地，选主色
const select_bottomAndColor = async (cards, userKey, color) => {
    const game = await db_getCurGame()
    if (!game) return '当前不存在游戏'
    // 当前是否是这个玩家操作
    const userId = game[userKey].playerId
    if (game.focusPlayer != userId) {
        return '没轮到你'
    }

    // 换底牌
    const bottomStartCards = game.bottomStartCards;
    const player = game[userKey];
    const playerStartCards = player.startCards;
    let handCards = playerStartCards.concat(bottomStartCards)
    handCards = handCards.filter(card => !cards.includes(card));
    player.handCards = handCards;

    const curGame = {};
    curGame.step = 3
    curGame[userKey] = player;
    curGame.bottomEndCards = cards
    curGame.mainColor = color
    await db.collection('game').doc(game._id).update({
        data: curGame
    });
    return ''
}

// 庄家埋地，选主色
const select_MainColor = async (userKey, color) => {
    const game = await db_getCurGame()
    if (!game) return '当前不存在游戏'
    // 当前是否是这个玩家操作
    const userId = game[userKey].playerId
    if (game.focusPlayer != userId) {
        return '没轮到你'
    }

    const curGame = {};
    curGame.mainColor = color
    await db.collection('game').doc(game._id).update({
        data: curGame
    });
    return ''
}

// 庄家投降
const pickDefeat = async (score) => {
    if (!score) return ''
    const game = await db_getCurGame()
    if (!game) return '当前不存在游戏'
    
    const curGame = {};
    curGame.pickDefeat = true
    curGame.curScore = score
    curGame.step = 6
    curGame.bottomEndCards = game.bottomEndCards
    curGame.mainColor = 5
    await db.collection('game').doc(game._id).update({
        data: curGame
    });
    return ''
}

// 选谁最大
const select_turn_winner = async (game, winner, bottomScale) => {
    const cardList = await db_getCardList()

    // 计算当前牌的总分数
    const sumScore = (cards) => {
        let score = 0;
        cards.forEach(cardId => {
            const card = cardList.find(item => item.id == cardId)
            if (card.num == 5 || card.num == 10) {
                score += card.num
            } else if (card.num == 13) {
                score += 10
            }
        })
        return score;
    }

    // 算分
    let score = 0;
    const isEnemyWin = game.enemyPlayer == winner
    if (!isEnemyWin) {
        score += sumScore(game.player1Info.turnCards)
        score += sumScore(game.player2Info.turnCards)
        score += sumScore(game.player3Info.turnCards)
        score += sumScore(game.player4Info.turnCards)
    }

    // 底牌分倍数
    if (bottomScale > 0) {
        score += bottomScale * sumScore(game.bottomEndCards)
    }
    game.curScore += score;

    // 改变游戏状态
    if (game.player1Info.handCards.length == 0) {
        game.step = 6;
    } else {
        // 换玩家
        game.focusPlayer = winner
        game.step = 3;

        // 清空所有玩家本轮出牌
        game.player1Info.turnCards = []
        game.player2Info.turnCards = []
        game.player3Info.turnCards = []
        game.player4Info.turnCards = []
    }
    return game
}

// 出牌
const pick_card = async (cards, userKey, userId, winner, bottomScale) => {
    let game = await db_getCurGame()
    if (!game) return '游戏不存在'

    if (game.focusPlayer != userId) {
        return '没轮到你'
    }
    
    // 玩家出牌
    let player = game[userKey];
    player.turnsCards.push(cards)
    player.turnCards = cards;
    // 剩余手牌
    cards.forEach(item => {
        const index = player.handCards.findIndex(card => card == item)
        if (index != -1) {
            player.handCards.splice(index, 1)
        }
    })
    // 修正异常导致同一个玩家一次出两轮牌
    const tmp = fixTurnsCards(game)
    if (tmp) {
        game = tmp
    }

    if (winner) {
        game = await select_turn_winner(game, winner, bottomScale)
    } else {
        game.focusPlayer = nextPlayer(game.turnPlayers, userId)
    }

    const did = game._id
    delete game._id
    await db.collection('game').doc(did).update({
        data: game
    });
}

// 修正出牌轮次异常
const fixTurnsCards = game => {
    const count1 = game.player1Info.turnsCards.length
    const count2 = game.player2Info.turnsCards.length
    const count3 = game.player3Info.turnsCards.length
    const count4 = game.player4Info.turnsCards.length
    const max = Math.max(count1, count2, count3, count4)
    const min = Math.min(count1, count2, count3, count4)
    if (max - min >= 2) {
        if (max == count1) {
            game.player1Info.turnsCards.pop()
        }
        if (max == count2) {
            game.player2Info.turnsCards.pop()
        }
        if (max == count3) {
            game.player3Info.turnsCards.pop()
        }
        if (max == count4) {
            game.player4Info.turnsCards.pop()
        }
        return game
    } else {
        return null
    }
}

// 玩家排序修改
const db_randPlayers = async (players) => {
    const roomResult = await db.collection('room').limit(1).get()
    const roomRecord = roomResult.data[0];
    // 将当前玩家加入房间
    await db.collection('room').doc(roomRecord._id).update({
        data: {
            "players": players
        }
    });
}

const startNextGame = async (turnPlayers) => {
	// 删除当前游戏
	await deleteGame()
	// 修改座位 
	await db_randPlayers(turnPlayers)
}

// 云函数入口函数:
// 1删除上局游戏; 2洗牌结果; 3准备结束; 4玩家叫分; 5庄家埋底; 6选主色; 7开始出牌; 8选谁大; 9算分; 10结束; 11刷新玩家手牌; 12庄家看底; 13刷新主色; 14刷新分数; 15清空当前出牌
exports.main = async (event, context) => {
    type = event["type"];
    userId = event["userId"];
    players = event["players"];
    let msg = ''
    switch (type) {
        case 1: {
            msg = await deleteGame();
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
            const cards = event["cards"]
            userKey = event["userKey"]
            const winner = event["winner"]
            const bottomScale = event["bottomScale"]
            await pick_card(cards, userKey, userId, winner, bottomScale)
            break;
        }
        case 7: {
            await select_turn_winner(userId);
            break;
        }
        case 8: {
            const color = event["color"];
            const userKey = event["userKey"]
			await select_MainColor(userKey, color)
			break
        }
        case 9: {
            const score = event["score"]
			await pickDefeat(score)
			break
		}
		case 10: {
			const turnPlayers = event["turnPlayers"]
			await startNextGame(turnPlayers)
			break
		}
    }
    return {
        success: true,
        msg: msg
    };
}