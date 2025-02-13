/*
	底牌
*/

import { BottomCard_Top, Card_Height, Card_Width, Screen_Width } from "../common/Defines";
import { isEnemyMy, isFocuseMy, makeImage } from "../common/util";
import Item from "./item";
import LineCard from "./lineCard";



export default class BottomCards extends Item {
    constructor(isPickCard, selectBlock) {
        super()

        this.isShowCardBg = false
        this.isPickCard = isPickCard
        this.clickBlock = selectBlock
        
		this.lineCard = new LineCard('right', 16, BottomCard_Top, this.hanleOfClickCard.bind(this))

		this.x = this.lineCard.x
        this.y = this.lineCard.y
        this.width = this.lineCard.width
		this.height = this.lineCard.height

        this.active = true
        this.enable = true
        this.updateSubItems()
    }

    config(cardIds) {
		this.lineCard.config(cardIds)
		this.x = this.lineCard.x
		this.width = this.lineCard.width
    }

    hanleOfClickCard(index) {
        if (this.clickBlock) this.clickBlock(index)
	}
	
	update() {
		if (!isEnemyMy()) {
			this.active = false
		} else {
			const bottomCard = GameGlobal.databus.gameInfo.bottomStartCards
			this.config(bottomCard)
		}
		super.update()
	}

    getCardIds() {
        return this.lineCard.getCardIds()
    }
}