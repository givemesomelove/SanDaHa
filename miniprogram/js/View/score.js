import { bigHeadImg, drawRoundRect, GameStep, isFocuseMy, isPointInFrame, makeImage, playerName } from "../common/util";
import { cloud_callScore } from "../control/cloudFunc";
import { createLab } from "./lab";

const Screen_Width = GameGlobal.canvas.width

export default class Score {
	constructor(index, y) {
		this.index = this.index

		this.width = 75
		this.num = 80 - index * 5
		this.x = Screen_Width / 2 + (index % 4 - 2)  * this.width
		this.y = y + Math.floor(index / 4) * this.width
		this.image = makeImage("score")
		this.lab = createLab(this.x + this.width / 2, this.y + this.width / 2, `${this.num}`, 'white')

		this.enable = true
	}

	config(userId, enable) {
		this.headImg = null
		this.userId = userId
		if (userId) {
			this.headImg = bigHeadImg(userId)
		}
		this.enable = enable
	}

	// 是否被点击了
    isClicked(x, y) {
        return isPointInFrame(x, y, this.x, this.y, this.width, this.width)
    }

	handleOfClick(x, y) {
		if (this.isClicked(x, y) &&
            !GameGlobal.btnEventBlocked) {

            this.handleOfClickScore()
            GameGlobal.btnEventBlocked = true
            setTimeout(() => {
                GameGlobal.btnEventBlocked = false              
            }, 500)
        }
	}

	handleOfClickScore() {
		if (!this.enable) return 

		cloud_callScore(GameGlobal.databus.userId, this.num)
	}

	render(ctx) {
		ctx.drawImage(this.image, this.x, this.y, this.width, this.width)

		this.lab.render(ctx)

		const width = 30
		if (this.headImg) {
			ctx.drawImage(this.headImg, this.x + this.width - 30, this.y + this.width - width, width, width)
		}

		if (!this.enable) {
			drawRoundRect(ctx, this.x, this.y, this.width, this.width, 0, 'rgba(0, 0, 0, 0.5)')
		}
	}
}