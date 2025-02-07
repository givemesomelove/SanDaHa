/*
    叫分选庄的场景
*/

import { cardRanks, GameStep, getUserKeyBySeat, playerName, Seat } from "../common/util"
import { cloud_callScore } from "../control/cloudFunc"
import CallScore from "../View/callScore"
import HandCard from "../View/handCard"
import Scene from "./scene"

export default class SceneCallScore extends Scene {
	constructor() {
		super()
		this.sceneStep = GameStep.CallScore

		this.handCard = new HandCard()
		this.callScore = new CallScore()
	}

	updateScene() {
    	this.handCard.remove()
      
		if (this.needUpdate) {
			const userKey = getUserKeyBySeat(Seat.Down)
			const cardIds = GameGlobal.databus.gameInfo[userKey].handCards
			const handCards = cardRanks(cardIds)
			this.handCard.update(handCards)
			this.callScore.update()
		}
	}

	renderScene(ctx) {
		this.handCard.render(ctx)
		this.callScore.render(ctx)
	}

	handleOfSceneClick(x, y) {
        this.callScore.handleOfClick(x, y)
	}

	getTipStrs() {
		if (GameGlobal.databus && GameGlobal.databus.gameInfo) {
			const userId = GameGlobal.databus.gameInfo.focusPlayer
			const name = playerName(userId)
			const text2 = "从" + name + "开始叫分"
			return [text2]
		}
		return [[]]
	}
}