/*
	出牌阶段
 */

import { BottomCard_Top, Btn_Height, Btn_Width, HandCard_Top, Screen_Width } from "../common/Defines";
import { cardRanks, GameStep, isFocuseMy, isMyLastPick, makeImage, PickError, tipToast } from "../common/util";
import { cloud_pickCard } from "../control/cloudFunc";
import { checkPickCard, compareWinner } from "../control/pickCardCheck";
import BottomCards from "../View/bottomCards";
import Button from "../View/Button";
import HandCards from "../View/handCards";
import PlayerDesk from "../View/playerDesk";
import TurnCards from "../View/seatCard";
import Scene from "../View/session";

 export default class ScenePickCards extends Scene {
	 constructor() {
		 super()

		 this.step = GameStep.PickCard
		 this.image = makeImage("sceneBg_1")
		 this.stepLab.text = GameStep.PickCard

		 this.handCard = new HandCards({})
		 this.bottomCard = new BottomCards(true, null)

		const x = 16
		const y = HandCard_Top - 16 - Btn_Height
		this.confirmBtn = new Button(x, y, "出牌", this.handleOfClickConfirm.bind(this))

		this.playerDesk = new PlayerDesk()

		this.turnPick = new TurnCards()

		this.updateSubItems()
	 }

	 // 确认出牌
	handleOfClickConfirm() {
		let cardIds = this.handCard.getSelectCardIds()
		if (cardIds.length == 0) return
		cardIds = cardRanks(cardIds)

		const error = checkPickCard(cardIds)
		if (error == PickError.Right) {
			if (isMyLastPick()) {
				const winner = compareWinner(cardIds)
				cloud_pickCard(cardIds, winner)
			} else {
				cloud_pickCard(cardIds, null)
			}
		} else if (error == PickError) {
			tipToast(error)
		}
	}

	update() {
		this.confirmBtn.active = isFocuseMy()

		super.update()
	}
 }