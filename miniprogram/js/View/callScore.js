import { Btn_Height, Btn_Width, HandCard_Top, menuFrame } from "../common/Defines";
import { drawRoundRect, drawRoundedRectBorder, makeImage, renderItems, updateItems, curMaxCallScore, isUserCallScore, bigHeadImg, clickItems } from "../common/util";
import { cloud_callScore } from "../control/cloudFunc";
import { createBtn } from "./btn";
import Score from "./score";

const Screen_Width = GameGlobal.canvas.width

export default class CallScore {
	constructor() {
		this.itemWidth = 75
		this.imgs = []
		this.ons = []

		this.initScoreBtns()

		this.stopBtn = createBtn(Screen_Width / 2 - Btn_Width, HandCard_Top() - Btn_Height - 16, "不要了", this.handleOfClickStop.bind(this))
	}

	initScoreBtns() {
		const y = menuFrame.bottom + 16 * 2 + this.itemWidth
		this.btns = []
		for (let i = 0; i < 16; i ++) {
			const btn = new Score(i, y)
			this.btns.push(btn)
		}
	}

	handleOfClickStop() {
		const userId = GameGlobal.databus.userId
		cloud_callScore(userId, 0)
	}

	handleOfClick(x, y) {
		clickItems(this.btns, x, y)
		clickItems([this.stopBtn], x, y)
	}

	update() {
		const players = GameGlobal.databus.gameInfo.turnPlayers
		players.forEach((item, index) => {
			this.imgs[index] = bigHeadImg(item)
			this.ons[index] = isUserCallScore(item)
		})
        
		const focuseId = GameGlobal.databus.gameInfo.focusPlayer
		this.focuse = players.indexOf(focuseId)

        const cur = curMaxCallScore()
		if (cur) {
            const score = cur[0]
            const userId = cur[1]
			const curIndex = (80 - score) / 5
			this.btns.forEach((item, index) => {
                if (curIndex == index) {
                    item.config(userId, false)
                } else if (curIndex < index) {
                    item.config(null, true)
                } else {
                    item.config(null, false)
                }
			})
		} else {
			this.btns.forEach(item => {
				item.config(null, true)
			})
		}
	}

	handleOfClickScore(num) {
		console.log(num)
	}

	render(ctx) {
		const width = this.itemWidth
		const x = Screen_Width / 2 - this.itemWidth * 2
		const y = menuFrame.bottom + 16
		for (let i = 0; i < 4; i ++) {
			if (this.imgs[i]) {
				ctx.drawImage(this.imgs[i], x + i * width, y, width, width)
			}
			if (this.focuse == i) {
				drawRoundedRectBorder(ctx, x + i * width, y, width, width, 0, 'red')
			}
			if (!this.ons[i]) {
				drawRoundRect(ctx, x + i * width, y, width, width, 0, 'rgba(0, 0, 0, 0.5)')
			}
		}

		this.stopBtn.render(ctx)

		renderItems(this.btns, ctx)
	}


}