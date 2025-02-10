/*
	全屏蒙层的背景
*/

import { Btn_Height, Btn_Width, Screen_Height, Screen_Width } from "../common/Defines";
import { cloud_deleteGame } from "../control/cloudFunc";
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
		const x = (Screen_Width - Btn_Width) / 2
		const y = (Screen_Height - Btn_Height) / 2
		const btn1 = new Button(x, y, "重开", () => {
			cloud_deleteGame()
			this.handleOfClickBg()
		})
		btns.push(btn1)
		return btns
	}
}