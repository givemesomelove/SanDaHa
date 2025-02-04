/*
    一行卡牌的展示
*/

import { createCard } from "./card"
import { Card_Width } from "../common/Defines"
import { clickItems, removeItems, renderItems } from "../common/util"

const Screen_Width = GameGlobal.canvas.width
const Screen_Height = GameGlobal.canvas.height

export default class SectionCard {
    constructor(direction, spacing, y, clickBlock) {
        this.direction = direction
        this.spacing = spacing
        this.y = y
        this.clickBlock = clickBlock
    }

    update(cardIds) {
        this.remove()

        let cardWidth = Card_Width
        const count = cardIds.length
        const maxCardWidth = count * Card_Width
        if (maxCardWidth + this.spacing > Screen_Width) {
            cardWidth = cardWidth * 2 / 3
        }
        const maxWidth = cardWidth * count
        let spacing = this.spacing
        if (this.direction == "right") {
            spacing = Screen_Width - spacing - maxWidth
        } else if (this.direction == "center") {
            spacing = (Screen_Width - maxWidth) / 2
        }

        for (let i = 0; i < count; i ++) {
            const x = spacing + i * cardWidth
            let card = createCard(x, this.y, cardIds[i], cardWidth, this.handleOfClickCard.bind(this))
            this.cards.push(card)
        }
    }

    // 获取卡牌id列表
    getCardIds() {
        return this.cards.map(card => card.cardId)
    }

    // 获取选中卡牌的id列表
    getSelectCardIds() {
        let cardIds = []
        for (const card of this.cards) {
            if (card.select) {
                cardIds.push(card.cardId)
            }
        }
        return cardIds
    }

    handleOfClickCard() {
        if (this.clickBlock) this.clickBlock()
    }

    // 点击事件
    handleOfClick(x ,y) {
        clickItems(this.cards, x, y)
    }

    // 渲染
    render(ctx) {
        // 展示手牌
        renderItems(this.cards, ctx)
    }

    remove() {
        removeItems(this.cards)
        this.cards = []
    }

}