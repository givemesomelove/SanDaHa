/*
	游戏结束,结算页面
*/

import {
	Btn_Height,
	Btn_Width,
	Card_Height,
	HandCard_Top,
	Screen_Height,
	Screen_Width,
	TurnShow_Bottom,
	TurnShow_Top
} from "../common/Defines"
import {
	cardRankNext,
	GameStep,
	isGMMy,
	isPlayerWin,
	makeImage
} from "../common/util"
import BigIcon from "../View/bigIcon"
import HandCards from "../View/handCards"
import LineCard from "../View/lineCard"
import PlayerDesk from "../View/playerDesk"
import PlayerEnd from "../View/playerEnd"
import TurnCards from "../View/seatCard"
import Scene from "../View/scene"
import Label from "../View/label"
import { getGameOutGrade } from "../control/pickCardCheck"
import Button from "../View/Button"
import { cloud_nextGame } from "../control/cloudFunc"
import Item from "../View/item"
import PlayerResult from "../View/playerResult"

const bottomCard_bottom = TurnShow_Top + Card_Height * 2 + 16

class BackGround extends Item {
	constructor() {
		super()

		this.x = 0
		this.y = 0
		this.width = Screen_Width
		this.height = Screen_Height
		this.bgColor = "rgba(0, 0, 0, 0.7)"
		this.active = true
	}
}

class OutComeGrade extends Item {
	constructor() {
		super()

		this.x = 0
		this.y = bottomCard_bottom +8
		this.width = Screen_Width 
		this.height = 66

		this.image = null
		this.active = true
	}

	update() {
		const image = getGameOutGrade()
		this.image = makeImage(image)

		super.update()
	}
}

class CenterBg extends Item {
	constructor () {
		super()

		this.x = 0
		this.y = bottomCard_bottom + 16
		this.width = Screen_Width 
		this.height = HandCard_Top - this.y - 16
		this.image = makeImage("centerBg")
		this.active = true
	}
}

export default class SceneEnd extends Scene {
	constructor() {
		super()

		this.step = GameStep.End
		this.stepLab.text = GameStep.End
		// 当前底牌
		this.endBottomCard = new LineCard('center', 16, TurnShow_Top, null)
		// 起始底牌
		this.startBottomCard = new LineCard('center', 16, TurnShow_Top + Card_Height + 16, null)

		this.icons = new PlayerEnd()

		this.handCard = new HandCards({
			isShowAll: true
		})

		this.backGround = new BackGround()

		this.CenterBg = new CenterBg()

		this.grade = new OutComeGrade() 

		this.playerItems = this.initPlayerItem()

		this.nextBtn = new Button(
            Screen_Width - Btn_Width - 32,
            Screen_Height - 34 - Btn_Height,
            "下一局",
            this.handleOfNextGame.bind(this)
        )

		this.updateSubItems()
	}

	initPlayerItem = () => {
		const items = []
		for (let i = 0; i < 4; i ++) {
			const item = new PlayerResult(i)
			items.push(item)
		}
		return items
	}

	handleOfNextGame = () => {
		const turnPlayers = this.getNextGameTurnPlayers()
		cloud_nextGame(turnPlayers)
	}

	getNextGameTurnPlayers = () => {
		const nextPlayer = (playerId, players) => {
			let index = players.findIndex(item => playerId == item)
			index = index == 3 ? 0 : index + 1
			return players[index]
		} 

		const players = GameGlobal.databus.gameInfo.turnPlayers
		const enemy = GameGlobal.databus.gameInfo.enemyPlayer
		const winner = isPlayerWin(enemy) ? enemy : nextPlayer(enemy, players)
		let res = [winner]
		for (let i = 0; i < 3; i ++) {
			const last = res[res.length - 1]
			const next = nextPlayer(last, players)
			res.push(next)
		}
		return res
	}

	update() {
		const game = GameGlobal.databus.gameInfo
		if (!game) {
			super.update()
			return
		}

		const endBottom = GameGlobal.databus.gameInfo.bottomEndCards
		this.endBottomCard.config(endBottom)

		const startBottom = GameGlobal.databus.gameInfo.bottomStartCards
		this.startBottomCard.config(startBottom)

		this.nextBtn.active = isGMMy()

		super.update()
	}


}