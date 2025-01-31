/*
	选择其中一位玩家
*/

import { clickItems, playerName, playerNames } from "../util"
import { createLineBtn } from "./lineBtn"

export default class PlayerSelect {
	constructor(y, selectBlock) {
		this.y = y
		this.selectBlock = selectBlock
		this.selectLineBtn = null
		this.update(y)
	}

	handleOfClick(x, y) {
		this.selectLineBtn.handleOfClick(x, y)
	}

	handleOfClickPlayer() {
		const status = this.selectLineBtn.getBtnStatus()
		this.selectLineBtn.setBtnStatus([false, false, false, false])

		const index = status.indexOf(true)
		const userId = GameGlobal.databus.gameInfo["turnPlayers"][index]
		this.selectBlock(userId)
	}

	update(y) {
		this.y = y

		if (this.selectLineBtn) this.selectLineBtn.remove()
		if (!GameGlobal.databus || !GameGlobal.databus.gameInfo) return

		const userIds = GameGlobal.databus.gameInfo["turnPlayers"]
		const names = playerNames(userIds).split(",")
		this.selectLineBtn = createLineBtn(16, this.y, names, this.handleOfClickPlayer.bind(this))
	}

	render(ctx) {
		if (!this.selectLineBtn) return;

		this.selectLineBtn.render(ctx)
	}

	remove() {
		this.selectLineBtn && this.selectLineBtn.remove()	
    }
}