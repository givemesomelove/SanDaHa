/*
	选择本轮谁赢了
*/

import { cloud_pickWin } from "../cloudFunc";
import Scene from "../common/scene";
import { Screen_Height } from "../Defines";
import PlayersIcon from "../player/playerIcon";
import PlayerSelect from "../player/playerSelect";
import TurnPickCard from "../player/turnPickCard";
import { GameStep, playerName } from "../util";

export default class ScenePickWin extends Scene {
	constructor() {
		super()
		this.sceneStep = GameStep.SelectWinner

		this.playersIcon = new PlayersIcon()
		this.playerSelect = new PlayerSelect(Screen_Height / 2, this.handleOfClickWiner.bind(this))
		this.turnPickCard = new TurnPickCard()
	}

	handleOfClickWiner(userId) {
		cloud_pickWin(userId)
	}

	updateScene() {
		this.turnPickCard.remove()
		this.playerSelect.remove()
		if (this.needUpdate) {
			this.playersIcon.update()
			this.turnPickCard.update()
			this.playerSelect.update(Screen_Height / 2)
		}
	}

	renderScene(ctx) {
		this.playersIcon.render(ctx)
		this.turnPickCard.render(ctx)
		// this.playerSelect.render(ctx)
	}

	handleOfSceneClick(x, y) {
		this.playerSelect.handleOfClick(x, y)
	}

	getTipStrs() {
		if (GameGlobal.databus && GameGlobal.databus.gameInfo) {
			const text1 = "游戏阶段：选谁大"
			const userId = GameGlobal.databus.gameInfo["focusPlayer"]
			const name = playerName(userId)
			const text2 = name + "选择"
			return [text1, text2]
		}
		return [[]]
	}

}