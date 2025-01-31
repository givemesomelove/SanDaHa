/*
	游戏结束
*/

import Scene from "../common/scene";
import BottomCard from "../player/bottomCard";
import PlayersIcon from "../player/playerIcon";
import TurnPickCard from "../player/turnPickCard";
import { GameStep, playerName } from "../util";

export default class SceneEnd extends Scene {
	constructor() {
		super()
		this.sceneStep = GameStep.End

		this.playersIcon = new PlayersIcon()
		this.bottomCard = new BottomCard()
		this.turnPickCard = new TurnPickCard()
	}

	updateScene() {
		this.bottomCard.remove()
		this.turnPickCard.remove()
		if (this.needUpdate) {
			this.playersIcon.update()
			this.turnPickCard.update()

			const bottomCard = GameGlobal.databus.gameInfo.bottomEndCards
			this.bottomCard.update(bottomCard)
		}
	}

	renderScene(ctx) {
		this.playersIcon.render(ctx)
		this.turnPickCard.render(ctx)
		this.bottomCard.render(ctx)
	}

	getTipStrs() {
		if (GameGlobal.databus && GameGlobal.databus.gameInfo) {
			const text1 = "游戏阶段：游戏结束"
			const userId = GameGlobal.databus.gameInfo["focusPlayer"]
			return [text1]
		}
		return [[]]
	}
}