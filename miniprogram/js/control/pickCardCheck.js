import {
	GameStep,
	getCurTurnPickBySeat,
	getFirstTurnPick,
	getMyHandCard,
	getPlayInfoBySeat,
	getUserIdBySeat,
	isFocuseMy,
	PickError,
	RankColor,
	Seat,
	OutGrade
} from "../common/util"

/**
 * 获取当前出牌的排位颜色
 * @param {*} cardId 卡牌id
 */
export const getCardRankColor = cardId => {
	const ranks = GameGlobal.databus.ranks

	const mainColor = GameGlobal.databus.gameInfo.mainColor
	const noMainColor = mainColor >= 5 || mainColor == 0

	const index = ranks.indexOf(cardId);
	if (index < 10) {
		return RankColor.Main
	} else if (index >= 10 && index < 18 && !noMainColor) {
		return RankColor.Main
	} else {
		const cardList = GameGlobal.cardList
		const card = cardList.find(card => card["id"] == cardId)
		if (card.type == 1) {
			return RankColor.Hearts
		} else if (card.type == 2) {
			return RankColor.Spades
		} else if (card.type == 3) {
			return RankColor.Clubs
		} else if (card.type == 4) {
			return RankColor.Diamonds
		}
	}
	return null
}

/**
 * 获取堆的排位颜色
 * @param {*} split 牌堆
 */
export const getSplitRankColor = split => {
	return getCardRankColor(split[0])
}

/**
 * 根据第一个出牌堆花色、本轮主色计算排位表
 * @param {*} rankColor 第一个出牌色
 */
export const getCurCompareRank = rankColor => {
	const mainColor = GameGlobal.databus.gameInfo.mainColor
	const noMainColor = mainColor == 0 || mainColor == 5
	let rank = {}
	let index = 1
	// 大小王
	rank[54] = index
	rank[53] = ++index
	// 四个七\四个2
	if (noMainColor) {
		// 无主
		rank[7] = rank[20] = rank[33] = rank[46] = ++index
		rank[2] = rank[15] = rank[28] = rank[41] = ++index
	} else if (mainColor == 1) {
		// 红桃主
		rank[7] = ++index
		rank[20] = rank[33] = rank[46] = ++index
		rank[2] = ++index
		rank[15] = rank[28] = rank[41] = ++index
	} else if (mainColor == 2) {
		// 黑桃主
		rank[20] = ++index
		rank[7] = rank[33] = rank[46] = ++index
		rank[15] = ++index
		rank[2] = rank[28] = rank[41] = ++index
	} else if (mainColor == 3) {
		// 梅花主
		rank[33] = ++index
		rank[7] = rank[20] = rank[46] = ++index
		rank[28] = ++index
		rank[2] = rank[15] = rank[41] = ++index
	} else if (mainColor == 4) {
		// 方片主
		rank[46] = ++index
		rank[7] = rank[20] = rank[33] = ++index
		rank[41] = ++index
		rank[2] = rank[15] = rank[28] = ++index
	}

	const cardHearts = [1, 13, 12, 11, 10, 9, 8, 5]
	const cardSpades = [14, 26, 25, 24, 23, 22, 21, 18]
	const cardClubs = [27, 39, 38, 37, 36, 35, 34, 31]
	const cardDiamonds = [40, 52, 51, 50, 49, 48, 47, 44];
	const items = [cardHearts, cardSpades, cardClubs, cardDiamonds]
	if (!noMainColor) {
		for (const cardId of items[mainColor - 1]) {
			rank[cardId] = ++index
		}
	}

	if (rankColor != RankColor.Main) {
		if (rankColor == RankColor.Hearts) {
			// 打红桃副牌
			for (const cardId of cardHearts) {
				rank[cardId] = ++index
			}
		} else if (rankColor == RankColor.Spades) {
			// 打黑桃副
			for (const cardId of cardSpades) {
				rank[cardId] = ++index
			}
		} else if (rankColor == RankColor.Clubs) {
			// 打梅花副
			for (const cardId of cardClubs) {
				rank[cardId] = ++index
			}
		} else if (rankColor == RankColor.Diamonds) {
			// 打黑桃副
			for (const cardId of cardDiamonds) {
				rank[cardId] = ++index
			}
		}
	}
	console.log("主色是:", mainColor)
	console.log("本轮出色是：", rankColor)
	const values = []
	const cardList = GameGlobal.cardList
	Object.entries(rank).forEach(([key, value]) => {
		const card = cardList.filter(item => item.id == key)
		values[value] = card[0].name
	})
	console.log("得到的排序是:", values)

	return rank
}

/**
 * 根据第一个出牌堆花色、本轮主色计算分堆表
 */
export const getCurSplitRank = () => {
	const mainColor = GameGlobal.databus.gameInfo.mainColor
	const noMainColor = mainColor == 0 || mainColor == 5
	let cards = []
	// 大小王
	cards.push([54], [53])
	// 四个七\四个2
	if (noMainColor) {
		// 无主
		cards.push([7, 20, 33, 46], [2, 15, 28, 41])
	} else if (mainColor == 1) {
		// 红桃主
		cards.push([7], [20, 33, 46], [2], [15, 28, 41])
	} else if (mainColor == 2) {
		// 黑桃主
		cards.push([20], [7, 33, 46], [15], [2, 28, 41])
	} else if (mainColor == 3) {
		// 梅花主
		cards.push([33], [7, 20, 46], [28], [2, 15, 41])
	} else if (mainColor == 4) {
		// 方片主
		cards.push([46], [7, 20, 33], [41], [2, 15, 28])
	}

	const cardHearts = [
		[1],
		[13],
		[12],
		[11],
		[10],
		[9],
		[8],
		[5]
	]
	const cardSpades = [
		[14],
		[26],
		[25],
		[24],
		[23],
		[22],
		[21],
		[18]
	]
	const cardClubs = [
		[27],
		[39],
		[38],
		[37],
		[36],
		[35],
		[34],
		[31]
	]
	const cardDiamonds = [
		[40],
		[52],
		[51],
		[50],
		[49],
		[48],
		[47],
		[44]
	];
	const items = [cardHearts, cardSpades, cardClubs, cardDiamonds]

	if (!noMainColor) {
		const main = items.splice(mainColor - 1, 1)
		cards = cards.concat(main[0])
	}

	for (const item of items) {
		cards.push([])
		cards = cards.concat(item)
	}
	cards.push([])
	return cards
}

/**
 * 当前我是第一个出牌吗
 */
export const isMyFirstPick = () => {
	const cards = getFirstTurnPick()
	return cards.length == 0
}

/**
 * 获取卡牌连对的下一个id
 * @param {*} cardId 卡牌的id
 */
export const cardRankNext = (cardId, ranks) => {

	for (let i = 0; i < ranks.length; i++) {
		if (ranks[i].includes(cardId)) {
			return ranks[i + 1]
		}
	}
}

/**
 * 获取此牌在堆中的最大连对， 返回最大连对
 * @param {*} cardIds 牌列表
 * @param {*} card 选定的牌
 */
export const pickMaxDouble = (cardIds, card, ranks) => {

	// 辅助函数
	function hasDouble(ids, card) {
		return ids.filter(id => id === card).length >= 2;
	}

	function removeTwo(ids, card) {
		let count = 2;
		return ids.filter(id => id !== card || count-- <= 0);
	}

	const result = []

	let tmpCardIds = [...cardIds]; // 创建副本避免修改原数组
	let currentCard = card;

	while (hasDouble(tmpCardIds, currentCard)) {
		// 添加双卡并移除已用卡牌
		result.push(currentCard, currentCard);
		tmpCardIds = removeTwo(tmpCardIds, currentCard);

		// 寻找下一个有效卡牌
		const nextCard = cardRankNext(currentCard, ranks).find(c => hasDouble(tmpCardIds, c));
		if (!nextCard) break;
		currentCard = nextCard;
	}

	if (result.length == 0) {
		result.push(card)
	}
	return result
}

/**
 * 牌列表做分堆
 * @param {*} cardIds 牌列表
 */
export const splitCards = cardIds => {
	let cards = cardIds
	const ranks = getCurSplitRank()
	const splits = []
	while (cards.length > 0) {
		const card = cards[0]
		const split = pickMaxDouble(cards, card, ranks)
		splits.push(split)
		cards = cards.filter(item => !split.includes(item))
	}
	return splits
}

/**
 * 比较两个堆的大小，先出的堆放前面
 * @param {*} split1 先出的堆
 * @param {*} split2 后出的堆
 * @param {*} rank 排位表
 */
export const splitPKSplit = (split1, split2, rank) => {
	if (split1.length > split2.length) return true
	const rank1 = rank[split1[0]]
	const rank2 = rank[split2[0]]
	if (!rank1 && !rank2) return true
	if (!rank1 && rank2) return false
	if (rank1 && !rank2) return true
	return rank1 <= rank2
}

/**
 * 比较一个堆与多个堆的大小
 * @param {*} split 先出的堆
 * @param {*} splits 多堆
 */
export const splitPKSplits = (split, splits) => {
	const rankColor = getSplitRankColor(split)
	const rank = getCurCompareRank(rankColor)
	for (const item of splits) {
		const comp = splitPKSplit(split, item, rank)
		if (!comp) return false
	}
	return true
}

/**
 * 比较两个多堆的大小
 * @param {*} splits1 
 * @param {*} splits2 
 */
export const splitsPkSplits = (splits1, splits2) => {
	for (const split1 of splits1) {
		const comp = splitPKSplits(split1, splits2)
		if (!comp) {
			GameGlobal.pickErrorSplit = split1
			return false
		}
	}
	return true
}

/**
 * 比较两个卡牌列表的大小
 * @param {*} cardIds1 
 * @param {*} cardIds2 
 */
export const cardIdsPkCardIds = (cardIds1, cardIds2) => {
	const splits1 = splitCards(cardIds1)
	const splits2 = splitCards(cardIds2)
	return splitsPkSplits(splits1, splits2)
}

/**
 * 检查多堆的颜色是否相同
 * @param {*} splits 
 */
export const isSplitsSameColor = splits => {
	let colorSet = new Set()
	splits.forEach(item => {
		const color = getSplitRankColor(item)
		colorSet.add(color)
	})
	return colorSet.size <= 1
}

/**
 * 获取当前牌堆的最长连对
 * @param {*} splits 
 * @param {*} rankColor 
 */
const getMaxDoubleLength = (splits, rankColor) => {
	let count = 1
	splits.forEach(item => {
		if (rankColor == getSplitRankColor(item) &&
			item.length > 1 &&
			item.length > count) {
			count = item.length / 2
		}
	})
	return count
}

/**
 * 检测第一个出牌是否合理
 * @param {*} cardIds 
 */
export const checkFirstPickCard = cardIds => {
	// 手牌分堆
	const splits = splitCards(cardIds)
	if (splits.length <= 1) {
		// 单张或者连对
		return PickError.Right
	} else {
		if (!isSplitsSameColor(splits)) {
			return PickError.MutiDifferent
		}

		// 甩牌
		const leftHand = getPlayInfoBySeat(Seat.Left)
		const leftSplits = splitCards(leftHand.handCards)
		const upHand = getPlayInfoBySeat(Seat.Up)
		const upSplits = splitCards(upHand.handCards)
		const rightHand = getPlayInfoBySeat(Seat.Right)
		const rightSplits = splitCards(rightHand.handCards)
		const otherSplits = [leftSplits, upSplits, rightSplits]
		for (const otherSplit of otherSplits) {
			if (!splitsPkSplits(splits, otherSplit)) {
				return PickError.MutiPick
			}
		}
		return PickError.Right
	}
}

/**
 * 检测非第一个出牌是否合理
 * @param {*} cardIds 
 */
export const checkFollowPickCard = cardIds => {
	// 获取当前牌堆有多少rankColor的牌
	const rankColorCount = (cardList, rankColor) => {
		return cardList.filter(item => {
			return rankColor == getCardRankColor(item)
		}).length
	}

	// 获取当前牌堆有多少个对子
	const getDoubleCount = (splits, rankColor) => {
		let count = 0
		splits.forEach(item => {
			if (rankColor == getSplitRankColor(item) &&
				item.length > 1) {
				count += item.length / 2
			}
		})
		return count
	}

	// 检查出牌个数
	const firstCards = getFirstTurnPick()
	if (cardIds.length != firstCards.length) {
		return PickError.NumPick
	}

	// 检查出牌花色
	const needCount = firstCards.length
	const rankColor = getCardRankColor(firstCards[0])
	const curCount = rankColorCount(cardIds, rankColor)
	if (curCount < needCount) {
		const handCard = getMyHandCard()
		const handCount = rankColorCount(handCard, rankColor)
		if (handCount > curCount) {
			return PickError.ColorPick
		}
	}

	// 检查有对出对
	const firstSplits = splitCards(firstCards)
	const firstDoubleCount = getDoubleCount(firstSplits, rankColor)
	const curSplits = splitCards(cardIds)
	const curDoubleCount = getDoubleCount(curSplits, rankColor)
	const handCard = getMyHandCard()
	const handSplits = splitCards(handCard)
	if (curDoubleCount < firstDoubleCount) {
		const handDoubleCount = getDoubleCount(handSplits, rankColor)
		if (handDoubleCount > curDoubleCount) {
			return PickError.Double
		}
	}

	// 最大连对
	const firstDoubleLength = getMaxDoubleLength(firstSplits, rankColor)
	const curDoubleLength = getMaxDoubleLength(curSplits, rankColor)
	if (curDoubleLength < firstDoubleLength) {
		const handDoubleLength = getMaxDoubleLength(handSplits, rankColor)
		if (handDoubleLength > curDoubleLength) {
			return PickError.DoubleLength
		}
	}
	return PickError.Right
}

/**
 * 检测出牌是否合理
 * @param {*} cardIds 
 */
export const checkPickCard = cardIds => {
	// 当前是否是自己出牌
	if (!isFocuseMy()) return PickError.OtherPick

	const isFistPick = isMyFirstPick()
	if (isFistPick) {
		return checkFirstPickCard(cardIds)
	} else {
		return checkFollowPickCard(cardIds)
	}
}

/**
 * 计算底牌扣底倍数
 * @param {*} winner 
 * @param {*} cardIds 
 */
const getBottomScale = (winner, cardIds) => {
	// 是否最后一轮
	const playerInfo = getPlayInfoBySeat(Seat.Right)
	if (playerInfo.handCards.length != 0) return 0
	// 庄家输赢
	const enemy = GameGlobal.databus.gameInfo.enemyPlayer
	if (enemy == winner) return 0
	// 是主牌扣底吗
	const splits = splitCards(cardIds)
	const rankColor = getSplitRankColor(splits[0])
	if (rankColor != RankColor.Main) return 0
	// 计算扣抵倍数
	const scale = getMaxDoubleLength(splits, rankColor)
	return scale
}

// 判断大小(最后出牌人判断,返回赢家id)
export const compareWinner = cardIds => {
	let winner = null
	let curCards = null
	// 第一个出牌是甩牌，那么直接获胜
	const firstPickCard = getFirstTurnPick()
	const firstSplits = splitCards(firstPickCard)
	if (firstSplits.length > 1) {
		winner = getUserIdBySeat(Seat.Right)
		curCards = firstPickCard
	} else {
		// 第一个出牌
		winner = getUserIdBySeat(Seat.Right)

		curCards = getCurTurnPickBySeat(Seat.Right)
		const up = getCurTurnPickBySeat(Seat.Up)
		const left = getCurTurnPickBySeat(Seat.Left)
		const down = cardIds
		if (!cardIdsPkCardIds(curCards, up)) {
			winner = getUserIdBySeat(Seat.Up)
			curCards = up
		}
		if (!cardIdsPkCardIds(curCards, left)) {
			winner = getUserIdBySeat(Seat.Left)
			curCards = left
		}
		if (!cardIdsPkCardIds(curCards, down)) {
			winner = getUserIdBySeat(Seat.Down)
			curCards = down
		}
	}

	const scale = getBottomScale(winner, curCards)
	return [winner, scale]
}

// 扔牌算分
export const getAdmitDefeatScore = () => {
	const game = GameGlobal.databus.gameInfo
	const targetScore = game.targetScore
	if (targetScore >= 55) return 55
	if (targetScore > 30 && targetScore < 55) return targetScore + 40
	if (targetScore <= 30) return targetScore + 70
}

// 计算本局等级
export const getGameOutGrade = () => {
	const game = GameGlobal.databus.gameInfo
	if (!game) return null

	const curScore = game.curScore
	const targetScore = game.targetScore
	// 庄家赢了
	if (curScore < targetScore) {
		if (curScore == 0) {
			return OutGrade.win1
		} else if (curScore < 30) {
			return OutGrade.win2
		}
		return OutGrade.win3
	} else {
		if (curScore < targetScore + 40) {
			return OutGrade.lose1
		} else if (curScore < targetScore + 70) {
			return OutGrade.lose2
		} else if (curScore < targetScore + 120) {
			return OutGrade.lose3
		} else if (curScore < targetScore + 150) {
			return OutGrade.lose4
		} else if (curScore < targetScore + 200) {
			return OutGrade.lose5
		}
		return OutGrade.lose6
	}
}