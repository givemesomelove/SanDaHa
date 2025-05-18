/*
	全屏蒙层的背景
*/

import {
	Btn_Height,
	Btn_Width,
	menuFrame,
	Screen_Height,
	Screen_Width
} from "../common/Defines";
import {
	isDevEnv, isGMMy
} from "../common/util";
import {
	cloud_backPickCard,
	cloud_deleteGame
} from "../control/cloudFunc";
import Button from "./Button";
import Modal from "./Modal";

export default class SceneSetting extends Modal {
	constructor() {
		super()
		this.btns = this.initBtns()
		this.updateSubItems()
	}

	loginNextUser = () => {
		const nextPlayer = (playerId, players) => {
			let index = players.findIndex(item => playerId == item)
			index = ++index % players.length 
			return players[index]
		}
	
		const players = GameGlobal.databus.gameInfo.turnPlayers
		const userId = GameGlobal.databus.userId
		const nextId = nextPlayer(userId, players)
		GameGlobal.databus.updateLogin(nextId)
	}

	initBtns = () => {
		const btns = []

		const x = (Screen_Width - Btn_Width) / 2
		const y = menuFrame.bottom + 100
		 {
			const btn = new Button(x, y, "重开", () => {
				cloud_deleteGame()
				this.handleOfClickBg()
			})
			btns.push(btn)
		 }

		 {
			const btn = new Button(x, y + Btn_Height + 16, "回溯出牌", () => {
				cloud_backPickCard()
			})
			btns.push(btn)
		 }

		if (isGMMy()) {
			const btn = new Button(x, y + (Btn_Height + 16) * 2, "清空分数", () => {
				cloud_backPickCard()
				this.handleOfClickBg()
			})
			btns.push(btn)
		}

		if (isDevEnv()) {
			const btn = new Button(x, y + (Btn_Height + 16) * 3, "登录下一位", () => {
				this.loginNextUser()
				this.handleOfClickBg()
			})
			btns.push(btn)
		}

		return btns
	}

	update() {
		if (GameGlobal.databus && GameGlobal.databus.userId) {
			this.btns = this.initBtns()
			this.updateSubItems()
		}
		super.update()
	}
}