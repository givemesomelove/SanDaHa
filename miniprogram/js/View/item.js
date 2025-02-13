
/*
    基类具备：显示图片、点击事件、红色边框、蒙层、
            标题、背景色
*/

import { clickItems, drawRoundedRectBorder, drawRoundRect, isPointInFrame, makeImage, renderItems, updateItems } from "../common/util"

export default class Item {
    constructor() {
        this.x = null
        this.y = null
        this.width = null
        this.height = null
        this.image = null
        this.selectBlock = null
        // 是否响应点击事件
        this.enable = false
        // 是否展示边框
        this.showBorder = false
		this.borderColor = 'red'
		this.selectImage = makeImage("select")
        // 是否展示蒙层
        this.showMask = false
        this.maskColor = 'rgba(0, 0, 0, 0.5)'
        // 标题默认居中
        this.text = null
        this.font = 16
        this.textColor = 'white'
        // 背景色
        this.bgColor = null
        // 是否激活(既决定了显示，同时决定了点击事件)
		this.active = false

        this.subItems = []
    }

    // 添加点击事件
    initEvent() {
        wx.offTouchEnd(this.handleOfClick.bind(this))
        wx.onTouchEnd(this.handleOfClick.bind(this))
    }

    removeEvent() {
        wx.offTouchEnd(this.handleOfClick.bind(this))
    }

    isClicked(x, y) {
        return isPointInFrame(x, y, this.x, this.y, this.width, this.height)
    }

    handleOfClick(e) {
        const {
            clientX: x,
            clientY: y
        } = e.changedTouches[0];

        if (!this.enable || !this.active) return
        if (!this.isClicked(x, y)) return

        // 传递点击事件至所有子节点
        clickItems(this.subItems, e)

        if (GameGlobal.itemEventBlocked) return
        if (!this.selectBlock) return
        // 响应自身点击事件
        this.selectBlock(x, y)
        // 保留点击一次只响应一个事件
        GameGlobal.itemEventBlocked = true
        setTimeout(() => {
            GameGlobal.itemEventBlocked = false
        }, 400)
    }

    update() {
        if (!this.active) return
        updateItems(this.subItems)
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
            ctx.font = `${this.font}px Arial`
			ctx.fillStyle = this.textColor
			ctx.textBaseline = 'middle'

            const width = ctx.measureText(this.text).width
            const x = this.x + (this.width - width) / 2
            const y = this.y + this.height / 2
            ctx.fillText(this.text, x, y)
        }

        // 画蒙层
        if (this.showMask) {
            drawRoundRect(ctx, this.x, this.y, this.width, this.height, 0, this.maskColor)
        }

        // 画边框
        if (this.showBorder && this.selectImage) {
			ctx.drawImage(this.selectImage, this.x, this.y, this.width, this.height)
            // drawRoundedRectBorder(ctx, this.x, this.y, this.width, this.height, 0, this.borderColor)
        }

        // 加载所有子元素
        renderItems(this.subItems, ctx)
    }

    // 刷新当前子item
    updateSubItems() {
        let items = []
        for (const key in this) {
            if (!this.hasOwnProperty(key)) continue;
            // 直接子元素
            if (this[key] instanceof Item) {
                items.push(this[key])
            }
            // 集合元素
            if (Array.isArray(this[key]) && key != "subItems") {
                this[key].forEach(item => {
                    if (item instanceof Item) {
                        items.push(item)
                    }
                })
            }
        }
        this.subItems = items
    }
}