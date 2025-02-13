/*
    显示文本内容
*/

import Item from "./item";

export default class Label extends Item {
    constructor(x, y, text, textColor, direction) {
        super()

        this.x = x
        this.y = y
        this.labText = text
        this.textColor = textColor
		this.active = true
		this.direction = direction
	}
	
	render(ctx) {
		if (!this.active) return
		super.render(ctx)

		if (!this.labText) return

		ctx.font = `${this.font}px Arial`
		ctx.fillStyle = this.textColor
		ctx.textBaseline = 'middle'
		const text = this.labText
		if (!this.direction || this.direction == 'center') {
            const width = ctx.measureText(text).width
            const x = this.x - width / 2
            const y = this.y + this.font / 2
            ctx.fillText(text, x, y)
		} else if (this.direction == 'left') {
            const x = this.x
            const y = this.y + this.height / 2
            ctx.fillText(text, x, y)
		} else if (this.direction == 'right') {
			const width = ctx.measureText(text).width
            const x = this.x - width
            const y = this.y + this.font / 2
            ctx.fillText(text, x, y)
		}
	}
}