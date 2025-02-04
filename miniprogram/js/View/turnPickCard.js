/*
	展示本轮玩家出牌
*/

import { createCard } from "./card";
import { BottomCard_Top, Card_Height, HeadHeight, LeftCard_Top, MyCard_Top, MyHead_Top, Name_CenterY, RightCard_Top, RightHead_Top, TopCard_Top } from "../common/Defines";
import SectionCard from "./lineCard1";
import { getUserKeyBySeat, Seat } from "../common/util";

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

		const downKeys = getUserKeyBySeat(Seat.Down)
		const downCardIds = databus.gameInfo[downKeys].turnCards
		this.bottomCards.update(downCardIds)
		
		const leftKeys = getUserKeyBySeat(Seat.Left)
		const leftCardIds = databus.gameInfo[leftKeys].turnCards
		this.leftCards.update(leftCardIds)

		const topKeys = getUserKeyBySeat(Seat.Up)
		const topCardIds = databus.gameInfo[topKeys].turnCards
		this.topCards.update(topCardIds)

		const rightKeys = getUserKeyBySeat(Seat.Right)
		const rightCardIds = databus.gameInfo[rightKeys].turnCards
		this.rightCards.update(rightCardIds)
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