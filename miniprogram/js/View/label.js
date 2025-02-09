/*
    显示文本内容
*/

import Item from "./item";

export default class Label extends Item {
    constructor(x, y, text, textColor) {
        super()

        this.x = x
        this.y = y
        this.text = text
        this.textColor = textColor
        this.active = true
    }
}