/*
    卡牌的基类
*/

import { Card_Height, Card_Width } from "../common/Defines"
import { isPointInFrame, Seat } from "../common/util"
import Item from "./item"

export default class Card extends Item {
    constructor(x, y, cardId) {
        super()

        this.x = x
        this.y = y
        this.width = Card_Width
        this.clickWidth = Card_Width
        this.height = Card_Height
        this.cardId = cardId

        const cardList = GameGlobal.cardList
        const card = cardList.find(card => card["id"] == cardId)
        this.image = GameGlobal.imgs[card.img]

        this.active = true
    }

    config(clickWidth, clickBlock) {
        this.enable = true

        this.clickWidth = clickWidth
        this.selectBlock = () => {
            this.showBorder = !this.showBorder
            if (clickBlock) clickBlock(this.index)
        }
	}

    isClicked(x, y) {
        return isPointInFrame(x, y, this.x, this.y, this.clickWidth, this.height)
    }
}

