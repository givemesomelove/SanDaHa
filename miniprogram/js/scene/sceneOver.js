/*
	游戏结束,结算页面
*/

import {
	Card_Height,
	TurnShow_Top
} from "../common/Defines"
import {
	cardRankNext,
	GameStep,
	makeImage
} from "../common/util"
import BigIcon from "../View/bigIcon"
import HandCards from "../View/handCards"
import LineCard from "../View/lineCard"
import PlayerDesk from "../View/playerDesk"
import PlayerEnd from "../View/playerEnd"
import TurnCards from "../View/seatCard"
import Scene from "../View/scene"

export default class SceneEnd extends Scene {
	constructor() {
		super()

		this.step = GameStep.End
		this.image = makeImage("sceneBg_1")
		this.stepLab.text = GameStep.End
		// 当前底牌
		this.endBottomCard = new LineCard('center', 16, TurnShow_Top, null)
		// 起始底牌
		this.startBottomCard = new LineCard('center', 16, TurnShow_Top + Card_Height + 16, null)

		this.icons = new PlayerEnd()
		this.handCard = new HandCards({
			isShowAll: true
		})

		this.updateSubItems()
	}

	update() {
		const game = GameGlobal.databus.gameInfo
		if (!game) return

		const endBottom = GameGlobal.databus.gameInfo.bottomEndCards
		this.endBottomCard.config(endBottom)

		const startBottom = GameGlobal.databus.gameInfo.bottomStartCards
		this.startBottomCard.config(startBottom)

		super.update()
	}


}