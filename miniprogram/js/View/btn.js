/*
    较宽的按钮基类
*/
import { Btn_Height, Btn_M_Height, Btn_M_Wdith, Btn_Width, Card_Select_Width } from "../common/Defines"
import { drawBtnRoundRect, isPointInFrame, makeImage } from "../common/util"
import { createLab } from "./lab"

export default class Btn {
    constructor() {
        
        this.image = makeImage("scene1_btn")
        
        this.width = Btn_Width
        this.height = Btn_Height
        this.selectImage = makeImage("select")
        this.lab = null
        this.select = false
        this.clickBlock = null
        this.online = false
        this.unClickable = false
        this.showSelect = false
    }

    // 配置按钮元素
    config(x, y, text, clickBlock) {
        this.x = x
        this.y = y
        this.clickBlock = clickBlock

        if (this.lab) this.lab.remove()
        this.lab = createLab(
            x + this.width / 2,
            y + this.height / 2,
            text,
            'white'
        )
        this.select = false
        this.online = false
        this.unClickable = false
    }

    // 销毁
    remove() {
        GameGlobal.pool.recover('btn', this)
    }

    // 刷新显示
    render(ctx) {
        if (!this.unClickable) {
            // 可点击背景
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
        } else {
            // 不可点击背景
            drawBtnRoundRect(ctx, this.x + this.width / 2, this.y + this.height / 2)
        }

        if (this.lab) {
            this.lab.render(ctx)
        }

        if (this.select) {
            const x = this.x + (this.width - Card_Select_Width) / 2
            const y = this.y + (this.height - Card_Select_Width) / 2
            ctx.drawImage(this.selectImage, x, y, Card_Select_Width, Card_Select_Width)
        }

        if (this.online) {
            ctx.beginPath();
            const y = this.y + this.height / 2 - 2
            ctx.arc(this.x + 30, y, 4, 0, Math.PI * 2);
            ctx.fillStyle = 'green';
            ctx.fill();
        }
    }

    // 是否被点击了
    isClicked(x, y) {
        return isPointInFrame(x, y, this.x, this.y, this.width, this.height)
    }

    // 点击事件处理
    handleOfClick = (x, y) => {
        if (this.isClicked(x, y) &&
            !GameGlobal.btnEventBlocked &&
            !this.unClickable) {
            this.select = true
            if (this.clickBlock) this.clickBlock()
            GameGlobal.btnEventBlocked = true
            setTimeout(() => {
                GameGlobal.btnEventBlocked = false
                if (!this.showSelect) this.select = false                
            }, 500)
        }
    }
}

export const createBtn = (x, y, text, clickBlock) => {
    let tmpBtn = GameGlobal.pool.getItemByClass('btn', Btn)
    tmpBtn.width = Btn_Width
    tmpBtn.height = Btn_Height
    tmpBtn.config(x, y, text, clickBlock)
    return tmpBtn
}

export const createMiniBtn = (x, y, text, clickBlock) => {
    let tmpBtn = GameGlobal.pool.getItemByClass('miniBtn', Btn)
    tmpBtn.width = Btn_M_Wdith
    tmpBtn.height = Btn_M_Height
    tmpBtn.config(x, y, text, clickBlock)
    return tmpBtn
}