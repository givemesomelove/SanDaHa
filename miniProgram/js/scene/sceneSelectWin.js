/*
	选择本轮谁赢了
*/

import { cloud_pickWin } from "../control/cloudFunc";
import Scene from "./scene";
import { Screen_Height } from "../common/Defines";
import PlayersIcon from "../View/playerIcon";
import PlayerSelect from "../View/playerSelect";
import TurnPickCard from "../View/turnPickCard";
import { cardRanks, GameStep, getUserKeyBySeat, playerName, Seat } from "../common/util";
import HandCard from "../View/handCard";

export default class ScenePickWin extends Scene {
	constructor() {
		super()
		this.sceneStep = GameStep.SelectWinner

		this.playersIcon = new PlayersIcon(this.handleOfClickWiner.bind(this))
		this.turnPickCard = new TurnPickCard()
		this.handCard = new HandCard()
	}

	handleOfClickWiner(userKey) {
		const userId = GameGlobal.databus.gameInfo[userKey].playerId
		cloud_pickWin(userId)
	}

	updateScene() {
		this.handCard.remove()
		this.turnPickCard.remove()
		if (this.needUpdate) {
			this.playersIcon.update()
			this.turnPickCard.update()

			const userKey = getUserKeyBySeat(Seat.Down)
			const cardIds = GameGlobal.databus.gameInfo[userKey].handCards
			const handCards = cardRanks(cardIds)
			this.handCard.update(handCards)
		}
	}

	renderScene(ctx) {
		this.playersIcon.render(ctx)
		this.turnPickCard.render(ctx)
		this.handCard.render(ctx)
	}

	handleOfSceneClick(x, y) {
		this.playersIcon.handleOfClick(x, y)
	}

	getTipStrs() {
		if (GameGlobal.databus && GameGlobal.databus.gameInfo) {
			const userId = GameGlobal.databus.gameInfo["focusPlayer"]
			const name = playerName(userId)
			const text2 = name + "选择"
			return [text2]
		}
		return [[]]
	}

}