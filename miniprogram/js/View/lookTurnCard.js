/*
	查看历史出牌
*/

import { Btn_Height, Btn_Width } from "../common/Defines";
import { getCurTurnCount } from "../common/util";
import { createBtn } from "./btn";
import Button from "./Button";
import ModalBg from "./modalBg";
import TurnPickCard from "./turnPickCard";

const Screen_Width = GameGlobal.canvas.width
const Screen_Height = GameGlobal.canvas.height

export default class LookTurnCard extends ModalBg {
	constructor() {
		super()

		this.turnCards = new TurnPickCard()

		const y = Screen_Height - 34 - Btn_Height
		this.lastBtn = new Button(16, y, "上一轮", this.handleOfClickLast.bind(this))
		this.btns.push(this.lastBtn)
		this.nextBtn = new Button(Screen_Width - Btn_Width - 16, y, "下一轮", this.handleOfClickNext.bind(this))
		this.btns.push(this.nextBtn)
	}
	
	handleOfClickLast() {
		this.curTurn = this.curTurn == 0 ? 0 : this.curTurn - 1
		this.turnCards.updateTurn(this.curTurn)
	}

	handleOfClickNext() {
		this.curTurn = this.curTurn >= this.maxTurns ? this.curTurn : this.curTurn + 1
		this.turnCards.updateTurn(this.curTurn)
	}

	setActive(active) {
		super.setActive(active)
		
		this.lastBtn.setActive(active)
		this.nextBtn.setActive(active)
		if (active) {
			this.maxTurns = getCurTurnCount() 
			this.curTurn = getCurTurnCount()
			this.turnCards.updateTurn(this.curTurn)	
		}
	}
	
	render(ctx) {
		super.render(ctx)

		this.turnCards.render(ctx)
		this.lastBtn.render(ctx)
		this.nextBtn.render(ctx)
	}

	
}