/*
   展示玩家名字位置的 
*/

import { menuFrame, PickBtn_Top, Screen_Height, Screen_Width, TurnShow_Bottom, TurnShow_Top } from "../common/Defines";
import { getUserIdBySeat, headImageBySeat, Seat, tipToast } from "../common/util";
import Item from "./item";

const itemHeight = 50

class PlayerSide extends Item {
	constructor(x, y, seat, selectBlock) {
		super()

		this.width = itemHeight
		this.height = itemHeight
		this.seat = seat
		if (seat == Seat.Down) {
			this.x = x + itemHeight
			this.y = y + 2 * itemHeight
		} else if (seat == Seat.Left) {
			this.x = x
			this.y = y + itemHeight
		} else if (seat == Seat.Up) {
			this.x = x + itemHeight
			this.y = y
		} else if (seat == Seat.Right) {
			this.x = x + 2 * itemHeight
			this.y = y + itemHeight
		}
		this.image = null
		this.active = true
		this.enable = true
		this.selectBlock = selectBlock
	}

	update() {
		const game = GameGlobal.databus.gameInfo
		if (!game) {
			this.active = false
		} else {
			this.active = true
			this.image = headImageBySeat(this.seat)
			const userId = getUserIdBySeat(this.seat)
			this.showBorder = game.focusPlayer == userId
		}

		super.update()
	}
}

export default class PlayerDesk extends Item {
	constructor() {
		super()

		const centerX = Screen_Width / 2
		const centerY = (TurnShow_Bottom + TurnShow_Top) / 2

		this.x = centerX - 1.5 * itemHeight
		this.y = centerY - 1.5 * itemHeight
		this.width = itemHeight * 3 
		this.height = itemHeight * 3 
		
		this.playerSides = this.initPlayerSides()

		this.active = true
		this.enable = true
		this.selectSeat = null

		this.updateSubItems()
	}

	initPlayerSides() {
		let items = []
		const seats = [Seat.Down, Seat.Left, Seat.Up, Seat.Right]
		for (const seat of seats) {
			const playerSide = new PlayerSide(this.x, this.y, seat, () => {
				this.handleOfClickSide(seat)
			})
			items.push(playerSide)
		}
		return items
	}

	handleOfClickSide(seat) {
		this.selectSeat = seat
		this.playerSides.forEach(item => {
			item.showMask = item.seat != seat
		})
	}

	getSelectSeat() {
		return this.selectSeat
	}

	update() {
		super.update()
	}

	render(ctx) {
		super.render(ctx)
	}
}