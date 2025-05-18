
import { Card_Height, HandCard_Top, Screen_Height, Screen_Width, TurnShow_Top } from "../common/Defines";
import { bigHeadImgById, isPlayerEnemy, isPlayerWin, makeImage, playerName } from "../common/util";
import Item from "./item";
import Label from "./label";


const bottomCard_bottom = TurnShow_Top + Card_Height * 2 + 16
const PlayerItem_Height = (HandCard_Top- bottomCard_bottom -8 - 66 - 8) / 4

export default class PlayerResult extends Item {
	constructor(index) {
		super()

		this.index = index
		this.x = 0
		this.y = bottomCard_bottom + 8 + 66 - 4 + index * PlayerItem_Height
		this.width = Screen_Width
		this.height = PlayerItem_Height

		this.icon = null

		this.enemyIcon = null

		const left = 32 + 85 + 16
		this.nameLab = new Label(left, this.y + 20, '', 'white', 'left')
		this.scoreLab = new Label(left, this.y + 20 + 24, '', 'rgba(255, 255, 255, 0.7)', 'left')

		this.winIcon = makeImage("winner")
		this.curScoreLab = new Label(Screen_Width - 48, this.y + 24 + 12, '+0', 'rgba(B7, B7, B7, 1)')

		this.active = true

		this.updateSubItems()
	}

	update() {
		const game = GameGlobal.databus.gameInfo
		if (!game) {
			super.update()
			return
		}

		const playerId = game.turnPlayers[this.index]
		this.icon = bigHeadImgById(playerId)
		this.enemyIcon = isPlayerEnemy(playerId) ? makeImage("zhuang") : null

		this.nameLab.labText = playerName(playerId)

		this.scoreLab.labText = this.getPlayerSumScore(playerId)
		this.curScoreLab.labText = this.getPlayerCurScore(playerId)

		this.winIcon = isPlayerWin(playerId) ? makeImage('winner') : makeImage("loser")
		super.update()
	}

	getPlayerCurScore = userId => {
		const gameInfo = GameGlobal.databus.gameInfo
		if (!gameInfo || !gameInfo.gameScore) return ''
		if (!gameInfo.gameScore.hasOwnProperty(userId)) return ''
		const score = gameInfo.gameScore[userId]
		if (score >= 0) {
			return `+${score}`
		} else {
			return `${score}`
		}
	}

	getPlayerSumScore = userId => {
		const gameInfo = GameGlobal.databus.gameInfo
		if (!gameInfo || !gameInfo.sumScore) return ''
		if (!gameInfo.sumScore.hasOwnProperty(userId)) return ''
		const score = gameInfo.sumScore[userId]
		return `总积分：${score}`
	}

	render(ctx) {
		if (!this.active) return
		super.render(ctx)

		this.icon && ctx.drawImage(
			this.icon, 
			32,
			this.y + 8,
			85,
			48
		)

		this.enemyIcon && ctx.drawImage(
			this.enemyIcon,
			32 + 85 - 25,
			this.y + 8 + 48 - 25,
			25,
			25
		)

		// 98 * 48
		this.winIcon && ctx.drawImage(
			this.winIcon,
			Screen_Width - 98 - 16,
			this.y + 4,
			98,
			48
		)
	}
}