/*
    文本的基类
*/

export default class Lab {
    constructor() {

    }

    // 配置中心对齐
    configCenter(x, y, text, color) {
        this.centerX = x
        this.centerY = y
        this.text = text
        this.single = true
        this.color = color
    }

    // 配置右边对齐
    configRight(x, y, text, color) {
        this.centerX = x
        this.centerY = y
        this.text = text
        this.single = true
        this.isRight = true
        this.color = color
    }

    // 配置多行文字，左上对齐
    configMuti(x, y, texts, color) {
        this.x = x
        this.y = y
        this.texts = texts
        this.single = false
        this.color = color
    }

    // 销毁
    remove() {
        if (this.single) {
            GameGlobal.pool.recover('lab', this)
        } else {
            GameGlobal.pool.recover('labs', this)
        }
    }

    render(ctx) {
        ctx.font = '16px Arial'
        ctx.fillStyle = this.color

        if (this.single && this.text) {
            const size = ctx.measureText(this.text)
            let x = this.centerX - size.width / 2
            if (this.isRight) {
                x = this.centerX - size.width
            }
            const y = this.centerY + 2
            ctx.fillText(this.text, x, y)
        } else if (!this.single && this.texts) {
            const lineHeight = 16 + 4
            for (let i = 0; i < this.texts.length; i ++) {
                ctx.fillText(this.texts[i], this.x, this.y + 16 + i * lineHeight);
            }
        }
    }
}

// 中心一行
export const createLab = (x, y, text, color) => {
    let lab = GameGlobal.pool.getItemByClass('lab', Lab)
    lab.configCenter(x, y, text, color)
    return lab
}

export const createRightLab = (x, y, text, color) => {
    let lab = GameGlobal.pool.getItemByClass('lab', Lab)
    lab.configRight(x, y, text, color)
    return lab
}

// 多行
export const createLabs = (x, y, texts, color) => {
    let labs = GameGlobal.pool.getItemByClass('labs', Lab)
    labs.configMuti(x, y, texts, color)
    return labs
}