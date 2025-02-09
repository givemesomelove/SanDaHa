/*
	底牌
*/

import { BottomCard_Top, Card_Height, Card_Width, Screen_Width } from "../common/Defines";
import { isEnemyMy, isFocuseMy, makeImage } from "../common/util";
import Item from "./item";
import LineCard from "./lineCard";

class BgCard extends Item {
    constructor(x, y, selectBlock) {
        super()
        this.x = x
        this.y = y
        this.width = Card_Width
        this.height = Card_Height
        this.image = makeImage('card_bg')
        this.selectBlock = selectBlock
		this.active = true
		this.enable = true
    }
}

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
		
		if (isPickCard) {
            const x = Screen_Width - 16 - Card_Width
			this.bgCard = new BgCard(x, this.y, this.handleOfClickBgCard.bind(this))
			this.lineCard.active = false
        }

        this.active = true
        this.enable = true
        this.updateSubItems()
    }

    config(cardIds) {
		this.lineCard.config(cardIds)
		this.x = this.lineCard.x
		this.width = this.lineCard.width
    }

    handleOfClickBgCard() {
        this.bgCard.active = false
        this.lineCard.active = true
    }

    hanleOfClickCard(index) {
        if (this.isPickCard) {
            this.bgCard.active = true
            this.lineCard.active = false
        } else {
            if (this.clickBlock) this.clickBlock(index)
        }
	}
	
	update() {
		if (!isEnemyMy()) {
			this.active = false
		} else if (this.isPickCard) {
			const bottomCard = GameGlobal.databus.gameInfo.bottomEndCards
			this.config(bottomCard)
		} else {
			const bottomCard = GameGlobal.databus.gameInfo.bottomStartCards
			this.config(bottomCard)
		}
		super.update()
	}

	render(ctx) {
		super.render(ctx)
	}

    getCardIds() {
        return this.lineCard.getCardIds()
    }
}