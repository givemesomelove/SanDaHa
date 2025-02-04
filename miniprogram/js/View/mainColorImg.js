/*
	主花色的图标
*/

import { menuFrame } from "../common/Defines"
import { createRightLab } from "./lab"

export default class MainColorImg {
	constructor() {
		this.x = menuFrame.right - 20
		this.y = menuFrame.bottom + 8
		this.width = 20
		this.height = 20
		this.img = null
		this.lab = null
	}

	update() {
		if (GameGlobal.databus.gameInfo) {
			const color = GameGlobal.databus.gameInfo.mainColor
			this.img = GameGlobal.imgs[`color_${color}`]

			const target = GameGlobal.databus.gameInfo.targetScore
			const cur = GameGlobal.databus.gameInfo.curScore
			const text = cur + "/" + target + "分"
			if (target && target > 0) {
				this.lab = createRightLab(this.x - 8, this.y+12, text, 'black')
			} else {
				this.lab = null
			}
		} else {
			this.img = null
			this.lab = null
		}
	}

	render(ctx) {
		if (this.img) {
			ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
		}

		if (this.lab) {
			this.lab.render(ctx)
		}
	}
}
