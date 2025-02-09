/*
	换底选花色
*/

import {
	BottomCard_Top,
	Btn_Height,
	Btn_Width,
	Screen_Height,
	Screen_Width
} from "../common/Defines"
import {
	cardRanks,
	GameStep,
	isFocuseMy,
	makeImage,
	tipToast
} from "../common/util"
import { cloud_bottomAColor } from "../control/cloudFunc"
import BottomCards from "../View/bottomCards"
import Button from "../View/Button"
import HandCards from "../View/handCards"
import SelectColor from "../View/selectColor"
import Scene from "../View/session"

export default class SceneBottomAColor extends Scene {
	constructor() {
		super()

		this.image = makeImage("sceneBg_1")
		this.step = GameStep.SelecBottomAndColor
		this.stepLab.text = GameStep.SelecBottomAndColor

		this.handCard = new HandCards({
			selectBlock : this.handleOfClickHand
		})
		this.bottomCard = new BottomCards(false, this.handleOfClickBottom.bind(this))

		this.colorPicker = new SelectColor()

		const x = Screen_Width - 16 - Btn_Width
		const y = BottomCard_Top - 16 - Btn_Height
		this.confirmBtn = new Button(x, y, "确认埋底", this.handleOfClickConfirm.bind(this))

		this.waitImage = null
		this.updateSubItems()
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

	handleOfClickBottom(index) {
		if (!isFocuseMy()) return

		let bottomCardIds = this.bottomCard.getCardIds()
		const cardId = bottomCardIds[index]
		// 处理底牌
		bottomCardIds.splice(index, 1)
		this.bottomCard.config(bottomCardIds)
		// 处理手牌
		let handCardIds = this.handCard.getCardIds()
		handCardIds.push(cardId)
		handCardIds = cardRanks(handCardIds)
		this.handCard.config(handCardIds)
	}

	handleOfClickHand = cardIds => {
		if (!isFocuseMy()) return

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
		this.bottomCard.config(bottomCardIds)
		// 处理手牌
		const index = handCardIds.indexOf(clickCardId)
		handCardIds.splice(index, 1)
		this.handCard.config(handCardIds)
	}

	update() {
		if (isFocuseMy()) {
			this.waitImage = null
			this.confirmBtn.active = true
			this.bottomCard.active = true
			this.colorPicker.active = true
		} else {
			this.waitImage = makeImage("selectBottom")
			this.confirmBtn.active = false
			this.bottomCard.active = false
			this.colorPicker.active = false
		}
		this.updateSubItems()

		super.update()
	}

	render(ctx) {
		if (!this.active) return

		super.render(ctx)

		this.waitImage && ctx.drawImage(
			this.waitImage,
			Screen_Width / 2 - 100,
			Screen_Height / 2 - 200,
			200,
			200
		)
	}
}