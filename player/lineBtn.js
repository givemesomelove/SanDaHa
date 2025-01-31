/*
	一行五个窄按钮
*/

import { createMiniBtn } from "../common/btn";
import { Btn_M_Height, Btn_M_Wdith, Screen_Width } from "../Defines";
import { cleanItems, clickItems, renderItems } from "../util";

export default class LineBtn {
	constructor() {
		this.height = Btn_M_Height
		this.width = Btn_M_Wdith

		this.clickBlock = null
		this.btns = null

		this.selectIndex = null
	}

	// 配置这行按钮
	config(x, y, titles, clickBlock) {
		this.x = x
		this.y = y
		this.clickBlock = clickBlock
		this.titles = titles

		this.btns = []

		const spacing = x
		const margin = (Screen_Width - spacing * 2 - this.width * 5) / 4
		for (let i = 0; i < titles.length; i ++) {
			const left = x + i * (margin + this.width)
			let btn = createMiniBtn(left, y, titles[i], this.handleOfClickBtn.bind(this))
			this.btns.push(btn)
		}
	}

	getBtnStatus() {
		let status = []
		for (const btn of this.btns) {
			status.push(btn.select)
		}
		return status
	}

	setBtnStatus(status) {
		for (let i = 0; i < status.length; i ++) {
			this.btns[i].select = status[i]
		}
	}

	handleOfClick(x, y) {
		clickItems(this.btns, x, y)
	}


	handleOfClickBtn() {
		if (this.clickBlock) {
			this.clickBlock()
		}
	}

	remove() {
		cleanItems(this.btns)
		GameGlobal.pool.recover('lineBtn', this)
	}

	// 渲染
	render(ctx) {
		renderItems(this.btns, ctx)
	}
}

export const createLineBtn = (x, y, titles, clickBlock) => {
	let lineBtn = GameGlobal.pool.getItemByClass('lineBtn', LineBtn)
	lineBtn.config(x, y, titles, clickBlock)
	return lineBtn
}