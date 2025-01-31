
/*
	选择主色
*/

import { createLineBtn } from "./lineBtn"

export default class ColorPicker {
	constructor(y) {
		this.y = y
		this.selectLineBtn = null
		this.update(y)
		this.index = null
		this.status = [false, false, false, false, false]
	}

	handleOfClick(x, y) {
		this.selectLineBtn.handleOfClick(x, y)
	}

	handleOfClickColor() {
		const status = this.selectLineBtn.getBtnStatus()
		let resultStatus = [false, false, false, false, false]
		for (let i = 0;i < status.length; i ++) {
			if (this.status[i] != status[i] && !this.status[i]) {
				resultStatus[i] = true
				break
			}
		}
		this.selectLineBtn.setBtnStatus(resultStatus)
		this.status = resultStatus
	}

	getCurColor() {
		return this.status.indexOf(true) + 1
	}

	update(y) {
		this.y = y

		this.selectLineBtn && this.selectLineBtn.remove()
		const colors = ["红桃", "黑桃", "梅花", "方片", "无主"]
		this.selectLineBtn = createLineBtn(16, this.y, colors, this.handleOfClickColor.bind(this))
	}

	render(ctx) {
		this.selectLineBtn && this.selectLineBtn.render(ctx)
	}

	remove() {
		this.selectLineBtn && this.selectLineBtn.remove()
	}
}