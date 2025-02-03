/*
	底牌
*/

import { createCard } from "./card"
import {
  BottomCard_Top,
	Card_Height,
  Card_Width,
} from "../common/Defines"
import {
	clickItems, isPointInFrame, makeImage, makeImg, removeItems, renderItems
} from "../common/util"
import SectionCard from "./lineCard1"

const Screen_Width = GameGlobal.canvas.width
const Screen_Height = GameGlobal.canvas.height

export default class BottomCard {
	constructor(isPickCard, selectBlock) {	
    this.selectBlock = selectBlock
    this.sectionCard = new SectionCard('right', 16, BottomCard_Top, this.handleOfClickCard.bind(this))
    
    this.cardBgX = Screen_Width - 16 - Card_Width
    this.cardBgY = BottomCard_Top
    this.cardBgWidth = Card_Width
    this.cardBgHeight = Card_Height
    this.cardbgImg = makeImage("card_bg")
    this.isPickCard = isPickCard
    this.isShowCardBg = false
	}

	handleOfClick(x, y) {
    if (this.isPickCard) {
      const clicked = isPointInFrame(x, y, this.cardBgX, this.cardBgY, this.cardBgWidth, this.cardBgHeight)
      if (clicked) this.isShowCardBg = !this.isShowCardBg
    } else {
      this.sectionCard.handleOfClick(x, y)
    }
	}

	handleOfClickCard() {
    const cardIds = this.sectionCard.getSelectCardIds()
    if (!cardIds || cardIds.length == 0) return;
    
    const cardId = cardIds[0]
		if (this.selectBlock) this.selectBlock(cardId)
	}

	getCardIds() {
    return this.sectionCard.getCardIds()
	}
  
  // 更新底牌
  update(cardIds) {
    this.sectionCard.update(cardIds)
  }

	render(ctx) {
    if (this.isPickCard) {
      if (this.isShowCardBg) {
        this.sectionCard.render(ctx)
      } else {
        ctx.drawImage(this.cardbgImg, this.cardBgX, this.cardBgY, Card_Width, Card_Height);
      }
    } else {
      this.sectionCard.render(ctx)
    }
	}

	remove() {
    this.sectionCard.remove()
	}
}