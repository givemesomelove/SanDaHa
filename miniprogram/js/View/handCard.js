/*
    手牌展示，
*/

import { Card_Height, HandCard_Top } from "../common/Defines"
import { cardSplits, clickItems, removeItems } from "../common/util"
import SectionCard from "./lineCard1"

export default class HandCard {
    constructor(selectBlock) {
        this.x = 16
        this.lineCards = null
        this.selectBlock = selectBlock
    }

    handleOfClickhandCard() {
        const cardIds = this.getSelectCardIds()
		if (!cardIds || cardIds.length == 0) return

        if (this.selectBlock) {
            this.selectBlock(cardIds)
        }
    }

    handleOfClick(x, y) {
        clickItems(this.lineCards, x, y)
    }

    update(handCardIds) {
        removeItems(this.lineCards)
        this.lineCards = []

        if (!handCardIds || handCardIds.lenght <= 0) return

        const lines = cardSplits(handCardIds)
        const count = lines.length
        const x = this.x
        const startY = HandCard_Top()
        for (let i = 0; i < count; i ++) {
            const y = startY + (i + 5 - count) * (Card_Height + 5)
            const lineCard = new SectionCard('left', x, y, this.handleOfClickhandCard.bind(this))
            lineCard.update(lines[i])
            this.lineCards.push(lineCard)
        }
    }

    getCardStatus() {
        let cardStatus = []
        for (const lineCard of this.lineCards) {
            cardStatus = cardStatus.concat(lineCard.getCardStatus())
        }
        return cardStatus
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
            const tmp = lineCard.getSelectCardIds()
            if (tmp.length > 0) {
                cardIds = cardIds.concat(tmp)
            }
        }
        return cardIds
    }

    render(ctx) {
        if (this.lineCards) {
            this.lineCards.forEach(lineCard => {
                lineCard.render(ctx)
            })
        }
    }

    remove() {
        removeItems(this.lineCards)
    }
}