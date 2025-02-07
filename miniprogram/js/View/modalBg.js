/*
	全屏蒙层的背景
*/

import { isPointInFrame } from "../common/util";
import Item from "./item";

const Screen_Width = GameGlobal.canvas.width
const Screen_Height = GameGlobal.canvas.height

export default class ModalBg extends Item {
	constructor() {
		super()

		this.x = 0
		this.y = 0
		this.width = Screen_Width
		this.height = Screen_Height
		this.bgColor = "rgba(0, 0, 0, 0.7)"
		this.selectBlock = this.handleOfClickBg.bind(this)

		this.btns = []
	}

	handleOfClickBg(x, y) {
		for (const btn of this.btns) {
			if (isPointInFrame(x, y, btn.x, btn,y, btn.width, btn.height)) {
				return
			}
		}

		this.setActive(false)
	}
}