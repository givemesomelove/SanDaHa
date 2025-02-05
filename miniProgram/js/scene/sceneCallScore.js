/*
    叫分选庄的场景
*/

import { cardRanks, GameStep, getUserKeyBySeat, isGMMy, playerName, Seat } from "../common/util"
import { cloud_callScore } from "../control/cloudFunc"
import CallScore from "../View/callScore"
import HandCard from "../View/handCard"
import PlayersIcon from "../View/playerIcon"
import Scene from "./scene"

export default class SceneCallScore extends Scene {
	constructor() {
		super()
		this.sceneStep = GameStep.CallScore

		this.playersIcon = new PlayersIcon(this.handleOfClickEnemy.bind(this))
		this.handCard = new HandCard()

		this.callScore = new CallScore()
	}

	// 点击选庄
    handleOfClickEnemy(userKey) {
		if (!isGMMy()) return

      const userId = GameGlobal.databus.gameInfo[userKey].playerId
        const name = playerName(userId)
        const title = "庄家是" + name + ",输入叫分结果"
        wx.showModal({
            title: title,
            content: '',
            editable: true,
            placeholderText: '输入分数',
            complete: res => {
                if (res.cancel) {
                    return
                }
                const score = Number(res.content)
                if (score > 0) {
                    this.callScore(userId, Number(res.content))
                }
            }
        })
    }
    // 叫分请求
    callScore(userId, score) {
        cloud_callScore(userId, score)
    }

	updateScene() {
    	this.handCard.remove()
      
		if (this.needUpdate) {
			this.playersIcon.update()

			const userKey = getUserKeyBySeat(Seat.Down)
			const cardIds = GameGlobal.databus.gameInfo[userKey].handCards
			const handCards = cardRanks(cardIds)
			this.handCard.update(handCards)
		}
	}

	renderScene(ctx) {
		this.playersIcon.render(ctx)
		this.handCard.render(ctx)
		this.callScore.render(ctx)
	}

	handleOfSceneClick(x, y) {
    this.playersIcon.handleOfClick(x, y)
	}

	getTipStrs() {
		if (GameGlobal.databus && GameGlobal.databus.gameInfo) {
			const userId = GameGlobal.databus.gameInfo.focusPlayer
			const name = playerName(userId)
			const text2 = "从" + name + "开始叫分"
			return [text2]
		}
		return [[]]
	}
}