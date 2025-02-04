/*
	左上角重开游戏的按钮
*/

import { Btn_Height, Btn_M_Height, menuFrame } from "../common/Defines";
import { isFocuseMy, isGMMy } from "../common/util";
import { cloud_deleteGame } from "../control/cloudFunc";
import { createBtn, createMiniBtn } from "./btn";

export default class ReStartBtn {
	constructor() {
		this.x = 8
		this.y = (menuFrame.top + menuFrame.bottom) / 2 - Btn_M_Height / 2

		this.btn = createMiniBtn(this.x, this.y, "重开", this.restartGame.bind(this))
		this.show = false
	}

	restartGame() {
		cloud_deleteGame()
	}

	render(ctx) {
		if (this.show) {
			this.btn.render(ctx)
		}
	}

	update() {
		this.show = isGMMy()
	}

	handleOfClick(x, y) {
		if (this.show) {
			this.btn.handleOfClick(x, y)
		}
	}
}