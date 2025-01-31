/*
   展示玩家名字位置的 
*/

import { LeftHead_Top, MenuBottom, MenuTop, MyHead_Top, Name_CenterY, Name_Margin, RightHead_Top, Screen_Height, Screen_Width, TopHead_Top, HeadHeight } from "../Defines";
import { drawRoundedRect, getHeadImg, isPointInFrame, makeImg, playerName, drawRoundedRectBorder, isFocuseMy, getUserKeyByUserId } from "../util";

export default class PlayersIcon {
    constructor(selectBlock) {
        this.leftX = 16
        this.leftY = LeftHead_Top

        this.topX = Screen_Width / 2 - HeadHeight / 2
        this.topY = TopHead_Top
      
        this.rightX = Screen_Width - 16 - HeadHeight
        this.rightY = RightHead_Top

        this.downX = Screen_Width / 2 - HeadHeight / 2
        this.downY = MyHead_Top

        this.selectUserKey = null
        this.selectBlock = selectBlock
    }

    getcurSelectUserKey() {
      return this.selectUserKey
    }

    update() {
        if (!GameGlobal.databus || 
            !GameGlobal.databus.leftKey || 
            !GameGlobal.databus.gameInfo) return
        
        this.leftImg = getHeadImg(GameGlobal.databus.leftKey)
        this.topImg = getHeadImg(GameGlobal.databus.upKey)
        this.rightImg = getHeadImg(GameGlobal.databus.rightKey)
        this.downImg = getHeadImg(GameGlobal.databus.userKey)
        
        this.selectUserKey = getUserKeyByUserId(databus.gameInfo.focusPlayer)
    }

    render(ctx) {
        this.downImg && ctx.drawImage(this.downImg, this.downX, this.downY, HeadHeight, HeadHeight)
        this.leftImg && ctx.drawImage(this.leftImg, this.leftX, this.leftY, HeadHeight, HeadHeight)
        this.topImg && ctx.drawImage(this.topImg, this.topX, this.topY, HeadHeight, HeadHeight)
        this.rightImg && ctx.drawImage(this.rightImg, this.rightX, this.rightY, HeadHeight, HeadHeight)
        if (this.selectUserKey == GameGlobal.databus.userKey) {
          drawRoundedRectBorder(ctx, this.downX, this.downY, HeadHeight, HeadHeight, 0, 'red')
        } else if (this.selectUserKey == GameGlobal.databus.leftKey) {
          drawRoundedRectBorder(ctx, this.leftX, this.leftY, HeadHeight, HeadHeight, 0, 'red')
        } else if (this.selectUserKey == GameGlobal.databus.rightKey) {
          drawRoundedRectBorder(ctx, this.rightX, this.rightY, HeadHeight, HeadHeight, 0, 'red')
        } else if (this.selectUserKey == GameGlobal.databus.upKey) {
          drawRoundedRectBorder(ctx, this.topX, this.topY, HeadHeight, HeadHeight, 0, 'red')
        }
    }

    clickUserKey(x, y) {
      if (isPointInFrame(x, y, this.downX, this.downY, HeadHeight, HeadHeight)) {
        return GameGlobal.databus.userKey
      } else if (isPointInFrame(x, y, this.leftX, this.leftY, HeadHeight, HeadHeight)) {
        return GameGlobal.databus.leftKey
      } else if (isPointInFrame(x, y, this.rightX, this.rightY, HeadHeight, HeadHeight)) {
        return GameGlobal.databus.rightKey
      } else if (isPointInFrame(x, y, this.topX, this.topY, HeadHeight, HeadHeight)) {
        return GameGlobal.databus.upKey
      }
      return null
    }

    handleOfClick(x, y) {
      if (!this.selectBlock) return
      const clickUserKey = this.clickUserKey(x, y)
      if (!clickUserKey) return
      this.selectBlock(clickUserKey)
    }




}