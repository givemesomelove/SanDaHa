import {
	cardRankNext,
	getCurTurnPickBySeat,
	getFirstTurnPick,
	getPlayInfoBySeat,
	getUserIdBySeat,
	isFocuseMy,
	PickError,
	RankColor,
	Seat
} from "../common/util"

// 获取当前出牌的排位颜色
export const getRankColor = (split) => {
	const cardId = split[0]
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

export const curCompareRank = (split) => {
	const mainColor = GameGlobal.databus.gameInfo.mainColor
	const noMainColor = mainColor == 0 || mainColor == 5
	const rankColor = getRankColor(split)
	let rank = {}
	let index = 0
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
		for (const cardId of items[mainColor + 1]) {
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
	return rank
}

export const compareCard = (card1, card2, compareRank) => {
	const tmp1 = compareRank[card1]
	const tmp2 = compareRank[card2]
	if (!tmp1 && !tmp2) return true
	if (!tmp1 && tmp2) return false
	if (tmp1 && !tmp2) return true
	return tmp1 <= tmp2
}

// 当前我是第一个出牌吗
export const isMyFirstPick = () => {
	const cards = getFirstTurnPick()
	return cards.length == 0
}

// 获取第一张牌，在堆中的最大连对， 返回最大连对
export const pickMaxDouble = (cardIds, card) => {
	const result = []

	let tmpCardIds = cardIds
	let tmpCard = card
	while (true) {
		const items = tmpCardIds.filter(item => item == tmpCard)
		if (items.length == 2) {
			result.push(tmpCard, tmpCard)
			tmpCardIds.filter(item => item != tmpCard)
			tmpCard = cardRankNext(tmpCard)
			if (!tmpCard) break
		} else {
			break
		}
	}
	if (result.length == 0) {
		result.push(card)
	}
	return result
}

// 将牌按照单张或者连对分堆
export const splitPickCardIds = cardIds => {
	let cards = Array.from(cardIds)
	const splits = []
	while (cards.length > 0) {
		const card = cards[0]
		const split = pickMaxDouble(cards, card)
		splits.push(split)
		cards = cards.filter(item => !split.includes(item))
	}
	return splits
}

// 判断某张牌是不是全大于另一个堆
export const isSplitBigSplits = (splits, split, compareRank) => {
	const cardId = split[0]
	for (const item of splits) {
		const tmp = item[0]
		if (item.length >= split.length &&
			!compareCard(cardId, tmp, compareRank)) {
				return false
		}
	}
	return true
}

export const isSplitsBigSplits = (splits1, splits2) => {
	for (const split of splits1) {
		const rankCompare = curCompareRank(split)
		if (!isSplitBigSplits(splits2, split, rankCompare)) {
			return false
		}
	}
	return true
}

// 检查多堆的颜色是否相同
export const checkSplitsSameColor = splits => {
	let color = null
	splits.forEach(item => {
		if (!color) {
			color = getRankColor(item)
		} else {
			if (color != getRankColor(item)) {
				return false
			}
		}
	})
	return true
}

// 检测第一个出牌是否合理
export const checkFirstPickCard = cardIds => {
	// 手牌分堆
	const splits = splitPickCardIds(cardIds)
	if (splits.length <= 1) {
		// 单张或者连对
		return PickError.Right
	} else {
		if (!checkSplitsSameColor(splits)) {
			return PickError.mutiDifferent
		}

		// 甩牌
		const leftHand = getPlayInfoBySeat(Seat.Left)
		const leftSplits = splitPickCardIds(leftHand)
		const upHand = getPlayInfoBySeat(Seat.Up)
		const upSplits = splitPickCardIds(upHand)
		const rightHand = getPlayInfoBySeat(Seat.Right)
		const rightSplits = splitPickCardIds(rightHand)
		const otherSplits = [leftSplits, upSplits, rightSplits]
		for (const otherSplit of otherSplits) {
			if (!isSplitsBigSplits(splits, otherSplit)) {
				return PickError.mutiPick
			}
		}
	}
}

// 检测非第一个出牌是否合理
export const checkFollowPickCard = cardIds => {
	const firstCards = getFirstTurnPick()
	if (cardIds.length != firstCards.length) {
		return PickError.numPick
	}

	// todo：待完善
	return PickError.Right
	const firstSplists = splitPickCardIds(firstCards)
	if (firstSplists.length > 1) {
		return PickError.Right
	}
}

// 检测当前出牌是否合理
export const checkPickCard = cardIds => {
	// 当前是否是自己出牌
	if (!isFocuseMy()) return PickError.OtherPick

	const isFirstPick = isMyFirstPick()
	if (isFirstPick) {
		return checkFirstPickCard(cardIds)
	} else {
		return checkFollowPickCard(cardIds)
	}
}

// 判断两个玩家出牌大小
export const copmareTwo = (seat1, seat2, rankCompare) => {
	const cards1 = getCurTurnPickBySeat(seat1)
	const rank1 = rankCompare[cards1[0]]
	const cards2 = getCurTurnPickBySeat(seat2)
	const rank2 = rankCompare[cards2[0]]
	return rank1 <= rank2
}

// 判断大小(最后出牌人判断,返回赢家id)
export const compareWinner = cardIds => {
	// 第一个出牌是甩牌，那么直接获胜
	const firstPickCard = getFirstTurnPick()
	const firstSplits = splitPickCardIds(firstPickCard)
	if (firstSplits.length > 1) return getUserIdBySeat(Seat.Right)

	const cards1 = getCurTurnPickBySeat(Seat.Right)
	const rankCompare = curCompareRank([cards1[0]])
	// 第一个出牌与第二个比
	const right = cards1
	const up = getCurTurnPickBySeat(Seat.Up)
	const left = getCurTurnPickBySeat(Seat.left)
	const down = cardIds

	let winner = getUserIdBySeat(Seat.Right)
	let curCards = right
	if (!copmareTwo(curCards, up, rankCompare)) {
		winner = getUserIdBySeat(Seat.Up)
		curCards = up
	}
	if (!copmareTwo(curCards, left, rankCompare)) {
		winner = getUserIdBySeat(Seat.Left)
		curCards = left
	}
	if (!copmareTwo(curCards, down, rankCompare)) {
		winner = getUserIdBySeat(Seat.Down)
		curCards = down
	}
	return winner
}