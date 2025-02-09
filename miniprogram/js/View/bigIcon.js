/*
    首页房间的玩家大图家背景条
 */

import { Screen_Height, Screen_Width } from "../common/Defines"
import { bigHeadImgById, playerName, userColorById } from "../common/util"
import Item from "./item"

const ItemHeight = 100

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
        this.text = null
        this.textColor = 'black'
    }

    update() {
        if (GameGlobal.databus.roomStamp && GameGlobal.databus.roomPlayers) {
            const userIds = GameGlobal.databus.roomPlayers
            if (userIds.length > this.index) {
                const userId = userIds[this.index]
                this.playerImage = bigHeadImgById(userId)
                this.bgColor = userColorById(userId)
                this.text = playerName(userId)
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
            ctx.drawImage(this.playerImage, this.x, this.y, this.height, this.height)
        }
    }
}

export default class BigIcon extends Item {
    constructor() {
		super()
		
		this.spacing = 16
		this.x = 0
		this.y = Screen_Height / 2 - ItemHeight * 2 - this.spacing * 3 / 2
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