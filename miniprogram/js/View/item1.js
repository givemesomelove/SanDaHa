/**
 * 第一代元素，添加动画和边界
 */
import Item from "./item";


export default class Item1 extends Item {
    constructor() {
        super()

        // 动画相关
        this.animateX = 0
        this.animateStartX = 0
        this.animateY = 0
        this.animateStartY = 0
        this.animateStamp = 0
        // 边界相关
        this.minX = null
        this.minY = null
        this.maxX = null
        this.maxY = null
        this.clipBylimit = false
    }

    removeAnimation = () => {
        this.animateX = 0
        this.animateStartX = 0
        this.animateY = 0
        this.animateStartY = 0
        this.animateDuration = 0
        this.animateStartTime = 0
    }

    animate2Point = (x, y, duration) => {
        this.animateX += x
        this.animateStartX = this.animateStartX ? this.animateStartX : this.x
        this.animateY += y
        this.animateStartY = this.animateStartY ? this.animateStartY : this.y
        this.animateDuration += duration
        this.animateStartTime = Date.now()
    }

    playAnimation() {
        const easeInOutQuad = t => {
            return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        }
        const easeOutElastic = t => {
            return Math.pow(2, -10 * t) * Math.sin((t - 0.075) * (2 * Math.PI) / 0.3) + 1;
        }
        const curDuration = Date.now() - this.animateStar
        let progress = Math.min(curDuration / this.animateDuration, 1);
        if (progress == 1) {
            // 动画结束
            this.removeAnimation()
            return
        }
        progress = easeInOutQuad(progress)
        this.x = this.animateStartX + this.animateX * progress
        this.y = this.animateStartY + this.animateY * progress
    }

    setLimitRect = (minX, minY, maxX, maxY) => {
        this.minX = minX
        this.minY = minY
        this.maxX = maxX
        this.maxY = maxY
        this.clipBylimit = true
    }

    clipByLimit = () => {
        if (!this.clipByLimit) return

        
    }

    render(ctx) {
        this.playAnimation()
        super.render(ctx)
    }
} 