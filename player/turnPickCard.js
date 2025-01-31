/*
	展示本轮玩家出牌
*/

import { createCard } from "../common/card";
import { BottomCard_Top, Card_Height, HeadHeight, LeftCard_Top, MyCard_Top, MyHead_Top, Name_CenterY, RightCard_Top, RightHead_Top, Screen_Height, Screen_Width, TopCard_Top } from "../Defines";
import { createLineCard } from "./lineCard";
import SectionCard from "./lineCard1";

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
		if (!GameGlobal.databus || !GameGlobal.databus.gameInfo) return

		const downCardIds = databus.gameInfo[databus.userKey].turnCards
		this.bottomCards.update(downCardIds)

		const leftCardIds = databus.gameInfo[databus.leftKey].turnCards
		this.leftCards.update(leftCardIds)

		const topCardIds = databus.gameInfo[databus.upKey].turnCards
		this.topCards.update(topCardIds)

		const rightCardIds = databus.gameInfo[databus.rightKey].turnCards
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