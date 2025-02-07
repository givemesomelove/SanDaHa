
/*
    基类具备：显示图片、点击事件、红色边框、蒙层、
            标题、背景色
*/

import { drawRoundedRectBorder, drawRoundRect, isPointInFrame } from "../common/util"

export default class Item {
    constructor() {
        this.x = null
        this.y = null
        this.width = null
        this.height = null
        this.image = null
        this.selectBlock = null
        // 是否响应点击事件
        this.enable = true
        // 是否展示边框
        this.showBorder = false
        this.borderColor = 'red'
        // 是否展示蒙层
        this.showMask = false
        this.maskColor = 'rgba(0, 0, 0, 0.5)'
        // 标题默认居中
        this.text = null
        this.font = '16px Arial'
        this.textColor = 'black'
        this.textHeight = 16
        // 背景色
        this.bgColor = null

        // 是否激活
        this.active = false
    }

    setActive(active) {
        this.active = active

        if (active) {
            wx.offTouchEnd(this.handleOfClck.bind(this))
            wx.onTouchEnd(this.handleOfClck.bind(this))
        } else {
            wx.offTouchEnd(this.handleOfClck.bind(this))
        }
    }

    isClicked(x, y) {
        return isPointInFrame(x, y, this.x, this.y, this.width, this.height)
    }

    handleOfClck(e) {
        const {
            clientX: x,
            clientY: y
        } = e.changedTouches[0];

        if (!this.enable) return
        if (!this.isClicked(x, y)) return
        if (!this.selectBlock) return
        if (GameGlobal.itemEventBlocked) return

        this.selectBlock(x, y)

        GameGlobal.itemEventBlocked = true
        setTimeout(() => {
            GameGlobal.itemEventBlocked = false
        }, 500)
    }

    render(ctx) {
        if (!this.active) return
        // 画背景色
        if (this.bgColor) {
            drawRoundRect(ctx, this.x, this.y, this.width, this.height, 0, this.bgColor)
        }

        // 画背景图片
        if (this.image) {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
        }

        // 文字
        if (this.text) {
            ctx.font = this.font
            ctx.fillStyle = this.textColor
            const width = ctx.measureText(this.text).width
            const x = this.x + (this.width - width) / 2
            const y = this.y + (this.height - 16) / 2
            ctx.fillText(this.text, x, y)
        }

        // 画蒙层
        if (this.showMask) {
            drawRoundRect(ctx, this.x, this.y, this.width, this.height, 0, this.maskColor)
        }

        // 画边框
        if (this.showBorder) {
            drawRoundedRectBorder(ctx, this.x, this.y, this.width, this.height, 0, this.borderColor)
        }
    }
}