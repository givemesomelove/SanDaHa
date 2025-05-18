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
	bigHeadImgById,
	cardRanks,
	GameStep,
	headImageById,
	isEnemyMy,
	isFocuseMy,
	makeImage,
	tipToast
} from "../common/util"
import { cloud_AdmitDefeat, cloud_bottomAColor, cloud_SelectColor } from "../control/cloudFunc"
import BottomCards from "../View/bottomCards"
import Button from "../View/Button"
import HandCards from "../View/handCards"
import SelectColor from "../View/selectColor"
import Scene from "../View/scene"
import { getAdmitDefeatScore } from "../control/pickCardCheck"

export default class SceneBottomAColor extends Scene {
	constructor() {
		super()

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
        this.defeatBtn = new Button(x - 8 - Btn_Width, y, "扔牌", this.handleOfClickDefeat.bind(this)) 

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
    
    handleOfClickDefeat = () => {
        wx.showModal({
          title: '确认扔牌吗？',
          complete: (res) => {
            if (res.confirm) {
                const score = getAdmitDefeatScore()
                cloud_AdmitDefeat(score)
            }
          }
        })
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
            this.confirmBtn.active = true
            this.defeatBtn.active = true
			this.bottomCard.active = true
            this.colorPicker.active = true
		} else {
            this.confirmBtn.active = false
            this.defeatBtn.active = false
			this.bottomCard.active = false
			this.colorPicker.active = false
		}
		if (isEnemyMy() || !GameGlobal.databus.gameInfo) {
			this.waitImage = null
		} else {
			const enemy = GameGlobal.databus.gameInfo.enemyPlayer
			this.waitImage = bigHeadImgById(enemy)
		}

		this.updateSubItems()

		super.update()
	}

	render(ctx) {
		if (!this.active) return

		super.render(ctx)

		this.waitImage && ctx.drawImage(
			this.waitImage,
			Screen_Width / 2 - 170 / 2,
			Screen_Height / 2 - 96,
			170,
			96
		)
	}
}