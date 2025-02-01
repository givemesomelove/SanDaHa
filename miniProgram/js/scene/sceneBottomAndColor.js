/*
	庄家埋底选主
*/

import { cloud_bottomAColor } from "../cloudFunc";
import { createBtn } from "../common/btn";
import Scene from "../common/scene";
import {
  BottomCard_Top,
	Btn_M_Height,
	Btn_Width,
	Scene_Start_Bg_Icon,
	Screen_Height,
	Screen_Width
} from "../Defines";
import BottomCard from "../player/bottomCard";
import ColorPicker from "../player/colorPicker";
import HandCard from "../player/handCard";
import PlayersIcon from "../player/playerIcon";
import {
	cardRanks,
	drawBg,
	GameStep,
	getCurStep,
	playerName
} from "../util";

export default class SceneBottomAColor extends Scene {
	constructor() {
		super()
		this.sceneStep = GameStep.SelecBottomAndColor

		this.playersIcon = new PlayersIcon()
		this.handCard = new HandCard(this.handleOfClickHand.bind(this))
		this.colorSelect = new ColorPicker(BottomCard_Top - Btn_M_Height - 5)
		this.bottomCard = new BottomCard(false, this.handleOfClickBottom.bind(this))

		const x = Screen_Width / 2 - Btn_Width / 2
		const y = 200
		this.confirmBtn = createBtn(x, y, "确认埋底", this.handleOfClickConfirm.bind(this))
	}

	handleOfClickConfirm() {
		this.confirmBtn.select = false
		// 判断是否选了主色
		const color = this.colorSelect.getCurColor()
		if (color <= 0) {
			wx.showToast({ title: '没有选主色'})
			return
		}
		// 判断底牌是不是八张
		const cardIds = this.bottomCard.getCardIds()
		if (cardIds.length != 8) {
			wx.showToast({ title: '底牌没有埋好'})
			return
		}
		cloud_bottomAColor(color, cardIds)
	}

	handleOfClickBottom(index) {
		let bottomCardIds = this.bottomCard.getCardIds()
		const clickCardId = bottomCardIds[index]
		// 处理底牌
		bottomCardIds.splice(index, 1)
		this.bottomCard.update(bottomCardIds)
		// 处理手牌
		let handCardIds = this.handCard.getCardIds()
		handCardIds.push(clickCardId)
		handCardIds = cardRanks(handCardIds)
		this.handCard.update(handCardIds)
	}

	handleOfClickHand(index) {
		let handCardIds = this.handCard.getCardIds()
		const clickCardId = handCardIds[index]
		// 处理底牌
		let bottomCardIds = this.bottomCard.getCardIds()
		if (bottomCardIds.length >= 8) {
			wx.showToast({ title: '超了超了'})
			return
		}
		bottomCardIds.push(clickCardId)
		bottomCardIds = cardRanks(bottomCardIds)
		this.bottomCard.update(bottomCardIds)
		// 处理手牌
		handCardIds.splice(index, 1)
		this.handCard.update(handCardIds)
		
	}

	updateScene() {
		this.handCard.remove()
		this.colorSelect.remove()
		this.bottomCard.remove()

		if (this.needUpdate) {
			this.playersIcon.update()
			this.handCard.update(GameGlobal.databus.handCards)
			const y = BottomCard_Top - Btn_M_Height - 2
			this.colorSelect.update(y)

			const bottomCard = GameGlobal.databus.gameInfo.bottomStartCards
			this.bottomCard.update(bottomCard)
		}
	}

	renderScene(ctx) {
		this.playersIcon.render(ctx)
		this.handCard.render(ctx)
		this.colorSelect.render(ctx)
		this.bottomCard.render(ctx)
		this.confirmBtn.render(ctx)
	}

	handleOfSceneClick(x, y) {
		this.colorSelect.handleOfClick(x, y)
		this.bottomCard.handleOfClick(x, y)
		this.handCard.handleOfClick(x, y)
		this.confirmBtn.handleOfClick(x, y)
	}

	getTipStrs() {
		if (GameGlobal.databus && GameGlobal.databus.gameInfo) {
			const text1 = "游戏阶段：埋底和选主色"
			const userId = GameGlobal.databus.gameInfo["focusPlayer"]
			const name = playerName(userId)
			const text2 = "庄家是" + name
			return [text1, text2]
		}
		return [
			[]
		]
	}
}