import {
	Btn_Height,
	Btn_M_Height,
	Btn_M_Wdith,
	Btn_Width,
	menuFrame,
	Screen_Height,
	Screen_Width
} from "../common/Defines"
import { getCurTurnCount } from "../common/util"
import Button from "./Button"
import Label from "./label"
import MiniButton from "./miniButton"
import Modal from "./Modal"
import TurnCards from "./seatCard"


export default class SceneHistory extends Modal {
	constructor() {
		super()
		this.btns = this.initBtns()
		this.turnPick = new TurnCards()

		this.updateSubItems()
	}

	initBtns = () => {
		const btns = []
		const y = Screen_Height - 34 - Btn_M_Height - 16
		
		const lastBtn = new MiniButton(16, y, "<", this.handleOfClickLast)
		btns.push(lastBtn)
		
		const nextBtn = new MiniButton(
			Screen_Width - 16 - Btn_M_Wdith,
			y,
			">",
			this.handleOfClickNext
		)
		btns.push(nextBtn)

		this.titleBtn = new Button(
			(Screen_Width - Btn_Width) / 2,
			y - Btn_Height,
			"",
			null
		)

		return btns
	}

	handleOfClickLast = () => {
		if (this.curTurns > 1) {
			this.curTurns --
			this.titleBtn.text = `第${this.curTurns}轮`
			this.turnPick.config(this.curTurns-1)
		}
	}

	handleOfClickNext = () => {
		if (this.curTurns < this.maxTurns) {
			this.curTurns ++
			this.titleBtn.text = `第${this.curTurns}轮`
			this.turnPick.config(this.curTurns-1)
		}
	}

	setActive(dismissBlock) {
		super.setActive(dismissBlock)

		this.maxTurns = getCurTurnCount()
		this.curTurns = getCurTurnCount()
		this.titleBtn.text = `第${this.curTurns}轮`
		this.turnPick.config(this.curTurns-1)
	}
}