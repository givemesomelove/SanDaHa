/*
    叫分
*/

import { Btn_Height, Btn_M_Height, Btn_M_Wdith, Btn_Width, menuFrame, Screen_Width } from "../common/Defines";
import { bigHeadImgById, curMaxCallScore, headImageBySeat, isFocuseMy, isUserCallScore, makeImage, headImageById } from "../common/util";
import { cloud_callScore } from "../control/cloudFunc";
import Button from "./Button";
import Item from "./item";
import MiniButton from "./miniButton";

const Item_Width = 75

class HeadImage extends Item {
    constructor(index, y) {
        super()
        this.index = index

        this.x = Screen_Width / 2 + Item_Width * (index - 2)
        this.y = y
        this.width = Item_Width
        this.height = Item_Width
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
			const x = this.x + this.width - 30
			const y = this.y + this.height - 30
			ctx.drawImage(this.playerIcon, x, y, 30, 30)
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
        this.image = makeImage("score")
        this.text = `${this.num}`
        this.textColor = 'white'
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
        this.height = Item_Width + 8 + Item_Width * 4 + Btn_M_Height

        this.headImgs = this.initHeadImage()
        this.scoreBtns = this.initScoreBtn()
        this.stopBtn = new MiniButton(
            Screen_Width / 2 - Btn_M_Wdith / 2,
            this.y + this.height - Btn_M_Height,
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
        const y = this.y + Item_Width + 8
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

        const userId = GameGlobal.databus.userId
		cloud_callScore(userId, 0)
	}
}