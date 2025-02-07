
/*
    选择本局主色
 */

import { menuFrame } from "../common/Defines";
import { makeImage, renderItems } from "../common/util";
import Item from "./item";

const Screen_Width = GameGlobal.canvas.width

class ColorCard extends Item {
    constructor(index, selectBlock) {
        super()
        this.width = 70
        this.height = this.width / 2 * 3
        this.x = Screen_Width / 2 - (2.5 - index) * this.width
        this.y = menuFrame.bottom + 100
        this.image = makeImage(`color_big_${index+1}`)
        this.selectBlock = selectBlock
        this.showMask = true
        this.setActive(false)
    }
}

export default class SelectColor {
    constructor() {
        this.selectIndex = null
        this.items = []
        for (let i = 0; i < 5; i ++) {
            const item = new ColorCard(i, () => {
                this.handleOfClickIndex(i)
            })
            this.items.push(item)
        }
    }

    handleOfClickIndex(index) {
        this.selectIndex = index
        this.items.forEach((item, i) => {
            item.showMask = index != i
        })
    }

    getCurSelectColor() {
        if (this.selectIndex) {
            return this.selectIndex + 1
        } else {
            return null
        }
    }

    render(ctx) {
        renderItems(this.items, ctx)
    }

    display(show) {
        this.items.forEach(item => item.setActive(show))
    }
}