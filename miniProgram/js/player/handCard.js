/*
    手牌展示，
*/

import { Card_Height, Screen_Height, Screen_Width } from "../Defines"
import { cardSplits, cleanItems, clickItems } from "../util"
import { createLineCard } from "./lineCard"

export default class HandCard {
    constructor(selectBlock) {
        this.x = 16
        this.bottom = 34
        this.lineCards = null
        this.y = Screen_Height / 2
        this.selectBlock = selectBlock
    }

    handleOfClickhandCard() {
        const status = this.getCardStatus()
		const clickIndex = status.indexOf(true)
		if (clickIndex == -1) return

        if (this.selectBlock) {
            this.selectBlock(clickIndex)
        }
    }

    handleOfClick(x, y) {
        clickItems(this.lineCards, x, y)
    }

    update(handCardIds) {
        const cardList = GameGlobal.cardList
        if (!cardList) return

        cleanItems(this.lineCards)
        this.lineCards = []

        if (!handCardIds || handCardIds.lenght <= 0) return

        const lines = cardSplits(handCardIds)
        const count = lines.length
        let spacing = this.x
        let startY = Screen_Height - this.bottom - count * (Card_Height + 5) + 5
        this.y = startY
        for (let i = 0; i < count; i ++) {
            const y = startY + i * (Card_Height + 5)
            let lineCard = createLineCard(spacing, y, Screen_Width - this.x * 2, lines[i], this.handleOfClickhandCard.bind(this))
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
        cleanItems(this.lineCards)
    }
}