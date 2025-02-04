/*
    出牌阶段
*/

import { cloud_pickCard } from "../control/cloudFunc";
import { createBtn, createMiniBtn } from "../View/btn";
import Scene from "./scene";
import { BottomCard_Top, Btn_Height, Btn_M_Height, Btn_M_Wdith, Btn_Width, HeadHeight, MyHead_Top } from "../common/Defines";
import BottomCard from "../View/bottomCard";
import HandCard from "../View/handCard";
import PlayersIcon from "../View/playerIcon";
import TurnPickCard from "../View/turnPickCard";
import { cardRanks, colorName, GameStep, getUserKeyBySeat, isFocuseMy, playerName, Seat } from "../common/util";

const Screen_Width = GameGlobal.canvas.width

export default class ScenePickCard extends Scene {
  constructor() {
    super()
    this.sceneStep = GameStep.PickCard

    this.playersIcon = new PlayersIcon()
    this.handCard = new HandCard()
    this.bottomCard = new BottomCard(true)
    this.turnPickCard = new TurnPickCard()

    const x = Screen_Width - Btn_Width - 16
    const y = BottomCard_Top - 16 - Btn_Height
		this.confirmBtn = createBtn(x, y, "出牌", this.handleOfClickConfirm.bind(this))
  }

  // 确认出牌
  handleOfClickConfirm() {
    const cardIds = this.handCard.getSelectCardIds()
      if (cardIds.length > 0 && this.isFocuse) {
        cloud_pickCard(cardIds)
      }
  }

  updateScene() {
    this.handCard.remove()
    this.bottomCard.remove()
    this.turnPickCard.remove()
    if (this.needUpdate) {
      this.playersIcon.update()
      this.turnPickCard.update()
 
      const userKey = getUserKeyBySeat(Seat.Down)
      const cardIds = GameGlobal.databus.gameInfo[userKey].handCards
			const handCards = cardRanks(cardIds)
			this.handCard.update(handCards)

      this.isEnemy = GameGlobal.databus.gameInfo.enemyPlayer == GameGlobal.databus.userId ? true : false
      if (this.isEnemy) {
        const bottomCard = GameGlobal.databus.gameInfo.bottomEndCards
        this.bottomCard.update(bottomCard)
      }
    }
  }

  renderScene(ctx) {
    this.playersIcon.render(ctx)
    this.turnPickCard.render(ctx)
    this.handCard.render(ctx)
    if (this.isFocuse) {
      this.confirmBtn.render(ctx)
    }
    if (this.isEnemy) {
      this.bottomCard.render(ctx)
    }
  }

  handleOfSceneClick(x, y) {
    this.handCard.handleOfClick(x, y)
    if (this.isFocuse) {
      this.confirmBtn.handleOfClick(x, y)
    }
    if (this.isEnemy) {
      this.bottomCard.handleOfClick(x, y)
    }
  }

  getTipStrs() {
    if (GameGlobal.databus && GameGlobal.databus.gameInfo) {
      const userId = GameGlobal.databus.gameInfo["focusPlayer"]
      const name = playerName(userId)
      const text2 = name + "出牌"
      return [text2]
    }
    return [[]]
  }




}