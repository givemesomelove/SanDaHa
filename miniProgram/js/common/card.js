/*
    卡牌的基类
*/

import { Card_Height, Card_Width, Card_Select_Width, Select_Icon } from "../Defines"
import { makeImg } from "../util"

export default class Card {
    constructor() {
        this.image = null
        this.width = Card_Width
        this.height = Card_Height
        this.selectImage = makeImg("select")
        this.clickableWidth = Card_Width

        this.clickBlock = null 
        this.select = false
    }

    // 配置卡牌信息
    config(x, y, cardId, clickableWidth, clickBlock) {
        const cardList = GameGlobal.cardList
        if (!cardList) return;
        
        this.x = x
        this.y = y
        this.clickableWidth = clickableWidth

        this.cardId = cardId
        const card = cardList.find(card => card["id"] == cardId)
        if (!card) return
        this.image = card["imv"]
        this.clickBlock = clickBlock
        
        this.select = false
    }

    // 销毁
    remove() {
        GameGlobal.pool.recover('card', this)
    }

    // 刷新显示
    render(ctx) {
        if (this.image) {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
        }

        if (this.select) {
            const x = this.x + (this.width - Card_Select_Width) / 2
            const y = this.y + (this.height - Card_Select_Width) / 2
            ctx.drawImage(this.selectImage, x, y, Card_Select_Width, Card_Select_Width)
        }
    }

    // 是否被点击了
    isClicked(x, y) {
        return x > this.x &&
            x < this.x + this.clickableWidth &&
            y > this.y &&
            y < this.y + this.height
    }

    // 点击事件处理
    handleOfClick = (x, y) => {
        if (this.isClicked(x, y) && !GameGlobal.cardEventBlocked) {
            this.select = !this.select
            if (this.clickBlock) this.clickBlock()
            GameGlobal.cardEventBlocked = true
            setTimeout(() => {
                GameGlobal.cardEventBlocked = false
            }, 800)
        }
    }
}

export const createCard = (x, y, cardId, clickableWidth, clickBlock) => {
    let card = GameGlobal.pool.getItemByClass('card', Card)
    card.config(x, y, cardId, clickableWidth, clickBlock)
    return card
}

