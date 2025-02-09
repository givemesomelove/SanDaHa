// 出牌展示

import { Card_Height, Card_Width, Screen_Width, TurnShow_Bottom, TurnShow_Top } from "../common/Defines"
import { getCurTurnCount, getTurnCardBySeat, rotateImage, Seat } from "../common/util"
import Item from "./item"

class Card extends Item {
	constructor(x, y, cardId, seat) {
		super()

		this.seat = seat
		this.x = x
		this.y = y
		if (seat == Seat.Down || seat == Seat.Up) {
			this.width = Card_Width
			this.height = Card_Height
		} else {
			this.width = Card_Height
			this.height = Card_Width
		}

		const cardList = GameGlobal.cardList
		const card = cardList.find(card => card["id"] == cardId)
		this.image = GameGlobal.imgs[card.img]
		if (seat == Seat.Left) {
			this.image = rotateImage(this.image, true)
		} else if (seat == Seat.Right) {
			this.image = rotateImage(this.image, false)
		}

		this.active = true
	}
}

class LineCard extends Item {
	constructor(seat, index) {
		super()

		this.index = index
		this.seat = seat
		if (seat == Seat.Down) {
			this.x = 0
			this.y = TurnShow_Bottom - Card_Height
			this.width = Screen_Width
			this.height = Card_Height
		} else if (seat == Seat.Left) {
			this.x = 16
			this.y = TurnShow_Top + Card_Height
			this.width = Card_Height
			this.height = TurnShow_Bottom - TurnShow_Top - Card_Height * 2
		} else if (seat == Seat.Up) {
			this.x = 0
			this.y = TurnShow_Top
			this.width = Screen_Width
			this.height = Card_Height
		} else if (seat == Seat.Right) {
			this.x = Screen_Width - 16 - Card_Height
			this.y = TurnShow_Top + Card_Height
			this.width = Card_Height
			this.height = TurnShow_Bottom - TurnShow_Top - Card_Height * 2
		}

		this.active = true
	}

	config(cardIds) {
		const items = []

		let cardWidth = Card_Width
		const count = cardIds.length
		let maxCardWidth = count * cardWidth
		if (this.seat == Seat.Down || this.seat == Seat.Up) {
			if (this.width < maxCardWidth) {
				cardWidth = cardWidth * 2 / 3
				maxCardWidth = count * cardWidth
			}

			const x = this.x + (this.width - maxCardWidth) / 2
			const y = this.y
			for (let i = 0; i < count; i ++) {
				const card = new Card(
					x + i * cardWidth, 
					y, 
					cardIds[i],
					this.seat
				)
				items.push(card)
			}
		} else if (this.seat == Seat.Left) {
			if (this.height < maxCardWidth) {
				cardWidth = cardWidth * 2 / 3
				maxCardWidth = count * cardWidth
			}
			const x = this.x
			const y = this.y + (this.height - maxCardWidth) / 2
			for (let i = 0; i < count; i ++) {
				const card = new Card(
					x, 
					y + cardWidth * i, 
					cardIds[i],
					this.seat
				)
				items.push(card)
			}
		} else {
			if (this.height < maxCardWidth) {
				cardWidth = cardWidth * 2 / 3
				maxCardWidth = count * cardWidth
			}
			const x = this.x
			const y = this.y + (this.height - maxCardWidth) / 2
			for (let i = count - 1; i >= 0; i --) {
				const card = new Card(
					x, 
					y + cardWidth * i, 
					cardIds[i],
					this.seat
				)
				items.push(card)
			}
		}
		this.cards = items
		this.updateSubItems()
	}
}

export default class TurnCards extends Item {
	constructor(index) {
		super()

		this.x = 0
		this.y = TurnShow_Top
		this.width = Screen_Width
		this.height = TurnShow_Bottom - TurnShow_Top

		this.seatCards = this.initSeatCards()
		if (index) {
			this.config(index)
		}

		this.active = true
		this.updateSubItems()
	}

	initSeatCards() {
		const down = new LineCard(Seat.Down)
		const left = new LineCard(Seat.Left)
		const up = new LineCard(Seat.Up)
		const right = new LineCard(Seat.Right)
		return [down, left, up, right]
	}

	config(index) {
		const down = getTurnCardBySeat(Seat.Down, index)
		this.seatCards[0].config(down)

		const left = getTurnCardBySeat(Seat.Left, index)
		this.seatCards[1].config(left)

		const up = getTurnCardBySeat(Seat.Up, index)
		this.seatCards[2].config(up)

		const right = getTurnCardBySeat(Seat.Right, index)
		this.seatCards[3].config(right)
	}

	update() {
		if (this.index) return
		
		const curTurn = getCurTurnCount()
		this.config(curTurn-1)

		super.update()
	}

	render(ctx) {
		super.render(ctx)
	}
}