/**
 * 玩家结果展示
 */

import {
	Card_Height,
	HandCard_Top,
	Screen_Width,
	TurnShow_Top
} from "../common/Defines";
import { bigHeadImgById, isEnemyMy, isPlayerEnemy, isPlayerWin, makeImage } from "../common/util";
import Item from "./item";

const itemWidth = (Screen_Width - 16 * 2) / 4
const itemHeigth = itemWidth * 46 / 82

class playerView extends Item {
	constructor(x, y, width, height, index) {
		super()

		this.index = index
		this.x = x
		this.y = y
		this.width = width
		this.height = height
		this.image = null
		this.active = true

		this.winImage = null
		this.enemyImage = null
	}

	update() {
		const game = GameGlobal.databus.gameInfo
		if (!game) return

		const playerId = game.turnPlayers[this.index]
		this.headImage = bigHeadImgById(playerId)
		this.enemyImage = isPlayerEnemy(playerId) ? makeImage("zhuang") : null
		this.winImage = isPlayerWin(playerId) ? makeImage("win") : makeImage("lose")

		super.update()
	}

	render(ctx) {
		if (!this.active) return
		super.render(ctx)

		this.headImage && ctx.drawImage(
			this.headImage, 
			this.x, 
			this.y, 
			this.width, 
			itemHeigth
		)

		this.enemyImage && ctx.drawImage(
			this.enemyImage, 
			this.x, 
			this.y, 
			30, 
			30
		)

		this.winImage && ctx.drawImage(
			this.winImage, 
			this.x, 
			this.y + itemHeigth, 
			this.width, 
			this.width
		)
	}
}

export default class PlayerEnd extends Item {
	constructor() {
		super()

		this.x = 16
		this.y = TurnShow_Top + Card_Height * 2 + 16 + 16
		this.width = Screen_Width - 16 * 2
		this.height = HandCard_Top - 16 - this.y
		this.active = true

		this.players = this.initPlayers()

		this.updateSubItems()
	}

	initPlayers() {
		const items = []
		for (let i = 0; i < 4; i++) {
			const x = 16 + itemWidth * i
			const item = new playerView(
				x,
				this.y,
				itemWidth,
				this.height,
				i
			)
			items.push(item)
		}
		return items
	}
}