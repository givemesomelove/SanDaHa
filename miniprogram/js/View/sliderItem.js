import {
	menuFrame,
	Screen_Height,
	Screen_Width
} from "../common/Defines";
import {
	isPointInFrame,
	makeImage
} from "../common/util";
import SceneWinner from "../scene/sceneWinner";
import Button from "./Button";
import Item from "./item";

const itemWidth = 100
const itemHeight = 100
const itemCount = 10

export default class Slider extends Item {
	constructor() {
		super()

		this.bgColor = 'white'

		this.x = 16
		this.y = menuFrame.bottom + 16
		this.width = Screen_Width - 16 * 2
		this.height = itemHeight
		this.spacing = (this.width - itemWidth) / 2 - 16

		this.contentWidth = itemWidth * itemCount
		this.contentHeight = itemHeight
		this.offsetX = 0
		this.active = true

		this.imgs = this.initImgs()

		// 动画相关
        this.removeAnimation()
	}

	removeAnimation = () => {
        this.animateX = 0
        this.animateStartX = 0
        this.animateDuration = 0
        this.animateStartTime = 0
	}
	
	animate2Point = (x, duration) => {
		if (this.animateStartTime) return

        this.animateX += x
        this.animateStartX = this.animateStartX ? this.animateStartX : this.offsetX
        this.animateDuration += duration
		this.animateStartTime = Date.now()
		console.log(`${this.animateX}, ${this.animateStartX}`)
    }

	initImgs = () => {
		const images = []
		for (let i = 0; i < 10; i++) {
			const img = makeImage(`color_${i % 5 + 1}`)
			images.push(img)
		}
		return images
	}

	playAnimation() {
        const easeInOutQuad = t => {
            return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        }
        const easeOutElastic = t => {
            return Math.pow(2, -10 * t) * Math.sin((t - 0.075) * (2 * Math.PI) / 0.3) + 1;
		}
		
		if (!this.animateStartTime) return

        const curDuration = Date.now() - this.animateStartTime
		let progress = Math.min(curDuration / this.animateDuration / 1000, 1);
		console.log(`${curDuration}, ${this.animateDuration}, ${progress}`)
        if (progress == 1) {
			// 动画结束
			this.offsetX = this.animateStartX + this.animateX
            this.removeAnimation()
            return
        }
        progress = easeInOutQuad(progress)
		this.offsetX = this.animateStartX + this.animateX * progress
		console.log(this.offsetX)
    }

	handleOfTouchMove = e => {
		const {
			clientX: x,
			clientY: y
		} = e.touches[0];
		const isPoint = isPointInFrame(x, y, this.x, this.y, this.width, itemHeight)

		if (isPoint) {
			this.startX = x
		} else {
			this.startX = null
		}
	}

	handleOfTouchEnd = e => {
		const {
			clientX: x,
			clientY: y
		} = e.changedTouches[0];

		if (this.startX) {
			const distance = x - this.startX
			if (distance > 10 && this.offsetX > 0) {
				this.animate2Point(-itemWidth, 0.2)
			} else if (distance < -10 && this.offsetX < itemCount * itemWidth - this.spacing) {
				this.animate2Point(itemWidth, 0.2)
			}
		}
	}

	initEvent = () => {
		wx.onTouchStart(this.handleOfTouchMove.bind(this))
		wx.onTouchEnd(this.handleOfTouchEnd.bind(this))
	}

	removeEvent = () => {
		wx.onTouchStart(this.handleOfTouchMove.bind(this))
		wx.offTouchEnd(this.handleOfTouchEnd.bind(this))
	}

	update() {
		if (this.active) {
			this.initEvent()
		} else {
			this.removeEvent()
		}
		super.update()
	}

	render(ctx) {
		if (!this.active) return
		super.render(ctx)

		this.playAnimation()
		this.imgs.forEach((item, index) => {
			const width = this.width
			const offsetX = this.offsetX
			const ex = this.spacing + index * itemWidth
			const ey = this.y
			const eWidth = itemWidth
			const eHeight = itemHeight
			const natWidth = item.naturalWidth
			const natHeight = item.naturalHeight

			if (offsetX > ex) {
				const nWidth = Math.max(ex + eWidth - offsetX, 0)
				const nStartX = Math.min(offsetX - ex, eWidth)
				const rsX = natWidth * nStartX / itemWidth
				const rsWidth = natWidth / itemWidth * nWidth

				if (nWidth > 0) {
					ctx.drawImage(item,
						rsX, 0, rsWidth, natHeight,
						this.x + ex - offsetX, ey, nWidth, eHeight)
				}
			} else {
				let nWidth = Math.max(offsetX + width - ex, 0)
				nWidth = Math.min(nWidth, eWidth)
				const nStartX = 0
				const rsX = natWidth * nStartX / itemWidth
				const rsWidth = natWidth / itemWidth * nWidth

				if (nWidth > 0) {
					ctx.drawImage(item,
						rsX, 0, rsWidth, natHeight,
						this.x + ex - offsetX, ey, nWidth, eHeight)
				}
			}
		})
	}
}