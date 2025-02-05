import { drawRoundRect, GameStep, makeImage, playerName } from "../common/util"
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

		const name = playerName(userId)
		if (name == "谭别") {
			this.image = makeImage("tan_big")
			this.color = '#f0bcbc'
		} else if (name == "西瓜别") {
			this.image = makeImage("gua_big")
			this.color = '#a5e7ac'
		} else if (name == "徐别") {
			this.image = makeImage("xu_big")
			this.color = '#e3c69e'
		} else if (name == "鸟别") {
			this.image = makeImage("niao_big")
			this.color = '#b8c0e2'
		} else if (name == "虎别") {
			this.image = makeImage("hu_big")
			this.color = '#d2d19d'
		}
		this.lab = createLab(Screen_Width / 2, this.y + 40, name, 'black')
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