
/*
    选择本局主色
 */

import { menuFrame, Screen_Width } from "../common/Defines";
import { makeImage } from "../common/util";
import Item from "./item";

class ColorCard extends Item {
    constructor(x, y, index, selectBlock) {
        super()
        this.width = 70
        this.height = 70
        this.x = x + index * this.width
        this.y = y
        this.image = makeImage(`color_${index+1}`)
        this.selectBlock = selectBlock
        this.showMask = true
		this.active = true
		this.enable = true
    }
}

export default class SelectColor extends Item {
    constructor() {
		super()

		this.x = (Screen_Width - 5 * 70) / 2
		this.y = menuFrame.bottom + 100
		this.width = 5 * 70
        this.height = 70
        this.bgColor = 'white'

		this.items = this.initColorCards()
		this.active = true
        this.enable = true
        this.selectIndex = -1
		this.updateSubItems()
	}
	
	initColorCards() {
		let items = []
        for (let i = 0; i < 5; i ++) {
            const item = new ColorCard(this.x, this.y, i, () => {
                this.handleOfClickIndex(i)
            })
            items.push(item)
		}
		return items
	}

    handleOfClickIndex = index => {
        this.selectIndex = index
        this.items.forEach((item, i) => {
            item.showMask = index != i
        })
    }

    getCurSelectColor() {
        if (this.selectIndex != -1) {
            return this.selectIndex + 1
        } else {
            return null
        }
	}
	
	render(ctx) {
		super.render(ctx)
	}
}