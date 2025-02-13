/*
    手牌展示，
*/

import {
	Card_Height,
	HandCard_Top,
	Screen_Height,
	Screen_Width
} from "../common/Defines";
import {
	cardSplits,
	getAllMyHandCard,
	getHandCardBySeat,
	getMyHandCard,
	isSameCards,
	Seat
} from "../common/util";
import Item from "./item";
import LineCard from "./lineCard";

/**
 * Creates an instance of SceneEnd.
 * 
 * @param {Function} [selectBlock=null] - 点击事件回调
 * @param {boolean} [isShowAll=false] - 是展示所有手牌还是当前手牌
 */

export default class HandCards extends Item {
	constructor({
		selectBlock = null,
		isShowAll = false
	}) {
		super()

		this.isShowAll = isShowAll
		this.clickBlock = selectBlock

		this.x = 16
		this.y = HandCard_Top
		this.width = Screen_Width
		this.height = Screen_Height - HandCard_Top - 34
		this.active = true
		this.enable = true

		this.lineCards = this.initLineCards()
		this.updateSubItems()

		this.selectCards = []
	}

	initLineCards() {
		const items = []
		for (let i = 0; i < 5; i++) {
			const y = HandCard_Top + i * (Card_Height + 5)
			const lineCard = new LineCard(
				'left',
				this.x,
				y,
				index => {
					if (this.clickBlock) {
						const cardIds = this.getSelectCardIds()
						this.clickBlock(cardIds)
					}
				}
			)
			items.push(lineCard)
		}
		return items
	}

	getCardIds() {
		let cardIds = []
		for (const lineCard of this.lineCards) {
			cardIds = cardIds.concat(lineCard.getCardIds())
		}
		return cardIds
	}

	getSelectCardIds() {
		let cardIds = []
		for (const lineCard of this.lineCards) {
			cardIds = cardIds.concat(lineCard.getSelectCardIds())
		}
		return cardIds
	}

	config(cardIds) {
		// 如果卡片列表长度没有变化即认为卡片没有变化，
		// 那么需要保持卡牌选定状态不变
		if (isSameCards(cardIds, this.getCardIds())) {
			return
		}

		if (!cardIds || cardIds.length <= 0) {
			this.lineCards.forEach(item => item.config([]))
			return
		}

		const lines = cardSplits(cardIds)
		const count = lines.length
		for (let i = 0; i < 5; i++) {
			if (i < 5 - count) {
				this.lineCards[i].config([])
			} else {
				this.lineCards[i].config(lines[i - (5 - count)])
			}
		}
	}

	setSelectCard = () => {
		this.selectCards.forEach(item => {
			for (const lineCard of this.lineCards) {
				const card = lineCard.cards.find(item1 => item1.cardId == item)
				if (card) {
					card.showBorder = true
					break
				}
			}
		})
	}

	update() {
		if (this.isShowAll) {
			const cardIds = getAllMyHandCard()
			this.config(cardIds)
		} else {
			// 刷新不改变选定的牌
			const cardIds = getMyHandCard()
			this.config(cardIds)

		}
		super.update()
	}
}