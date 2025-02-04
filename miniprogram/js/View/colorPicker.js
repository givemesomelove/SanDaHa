
/*
	选择主色
*/

import { Btn_Height, Btn_Width, Card_Height, LeftCard_Top, RightCard_Top } from "../common/Defines"
import { clickItems, removeItems, renderItems } from "../common/util"
import { createBtn } from "./btn"
import { createLineBtn } from "./lineBtn"

const Screen_Width = GameGlobal.canvas.width
const Screen_Height = GameGlobal.canvas.height

export default class ColorPicker {
	constructor(y) {
		this.initBtns()
		this.color = 0
	}

	initBtns() {
		this.btns = []
		const centerX = Screen_Width / 2
		const centerY = (RightCard_Top + LeftCard_Top + Card_Height) / 2
		const margin = 8
		// 无主
		const x1 = centerX - Btn_Width / 2
		const y1 = centerY - Btn_Height / 2 
		const block1 = () => {
			this.handleOfClickColor(5)
		}
		const btn1 = createBtn(x1, y1, "无主", block1.bind(this))
		btn1.showSelect = true
		this.btns.push(btn1)
		// 红桃
		const x2 = centerX - Btn_Width * 3 / 2 - margin
		const y2 = centerY - Btn_Height / 2 
		const block2 = () => {
			this.handleOfClickColor(1)
		}
		const btn2 = createBtn(x2, y2, "红桃", block2.bind(this))
		btn2.showSelect = true
		this.btns.push(btn2)
		// 黑桃
		const x3 = centerX + Btn_Width / 2 + margin
		const y3 = centerY - Btn_Height / 2 
		const block3 = () => {
			this.handleOfClickColor(2)
		}
		const btn3 = createBtn(x3, y3, "黑桃", block3.bind(this))
		btn3.showSelect = true
		this.btns.push(btn3)
		// 梅花
		const x4 = centerX - Btn_Width / 2
		const y4 = centerY - Btn_Height * 3 / 2 - margin
		const block4 = () => {
			this.handleOfClickColor(3)
		}
		const btn4 = createBtn(x4, y4, "梅花", block4.bind(this))
		btn4.showSelect = true
		this.btns.push(btn4)
		// 方片
		const x5 = centerX - Btn_Width / 2
		const y5 = centerY + Btn_Height / 2 + margin
		const block5 = () => {
			this.handleOfClickColor(4)
		}
		const btn5 = createBtn(x5, y5, "方片", block5.bind(this))
		btn5.showSelect = true
		this.btns.push(btn5)
	}

	handleOfClick(x, y) {
		clickItems(this.btns, x, y)
	}

	handleOfClickColor(color) {
		this.color = color
		const colors = ["红桃", "黑桃", "梅花", "方片", "无主"]
		this.btns.forEach(item => {
			if (item.lab.text != colors[color - 1]) {
				item.select = false
			}
		})
	}

	getCurColor() {
		return this.color
	}

	render(ctx) {
		renderItems(this.btns, ctx)
	}
}