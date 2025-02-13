/*
	全屏蒙层的背景
*/

import { Btn_Height, Btn_Width, menuFrame, Screen_Height, Screen_Width } from "../common/Defines";
import { loginNextUser } from "../common/util";
import { cloud_backPickCard, cloud_deleteGame } from "../control/cloudFunc";
import Button from "./Button";
import Modal from "./Modal";

export default class SceneSetting extends Modal {
	constructor() {
		super()
		this.btns = this.initBtns()
        this.updateSubItems()
	}

	initBtns = () => {
		const btns = []

		const count = 2
		const x = (Screen_Width - Btn_Width) / 2
		const y = menuFrame.bottom + 100 
		
		const btn1 = new Button(x, y, "重开", () => {
			cloud_deleteGame()
			this.handleOfClickBg()
		})
		btns.push(btn1)

		const btn2 = new Button(x, y + Btn_Height + 16, "回溯出牌", () => {
			cloud_backPickCard()
			this.handleOfClickBg()
		})
		btns.push(btn2)

		const btn3 = new Button(x, y + Btn_Height * 2 + 16, "登录下一位", () => {
			loginNextUser()
			this.handleOfClickBg()
		})
		btns.push(btn3)

		return btns
	}

	update() {
		if (GameGlobal.databus && GameGlobal.databus.userId) {
			// this.btns = GameGlobal.databus.userId == "7258032d6791d0ce01a518c43727f177" ? [] : this.initBtns()
			// this.updateSubItems()
		}
		super.update()
	}
}