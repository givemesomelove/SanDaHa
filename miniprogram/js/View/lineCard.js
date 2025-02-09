/*
    一行卡牌的展示
*/

import { Card_Height, Card_Width, Screen_Width } from "../common/Defines";
import Card from "./card";
import Item from "./item";

export default class LineCard extends Item {
    constructor(direction, spacing, y, clickBlock) {
        super()
        this.direction = direction
        this.spacing = spacing
        this.y = y
        this.height = Card_Height
        
        this.clickBlock = clickBlock
        this.active = true
        this.enable = true

        this.cards = []
    }

    config(cardIds) {
        let cardWidth = Card_Width
        const count = cardIds.length
        const maxCardWidth = count * Card_Width
        if (maxCardWidth + this.spacing > Screen_Width) {
            cardWidth = cardWidth * 2 / 3
        }
        const maxWidth = cardWidth * count
        let spacing = this.spacing
        if (this.direction == 'right') {
            spacing = Screen_Width - spacing - maxWidth
        } else if (this.direction == 'center') {
            spacing = (Screen_Width - maxWidth) / 2
        }

        this.x = spacing
        this.width = maxWidth

        this.cards = []
        for (let i = 0; i < count; i ++) {
            const x = spacing + i * cardWidth
            let card = new Card(x, this.y, cardIds[i])
            card.config(cardWidth, this.clickBlock)
            card.index = i
            this.cards.push(card)
        }

        this.updateSubItems()
    }

    // 获取当前卡牌id列表
    getCardIds() {
        return this.cards.map(card => card.cardId)
    }

    // 获取选定的卡牌id列表
    getSelectCardIds() {
        let cardIds = []
        for (const card of this.cards) {
            if (card.showBorder) {
                cardIds.push(card.cardId)
            }
        }
        return cardIds
    }

}