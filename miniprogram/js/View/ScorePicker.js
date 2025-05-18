/*
    叫分
*/

import {
	Btn_Height,
	Btn_M_Height,
	Btn_M_Wdith,
	Btn_Width,
	HeadHeight,
	menuFrame,
	Screen_Width
} from "../common/Defines";
import {
	bigHeadImgById,
	curMaxCallScore,
	headImageBySeat,
	isFocuseMy,
	isUserCallScore,
	makeImage,
	headImageById,
	getMyHandCard,
	tipToast
} from "../common/util";
import {
	cloud_callScore
} from "../control/cloudFunc";
import Button from "./Button";
import Item from "./item";
import MiniButton from "./miniButton";

const Item_Width = 75

const Head_Width = 82
const Head_Height = 46

class HeadImage extends Item {
	constructor(index, y) {
		super()
		this.index = index

		this.x = Screen_Width / 2 + Head_Width * (index - 2)
		this.y = y
		this.width = Head_Width
		this.height = Head_Height
		this.image = null
		this.showMask = false
		this.active = true
		this.playerIcon = null
	}

	update() {
		const player = GameGlobal.databus.gameInfo.turnPlayers[this.index]
		this.image = bigHeadImgById(player)
		this.showMask = !isUserCallScore(player)
		const fouse = GameGlobal.databus.gameInfo.focusPlayer == player
		this.showBorder = fouse
		this.playerIcon = headImageById(player)
		super.update()
	}

	render(ctx) {
		if (!this.active) return

		super.render(ctx)

		if (this.playerIcon) {
			const x = this.x + this.width - 20
			const y = this.y + this.height - 20
			ctx.drawImage(this.playerIcon, x, y, 20, 20)
		}
	}
}

class Score extends Item {
	constructor(index, y) {
		super()

		this.height = Item_Width
		this.width = Item_Width
		this.index = index
		this.num = 80 - index * 5
		this.x = Screen_Width / 2 + (index % 4 - 2) * this.width
		this.y = y + Math.floor(index / 4) * this.width
		this.image = makeImage("score1")
		this.text = `${this.num}`
		this.textColor = 'white'
		this.font = 32
		this.active = true
		this.enable = true
		this.playerIcon = null
		this.showMask = false
		this.selectBlock = this.handleOfClickScore.bind(this)
	}

	update() {
		const cur = curMaxCallScore()
		if (cur) {
			const score = cur[0]
			const userId = cur[1]
			const curIndex = (80 - score) / 5
			if (this.index == curIndex) {
				this.playerIcon = headImageById(userId)
				this.showMask = false
				this.enable = false
			} else if (curIndex < this.index) {
				this.playerIcon = null
				this.showMask = false
				this.enable = isFocuseMy()
			} else {
				this.playerIcon = null
				this.showMask = true
				this.enable = false
			}
		} else {
			this.playerIcon = null
			this.showMask = false
			this.enable = true
		}

		super.update()
	}

	handleOfClickScore() {
		cloud_callScore(GameGlobal.databus.userId, this.num)
	}

	render(ctx) {
		if (!this.active) return

		super.render(ctx)

		if (this.playerIcon) {
			const x = this.x + this.width - 30
			const y = this.y + this.height - 30
			ctx.drawImage(this.playerIcon, x, y, 30, 30)
		}
	}
}

export default class ScorePicker extends Item {
	constructor() {
		super()

		this.x = 0
		this.y = menuFrame.bottom + 16
		this.width = Screen_Width
		this.height = Head_Height + 8 + Item_Width * 4 + 16 + Btn_Height

		this.headImgs = this.initHeadImage()
		this.scoreBtns = this.initScoreBtn()
		this.stopBtn = new Button(
			Screen_Width / 2 - Btn_Width / 2,
			this.y + this.height - Btn_Height,
			"不要了",
			this.handleOfClickStop.bind(this)
		)
		this.active = true
		this.enable = true

		this.updateSubItems()
	}

	initHeadImage() {
		const items = []
		for (let i = 0; i < 4; i++) {
			const item = new HeadImage(i, this.y)
			items.push(item)
		}
		return items
	}

	initScoreBtn() {
		const btns = []
		const y = this.y + Head_Height + 8
		for (let i = 0; i < 16; i++) {
			const btn = new Score(i, y)
			btns.push(btn)
		}
		return btns
	}

	update() {
		this.stopBtn.active = isFocuseMy()

		super.update()
	}

	// 点击不要了
	handleOfClickStop() {
		if (!isFocuseMy()) return

		if (!this.checkIfMustCall55()) {
			tipToast("想跑？必须喊！")
			return
		}

		const userId = GameGlobal.databus.userId
		cloud_callScore(userId, 0)
	}

	// 7激动必须喊55分的逻辑
	checkIfMustCall55 = () => {
		// 获取牌堆激动数
		const getEverMainCards = cardIds => {
			const ranks = GameGlobal.databus.ranks
			const res = []
			for (const card of cardIds) {
				const index = ranks.indexOf(card);
				if (index < 10) {
					res.push(card)
				}
			}
			return res
		}

		const cur = curMaxCallScore()
		if (cur && cur[0] <= 55) return true

		const myHandCard = getMyHandCard()
		const everMainCards = getEverMainCards(myHandCard)
		if (everMainCards.length < 7) return true

		return false
	}
}