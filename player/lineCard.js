/*
    一行卡牌的展示
*/

import { createCard } from "../common/card";
import { Card_Height, Card_Width, Screen_Width } from "../Defines";
import { cleanItems, clickItems } from "../util";

export default class LineCard {
    constructor() {
        this.height = Card_Height
        
        this.clickBlock = null
        this.cards = null
    }

    // 配置这行牌
    config(x, y, width, cardIds ,clickBlock) {
        this.x = x
        this.y = y
        this.width = width
        this.clickBlock = clickBlock
        this.cardIds = cardIds

        this.updateCards(cardIds)
    }

    // 销毁
    remove() {
        cleanItems(this.cards)
        GameGlobal.pool.recover('LineCard', this)
    }

    // 更新手牌
    updateCards(cardIds) {
        const cardList = GameGlobal.cardList
        if (!cardList) return

        cleanItems(this.cards)
        this.cards = []

        let cardWidth = Card_Width
        const spacing = this.x
        const count = cardIds.length
        const maxCardWidth = count * Card_Width
        if (maxCardWidth + spacing * 2 > Screen_Width) {
            cardWidth = cardWidth * 2 / 3
        }

        for (let i = 0;i < count; i ++) {
            const x = spacing + i * cardWidth
            let card = createCard(x, this.y, cardIds[i], cardWidth, this.handleOfClickCard.bind(this))
            this.cards.push(card)
        }
    }

    getCardIds() {
        return this.cards.map(card => card.cardId)
    }

    getSelectCardIds() {
        let cardIds = []
        for (const card of this.cards) {
            if (card.select) {
                cardIds.push(card.cardId)
            }
        }
        return cardIds
    }

    getCardStatus() {
        let status = []
        for (const card of this.cards) {
            status.push(card.select)
        }
        return status
    }

    setBtnStatus(status) {
        for (let i = 0; i < status.length; i ++) {
            this.cards[i].select = status[i]
        }
    }

    handleOfClickCard() {
        if (this.clickBlock) this.clickBlock()
    }

    // 点击事件
    handleOfClick (x, y) {
        clickItems(this.cards, x, y)
    }

    // 渲染
    render(ctx) {
        // 展示手牌
        if (this.cards) {
            this.cards.forEach(card => {
                card.render(ctx)
            })
        }
    }
}

export const createLineCard = (x, y, width, cardIds ,clickBlock) => {
    let lineCard = GameGlobal.pool.getItemByClass('lineCard', LineCard)
    lineCard.config(x, y, width, cardIds ,clickBlock)
    return lineCard
}