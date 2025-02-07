/*
	庄家埋底选主
*/

const Screen_Width = GameGlobal.canvas.width
const Screen_Height = GameGlobal.canvas.height

import {
	cloud_bottomAColor
} from "../control/cloudFunc";
import {
	createBtn
} from "../View/btn";
import Scene from "./scene";
import {
	BottomCard_Top,
	Btn_Height,
	Btn_M_Height,
	Btn_Width,
} from "../common/Defines";
import BottomCard from "../View/bottomCard";
import HandCard from "../View/handCard";
import {
	cardRanks,
	drawBg,
	GameStep,
	getCurStep,
	getUserKeyBySeat,
	isFocuseMy,
	makeImage,
	playerName,
	Seat,
	showLoading,
	tipToast
} from "../common/util";
import SelectColor from "../View/selectColor";

export default class SceneBottomAColor extends Scene {
	constructor() {
		super()
		this.sceneStep = GameStep.SelecBottomAndColor

		this.handCard = new HandCard(this.handleOfClickHand.bind(this))

		this.bottomCard = new BottomCard(false, this.handleOfClickBottom.bind(this))
		this.confirmBtn = null
		this.colorPicker = new SelectColor()
		this.waitImage = null
	}

	handleOfClickConfirm() {
		this.confirmBtn.select = false
		// 判断是否选了主色
		const color = this.colorPicker.getCurSelectColor()
		if (!color) {
			tipToast('没有选主色')
			return
		}
		// 判断底牌是不是八张
		const cardIds = this.bottomCard.getCardIds()
		if (cardIds.length != 8) {
			tipToast('没有埋底')
			return
		}
		cloud_bottomAColor(color, cardIds)
	}

	handleOfClickBottom(cardId) {
		if (!this.isFocuse) return

		let bottomCardIds = this.bottomCard.getCardIds()
		const index = bottomCardIds.indexOf(cardId)
		// 处理底牌
		bottomCardIds.splice(index, 1)
		this.bottomCard.update(bottomCardIds)
		// 处理手牌
		let handCardIds = this.handCard.getCardIds()
		handCardIds.push(cardId)
		handCardIds = cardRanks(handCardIds)
		this.handCard.update(handCardIds)
	}

	handleOfClickHand(cardIds) {
		if (!this.isFocuse) return

		let handCardIds = this.handCard.getCardIds()
		const clickCardId = cardIds[0]
		// 处理底牌
		let bottomCardIds = this.bottomCard.getCardIds()
		if (bottomCardIds.length >= 8) {
			wx.showToast({
				title: '超了超了'
			})
			return
		}
		bottomCardIds.push(clickCardId)
		bottomCardIds = cardRanks(bottomCardIds)
		this.bottomCard.update(bottomCardIds)
		// 处理手牌
		const index = handCardIds.indexOf(clickCardId)
		handCardIds.splice(index, 1)
		this.handCard.update(handCardIds)
	}

	updateScene() {
		this.handCard.remove()
		this.bottomCard.remove()

		if (this.needUpdate) {
			const userKey = getUserKeyBySeat(Seat.Down)
			const cardIds = GameGlobal.databus.gameInfo[userKey].handCards
			const handCards = cardRanks(cardIds)
			this.handCard.update(handCards)

			if (this.isFocuse) {
				this.waitImage = null
				this.colorPicker.display(true)

				const x = Screen_Width - Btn_Width - 16
				const y = BottomCard_Top - 16 - Btn_Height
				this.confirmBtn = createBtn(x, y, "确认埋底", this.handleOfClickConfirm.bind(this))

				const bottomCard = GameGlobal.databus.gameInfo.bottomStartCards
				this.bottomCard.update(bottomCard)
			} else {
				this.waitImage = makeImage("selectBottom")
				this.colorPicker.display(false)
				this.confirmBtn = null
				this.bottomCard.update([])
			}
		}
	}

	renderScene(ctx) {
		this.handCard.render(ctx)
		this.bottomCard.render(ctx)
		this.confirmBtn && this.confirmBtn.render(ctx)
		this.colorPicker.render(ctx)

		if (this.waitImage) {
			const width = 200
			const x = Screen_Width / 2 - width / 2
			const y = Screen_Height / 2 - width
			ctx.drawImage(this.waitImage, x, y, width, width)
		}
	}

	handleOfSceneClick(x, y) {
		this.bottomCard.handleOfClick(x, y)
		this.handCard.handleOfClick(x, y)
		this.confirmBtn && this.confirmBtn.handleOfClick(x, y)
	}

	getTipStrs() {
		if (GameGlobal.databus && GameGlobal.databus.gameInfo) {
			const userId = GameGlobal.databus.gameInfo["focusPlayer"]
			const name = playerName(userId)
			const text2 = "庄家是" + name
			return [text2]
		}
		return [
			[]
		]
	}
}