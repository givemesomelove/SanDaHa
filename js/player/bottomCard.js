/*
	底牌
*/

import { createCard } from "../common/card"
import {
  BottomCard_Top,
	Card_Height,
  Card_Width,
	Screen_Height,
	Screen_Width
} from "../Defines"
import {
	cleanItems, clickItems, isPointInFrame, makeImg, renderItems
} from "../util"
import {
	createLineCard
} from "./lineCard"

export default class BottomCard {
	constructor(isPickCard, selectBlock) {	
    this.selectBlock = selectBlock
    this.cards = null
    
    this.cardBgX = Screen_Width - 16 - Card_Width
    this.cardBgY = BottomCard_Top
    this.cardBgWidth = Card_Width
    this.cardBgHeight = Card_Height
    this.cardbgImg = makeImg("card_bg")
    this.isPickCard = isPickCard
    this.isShowCardBg = false
	}

	handleOfClick(x, y) {
    if (this.isPickCard) {
      const clicked = isPointInFrame(x, y, this.cardBgX, this.cardBgY, this.cardBgWidth, this.cardBgHeight)
      if (clicked) this.isShowCardBg = !this.isShowCardBg
    }
		clickItems(this.cards, x, y)
	}

	handleOfClickCard() {
    const clickIndex = this.cards.findIndex(card => card.select === true);
		if (clickIndex == -1) return

		if (this.selectBlock) this.selectBlock(clickIndex)
	}

	getCardIds() {
    return this.cards ? this.cards.map(card => card.cardId) : []
	}
  
  // 更新手牌
  update(cardIds) {
    const cardList = GameGlobal.cardList
    if (!cardList) return

    cleanItems(this.cards)
    this.cards = []

    let spacing = Screen_Width - cardIds.length * Card_Width - 16
    const count = cardIds.length

    for (let i = 0;i < count; i ++) {
        const x = spacing + i * Card_Width
        let card = createCard(x, BottomCard_Top, cardIds[i], Card_Width, this.handleOfClickCard.bind(this))
        this.cards.push(card)
    }
  }

	render(ctx) {
    
    if (this.isPickCard) {
      if (this.isShowCardBg) {
        renderItems(this.cards, ctx)
      } else {
        ctx.drawImage(this.cardbgImg, this.cardBgX, this.cardBgY, Card_Width, Card_Height);
      }
    } else {
      renderItems(this.cards, ctx)
    }
	}

	remove() {
    cleanItems(this.cards)
	}
}