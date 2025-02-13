/*
	出牌阶段
 */

import { BottomCard_Top, Btn_Height, Btn_Width, Card_Height, Card_Width, HandCard_Top, Screen_Width, TurnShow_Bottom } from "../common/Defines";
import { cardRanks, GameStep, getCurTurnCount, getMyHandCard, getPlayInfoBySeat, isEnemyMy, isFocuseMy, isMyLastPick, makeImage, PickError, Seat, tipToast } from "../common/util";
import { cloud_pickCard } from "../control/cloudFunc";
import { checkPickCard, compareWinner } from "../control/pickCardCheck";
import BottomCards from "../View/bottomCards";
import Button from "../View/Button";
import HandCards from "../View/handCards";
import PlayerDesk from "../View/playerDesk";
import TurnCards from "../View/seatCard";
import Scene from "../View/scene";
import MiniButton from "../View/miniButton";
import Item from "../View/item";

class BgCard extends Item {
    constructor(x, y, selectBlock) {
        super()
        this.x = x
		this.y = y
		
        this.width = Card_Width
        this.height = Card_Height
        this.image = makeImage('card_bg')
        this.selectBlock = selectBlock
		this.active = true
		this.enable = true
    }
}

 export default class ScenePickCards extends Scene {
	 constructor() {
		 super()

		 this.step = GameStep.PickCard
		 this.stepLab.text = GameStep.PickCard

		 this.handCard = new HandCards({})
		 {
			const x = Screen_Width - 16 - Card_Width
			this.bgCard = new BgCard(x, BottomCard_Top, this.handleOfClickBgCard.bind(this))
		 }

		this.stopBtn = new Button(
            Screen_Width / 2 - Btn_Width / 2,
            TurnShow_Bottom + 16,
            "出牌",
            this.handleOfClickConfirm.bind(this)
        )

		this.playerDesk = new PlayerDesk()

		this.turnPick = new TurnCards()

		this.updateSubItems()
	 }

	 handleOfClickBgCard() {
		GameGlobal.bottomPage.setActive(this.handleOfModalBgDismiss)
        this.enable = false
	}

	 // 确认出牌
	handleOfClickConfirm() {
		let cardIds = this.handCard.getSelectCardIds()
		this.handleOfPickCards(cardIds)
	}

	handleOfPickCards = items => {
		let cardIds = items
		if (cardIds.length == 0) return
		cardIds = cardRanks(cardIds)

		const error = checkPickCard(cardIds)
		if (error == PickError.Right) {
			if (isMyLastPick()) {
				const result = compareWinner(cardIds)
				cloud_pickCard(cardIds, result[0], result[1])
			} else {
                cloud_pickCard(cardIds, null, 0)
			}
		} else if (error == PickError.MutiPick) {
            // 有惩罚的甩牌错误
            tipToast(error)
            const cards = GameGlobal.pickErrorSplit
            cloud_pickCard(cards, null, 0)
		} else {
            tipToast(error)
        }
	}

	// 最后一轮出牌，直接出，不用选
	checkIfLastPick = () => {
		const game = GameGlobal.databus.gameInfo
		if (!game) return
		const leftHand = getPlayInfoBySeat(Seat.Left)
		const myHand = getMyHandCard()
		if (leftHand.handCards.length == 0 && myHand.length > 0) {
			setTimeout(() => this.handleOfPickCards(myHand), 500)
		} 
	}

	update() {
        this.stopBtn.active = isFocuseMy()
		const curTurn = getCurTurnCount()
		this.stepLab.text = GameStep.PickCard+`(${curTurn})`
		this.bgCard.active = isEnemyMy()

		this.checkIfLastPick()

		super.update()

	}
 }