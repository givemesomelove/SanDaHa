/*
	看底牌的模态弹窗
*/

import { Card_Height, TurnShow_Bottom } from "../common/Defines";
import LineCard from "./lineCard";
import Modal from "./Modal";

export default class SceneBottom extends Modal {
	constructor() {
		super()

		this.endBottomCard = new LineCard('center', 16, TurnShow_Bottom - Card_Height - 16, null)

		this.updateSubItems()
	}

	update() {
		const game = GameGlobal.databus.gameInfo
		if (!game) return

		const endBottom = GameGlobal.databus.gameInfo.bottomEndCards
		this.endBottomCard.config(endBottom)

		super.update()
	}

	render(ctx) {
		super.render(ctx)
	}
}