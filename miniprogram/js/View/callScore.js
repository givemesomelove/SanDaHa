import { HandCard_Top } from "../common/Defines";
import { drawRoundRect, drawRoundedRectBorder, makeImage } from "../common/util";

const Screen_Width = GameGlobal.canvas.width

export default class CallScore {
	constructor() {
		this.downX = Screen_Width  / 2 - 50
		this.downY = HandCard_Top() - 32 - 100
		this.downImg = makeImage("hu_big")

		
	}

	render(ctx) {
		ctx.drawImage(this.downImg, this.downX, this.downY, 100, 100)
		
		drawRoundedRectBorder(ctx, this.downX, this.downY, 100, 100, 0, 'red')

		drawRoundRect(ctx, this.downX, this.downY, 100, 100, 0, 'rgba(0, 0, 0, 0.5)')
	}


}