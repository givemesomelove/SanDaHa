/*
	选择本轮谁赢了
*/

import { Btn_Height, HandCard_Top } from "../common/Defines"
import { GameStep, getUserIdBySeat, isFocuseMy, makeImage, tipToast } from "../common/util"
import { cloud_pickWin } from "../control/cloudFunc"
import Button from "../View/Button"
import HandCards from "../View/handCards"
import PlayerDesk from "../View/playerDesk"
import TurnCards from "../View/seatCard"
import Scene from "../View/scene"

export default class SceneWinner extends Scene {
	constructor() {
		super()

		this.step = GameStep.SelectWinner
		this.image = makeImage("sceneBg_1")
		this.stepLab.text = GameStep.SelectWinner

		this.handCards = new HandCards({})
		this.playerDesk = new PlayerDesk()
		this.turnPick = new TurnCards()

		const x = 16
		
		const y = HandCard_Top - 16 - Btn_Height
		this.confirmBtn = new Button(x, y, "确定", this.handleOfClickConfirm.bind(this))

		this.updateSubItems()
	}

	 // 确认出牌
	 handleOfClickConfirm() {
		 const seat = this.playerDesk.getSelectSeat()
		 if (seat) {
			const userId = getUserIdBySeat(seat)
			cloud_pickWin(userId)
		 } else {
			tipToast("选择本轮赢家")
		 }
	}

	update() {
		this.confirmBtn.active = isFocuseMy()

		super.update()
	}

	render(ctx) {
        super.render(ctx)
    }
}