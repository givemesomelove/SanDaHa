/*
    首页房间的玩家大图家背景条
 */

import { HeadHeight, Screen_Height, Screen_Width } from "../common/Defines"
import { bigHeadImgById, drawRoundedRectBorder, playerName, userColorById } from "../common/util"
import Item from "./item"
import Label from "./label"

const ItemHeight = 112

const Head_Width = 170
const Head_Height = 96

const userGradientById = userId => {
	const name = playerName(userId)
	if (name == "谭别") {
		return [
			'rgba(38, 170, 226, 0.60)',
			'rgba(83, 203, 255, 0.10)',
			'rgba(0, 60, 86, 0.10)'
		]
	} else if (name == "西瓜别") {
		return [
			'rgba(140, 127, 41, 0.60)',
			'rgba(221, 200, 60, 0.10)',
			'rgba(140, 127, 41, 0.10)'
		]
	} else if (name == "徐别") {
		return [
			'rgba(184, 108, 38, 0.60)',
			'rgba(223, 144, 71, 0.10)',
			'rgba(77, 37, 0, 0.10)'
		]
	} else if (name == "鸟别") {
		return [
			'rgba(47, 98, 197, 0.60)',
			'rgba(101, 144, 255, 0.15)',
			'rgba(47, 89, 197, 0.10)'
		]
	} else if (name == "虎别") {
		return [
			'rgba(131, 254, 255, 0.60)',
			'rgba(117, 254, 255, 0.15)',
			'rgba(77, 183, 184, 0.10)'
		]
	}
}

const userBorderById = userId => {
	const name = playerName(userId)
	if (name == "谭别") {
		return 'rgba(70, 200, 255, 0.20)'
	} else if (name == "西瓜别") {
		return 'rgba(140, 127, 41, 0.20)'
	} else if (name == "徐别") {
		return 'rgba(221, 138, 61, 0.20)'
	} else if (name == "鸟别") {
		return 'rgba(80, 151, 236, 0.20)'
	} else if (name == "虎别") {
		return 'rgba(131, 254, 255, 0.20)'
	}
}

class PlayerView extends Item {
    constructor(y, index) {
        super()
        this.index = index
        this.x = 0
        this.y = y
        this.width = Screen_Width
        this.height = ItemHeight
        this.playerImage = null
        this.bgColor = null
		this.textColor = 'white'
		const labLeft = this.x + Head_Width + 8 + 16
		this.nameLab = new Label(labLeft, this.y + this.height /2, '', 'white', 'left')
		this.scoreLab = new Label(Screen_Width - 16 - 100, this.y + this.height / 2, '', 'white', 'left')

		this.updateSubItems()
	}
	
	getPlayerSumScore = userId => {
		const sumScore = GameGlobal.databus.sumScore
		if (!sumScore) return ''
		if (!sumScore.hasOwnProperty(userId)) return '无'
		const score = sumScore[userId]
		return `总积分：${score}`
	}

    update() {
        if (GameGlobal.databus.roomStamp && GameGlobal.databus.roomPlayers) {
            const userIds = GameGlobal.databus.roomPlayers
            if (userIds.length > this.index) {
                const userId = userIds[this.index]
				this.playerImage = bigHeadImgById(userId)
				this.grdColors = userGradientById(userId)
				this.borderColor = userBorderById(userId)
				this.nameLab.labText = playerName(userId)
				this.scoreLab.labText = this.getPlayerSumScore(userId)
                this.active = true
            } else {
                this.active = false
            }
        } else {
            this.active = false
        }
        super.update()
    }

    render(ctx) {
        if (!this.active) return
        super.render(ctx)

        if (this.playerImage) {
			// 渐变色
			const gradient = ctx.createLinearGradient(0, 0, this.width, 0);
			gradient.addColorStop(0, this.grdColors[0])
			gradient.addColorStop(0.75, this.grdColors[1])
			gradient.addColorStop(1, this.grdColors[2])
			ctx.fillStyle = gradient
			ctx.fillRect(this.x, this.y, this.width, this.height)

			//边框
			drawRoundedRectBorder(ctx, this.x, this.y, this.width, this.height, 0, this.borderColor)

			const y =this.y + (this.height - Head_Height) / 2
			ctx.drawImage(this.playerImage, this.x + 8, y, Head_Width, Head_Height)
			// gradient.addColorStop(1, 'rgba(77, 183, 184, 0.10)')
        }
    }
}

export default class BigIcon extends Item {
    constructor() {
		super()
		
		this.spacing = 16
		this.x = 0
		this.y = Screen_Height / 2 - ItemHeight * 2.3 - this.spacing * 3 / 2
		this.width = Screen_Width
		this.height =  ItemHeight * 4 + this.spacing * 3
		this.playerImages = this.initPlayerImages()
		this.active = true
		this.updateSubItems()
    }

    initPlayerImages() {
        const items = []
        for (let i = 0; i < 4; i ++) {
			const y = this.y + i * (ItemHeight + this.spacing)
			const item = new PlayerView(y, i)
			items.push(item)
		}
		return items
    }
}