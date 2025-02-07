/*
	展示本轮玩家出牌
*/

import { createCard } from "./card";
import { BottomCard_Top, Card_Height, HeadHeight, LeftCard_Top, MyCard_Top, MyHead_Top, Name_CenterY, RightCard_Top, RightHead_Top, TopCard_Top } from "../common/Defines";
import SectionCard from "./lineCard1";
import { getHandCardBySeat, getUserKeyBySeat, Seat } from "../common/util";

export default class TurnPickCard {
	constructor() {
		this.leftCards = new SectionCard(
			'left',
			16 + HeadHeight + 8,
			LeftCard_Top,
			null
		)

		this.topCards = new SectionCard(
			'center',
			0,
			TopCard_Top,
			null
		)

		this.rightCards = new SectionCard(
			'right',
			16 + HeadHeight + 8,
			RightCard_Top,
			null
		)

		this.bottomCards = new SectionCard(
			'center',
			0,
			MyCard_Top,
			null
		)
	}

	// index为当前出牌轮次
	update() {
		if (!GameGlobal.databus.gameInfo) return

		const gameInfo = GameGlobal.databus.gameInfo

		const downKeys = getUserKeyBySeat(Seat.Down)
		const downCardIds = gameInfo[downKeys].turnCards
		this.bottomCards.update(downCardIds)
		
		const leftKeys = getUserKeyBySeat(Seat.Left)
		const leftCardIds = gameInfo[leftKeys].turnCards
		this.leftCards.update(leftCardIds)

		const topKeys = getUserKeyBySeat(Seat.Up)
		const topCardIds = gameInfo[topKeys].turnCards
		this.topCards.update(topCardIds)

		const rightKeys = getUserKeyBySeat(Seat.Right)
		const rightCardIds = gameInfo[rightKeys].turnCards
		this.rightCards.update(rightCardIds)
	}

	updateTurn(index) {
		if (!GameGlobal.databus.gameInfo) return

		const bottomHand = getHandCardBySeat(Seat.Down, index)
		this.bottomCards.update(bottomHand)

		const leftHand = getHandCardBySeat(Seat.Left, index)
		this.leftCards.update(leftHand)

		const topHand = getHandCardBySeat(Seat.Up, index)
		this.topCards.update(topHand)

		const rightHand = getHandCardBySeat(Seat.Right, index)
		this.rightCards.update(rightHand)
	}

	render(ctx) {
		this.bottomCards.render(ctx)
		this.leftCards.render(ctx)
		this.topCards.render(ctx)
		this.rightCards.render(ctx)
	}

	remove() {
		this.topCards.remove()
		this.leftCards.remove()
		this.rightCards.remove()
		this.bottomCards.remove()
	}
}