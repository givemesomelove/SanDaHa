/*
    出牌阶段
*/

import { cloud_pickCard } from "../cloudFunc";
import { createBtn, createMiniBtn } from "../common/btn";
import Scene from "../common/scene";
import { Btn_M_Height, Btn_M_Wdith, Btn_Width, HeadHeight, MyHead_Top, Screen_Width } from "../Defines";
import BottomCard from "../player/bottomCard";
import HandCard from "../player/handCard";
import PlayersIcon from "../player/playerIcon";
import TurnPickCard from "../player/turnPickCard";
import { colorName, GameStep, isFocuseMy, playerName } from "../util";

export default class ScenePickCard extends Scene {
  constructor() {
    super()
    this.sceneStep = GameStep.PickCard

    this.playersIcon = new PlayersIcon()
    this.handCard = new HandCard()
    this.bottomCard = new BottomCard(true)
    this.turnPickCard = new TurnPickCard()

    const x = Screen_Width - 16 - Btn_M_Wdith
    const y = MyHead_Top + (HeadHeight - Btn_M_Height) / 2
    this.confirmBtn = createMiniBtn(x, y, "出牌", this.handleOfClickConfirm.bind(this))
  }

  // 确认出牌
  handleOfClickConfirm() {
    this.confirmBtn.select = false

    if (this.isPickCard) {
      this.isShowBottom = !this.isShowBottom
    } else {
      const cardIds = this.handCard.getSelectCardIds()
      if (cardIds.length > 0 && isFocuseMy()) {
        cloud_pickCard(cardIds)
      }
    }
  }

  updateScene() {
    this.handCard.remove()
    this.bottomCard.remove()
    this.turnPickCard.remove()
    if (this.needUpdate) {
      this.playersIcon.update()
      this.turnPickCard.update()
      this.handCard.update(GameGlobal.databus.handCards)

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
    if (this.focuse) {
      this.confirmBtn.render(ctx)
    }
    if (this.isEnemy) {
      this.bottomCard.render(ctx)
    }
  }

  handleOfSceneClick(x, y) {
    this.handCard.handleOfClick(x, y)
    if (this.focuse) {
      this.confirmBtn.handleOfClick(x, y)
    }
    if (this.isEnemy) {
      this.bottomCard.handleOfClick(x, y)
    }
  }

  getTipStrs() {
    if (GameGlobal.databus && GameGlobal.databus.gameInfo) {
      const text1 = "游戏阶段：出牌阶段"
      const userId = GameGlobal.databus.gameInfo["focusPlayer"]
      const name = playerName(userId)
      const text3 = "当前主色：" + colorName(GameGlobal.databus.gameInfo.mainColor)
      const text2 = name + "出牌，" + text3
      const text4 = "目标分数：" + GameGlobal.databus.gameInfo.targetScore + ",当前分数:" + GameGlobal.databus.gameInfo.curScore
      return [text1, text2, text4]
    }
    return [[]]
  }




}