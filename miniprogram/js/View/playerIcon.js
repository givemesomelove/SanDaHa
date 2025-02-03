/*
   展示玩家名字位置的 
*/

import { HeadHeight, LeftHead_Top, MyHead_Top, RightHead_Top, TopHead_Top } from "../common/Defines"
import { drawRoundedRectBorder, getUserId, getUserKey, getUserKeyBySeat, headImage, isPointInFrame, Seat } from "../common/util"

const Screen_Width = GameGlobal.canvas.width

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

        this.focusId = null
        this.selectBlock = selectBlock
    }

    update() {
        if (!GameGlobal.databus.gameInfo) return
        
        this.leftImg = headImage(Seat.Left)
        this.topImg = headImage(Seat.Up)
        this.rightImg = headImage(Seat.Right)
        this.downImg = headImage(Seat.Down)
        
        this.focusId = databus.gameInfo.focusPlayer
    }

    render(ctx) {
        this.downImg && ctx.drawImage(this.downImg, this.downX, this.downY, HeadHeight, HeadHeight)
        this.leftImg && ctx.drawImage(this.leftImg, this.leftX, this.leftY, HeadHeight, HeadHeight)
        this.topImg && ctx.drawImage(this.topImg, this.topX, this.topY, HeadHeight, HeadHeight)
        this.rightImg && ctx.drawImage(this.rightImg, this.rightX, this.rightY, HeadHeight, HeadHeight)

        if (this.focusId == getUserId(Seat.Down)) {
          drawRoundedRectBorder(ctx, this.downX, this.downY, HeadHeight, HeadHeight, 0, 'red')
        } else if (this.focusId == getUserId(Seat.Left)) {
          drawRoundedRectBorder(ctx, this.leftX, this.leftY, HeadHeight, HeadHeight, 0, 'red')
        } else if (this.focusId == getUserId(Seat.Right)) {
          drawRoundedRectBorder(ctx, this.rightX, this.rightY, HeadHeight, HeadHeight, 0, 'red')
        } else if (this.focusId == getUserId(Seat.Up)) {
          drawRoundedRectBorder(ctx, this.topX, this.topY, HeadHeight, HeadHeight, 0, 'red')
        }
    }

    clickUserKey(x, y) {
      if (isPointInFrame(x, y, this.downX, this.downY, HeadHeight, HeadHeight)) {
        return getUserKeyBySeat(Seat.Down)
      } else if (isPointInFrame(x, y, this.leftX, this.leftY, HeadHeight, HeadHeight)) {
        return getUserKeyBySeat(Seat.Left)
      } else if (isPointInFrame(x, y, this.rightX, this.rightY, HeadHeight, HeadHeight)) {
        return getUserKeyBySeat(Seat.Right)
      } else if (isPointInFrame(x, y, this.topX, this.topY, HeadHeight, HeadHeight)) {
        return getUserKeyBySeat(Seat.Up)
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