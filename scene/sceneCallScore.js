/*
    叫分选庄的场景
*/

import { cloud_callScore } from "../cloudFunc";
import { createBtn } from "../common/btn";
import Scene from "../common/scene";
import { Btn_M_Height, Btn_Width, PickBtn_Top, Screen_Height, Screen_Width } from "../Defines";
import HandCard from "../player/handCard";
import PlayersIcon from "../player/playerIcon";
import PlayerSelect from "../player/playerSelect";
import { GameStep, playerName } from "../util";

export default class SceneCallScore extends Scene {
	constructor() {
		super()
		this.sceneStep = GameStep.CallScore

		this.playersIcon = new PlayersIcon(this.handleOfClickEnemy.bind(this))
		this.handCard = new HandCard()
	}

	// 点击选庄
    handleOfClickEnemy(userKey) {
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
			this.handCard.update(GameGlobal.databus.handCards)
		}
	}

	renderScene(ctx) {
		this.playersIcon.render(ctx)
		this.handCard.render(ctx)
	}

	handleOfSceneClick(x, y) {
    this.playersIcon.handleOfClick(x, y)
	}

	getTipStrs() {
		if (GameGlobal.databus && GameGlobal.databus.gameInfo) {
			const text1 = "游戏阶段：叫分"
			const userId = GameGlobal.databus.gameInfo["focusPlayer"]
			const name = playerName(userId)
			const text2 = "从" + name + "开始叫分"
			return [text1, text2]
		}
		return [[]]
	}
}