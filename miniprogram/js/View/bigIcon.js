import { bigHeadImg, drawRoundRect, GameStep, makeImage, playerName, userColor } from "../common/util"
import { createLab } from "./lab"

const Screen_Width = GameGlobal.canvas.width
const Screen_Height = GameGlobal.canvas.height

export default class BigIcon {
	constructor(index) {
		this.image = null
		this.color = null
		this.height = 100

		const startY = Screen_Height / 2 - 24 - this.height * 2
		this.y = startY + index * (this.height + 16)

		this.lab = null
	}

	config(userId) {
		if (!userId) {
			this.image = null
			this.color = null
			this.lab = null
			return
		}

		this.image = bigHeadImg(userId)
		this.color = userColor(userId)
		this.lab = createLab(Screen_Width / 2, this.y + 40, playerName(userId), 'black')
	}

	render(ctx) {
		if (this.color) {
			drawRoundRect(ctx, 0, this.y, Screen_Width, this.height, 0, this.color)
		}

		if (this.image) {
			ctx.drawImage(this.image, 0, this.y, this.height, this.height)
		}

		if (this.lab) {
			this.lab.render(ctx)
		}
	}
}