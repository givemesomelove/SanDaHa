/*
	场景的基类
*/

import { menuFrame } from "../common/Defines"
import { isEnemyMy, isFocuseMy, makeImage, getCurStep } from "../common/util"
import { createLab, createLabs } from "../View/lab"
import MainColorImg from "../View/mainColorImg"
import ReStartBtn from "../View/startGameBtn"

export default class Scene {
	constructor() {
		this.sceneStep = null
		this.gameStep = null
		this.bgImage = makeImage("sceneBg_1")

		this.x = 0
		this.y = 0
		this.width = GameGlobal.canvas.width
		this.height = GameGlobal.canvas.height

		this.tipLabs = createLabs(0, menuFrame.bottom, [""], 'black')
		this.handleOfClickScene = this.handleOfClick.bind(this)
		this.isFocuse = false
		this.isEnemy = false

		this.stepLab = createLab(this.width / 2, (menuFrame.top + menuFrame.bottom) / 2, "", 'black')

		// 重开游戏按钮
		this.reStartBtn = new ReStartBtn()

		this.mainColorImg = new MainColorImg()
	}

	// 点击事件接收
	handleOfClick(e) {
		const {
			clientX: x,
			clientY: y
		} = e.changedTouches[0];

		this.handleOfSceneClick(x, y)
		this.reStartBtn.handleOfClick(x, y)
	}

	// 添加点击事件
	initEvent() {
		wx.offTouchEnd(this.handleOfClickScene)
		wx.onTouchEnd(this.handleOfClickScene)
	}

	// 移除点击事件
	removeEvent() {
		wx.offTouchEnd(this.handleOfClickScene)
	}

	// 只有当前场景，或者从当前场景切换至其他场景需要updateScene
	update() {
		this.isFocuse = isFocuseMy()
		this.isEnemy = isEnemyMy()
		const gameStep = 
		getCurStep()
		if (gameStep == this.sceneStep ||
			(gameStep != this.gameStep && this.gameStep == this.sceneStep)) {
			this.gameStep = gameStep
			this.needUpdate = gameStep == this.sceneStep
			this.updateScene()
		} else {
			this.gameStep = gameStep
		}

		if (gameStep == this.sceneStep) {
			this.initEvent()
			this.tipLabs.texts = this.getTipStrs()
			this.stepLab.text = gameStep
			this.mainColorImg.update()
			this.reStartBtn.update()
		} else {
			this.removeEvent()
		}
	}

	render(ctx) {
		if (this.gameStep == this.sceneStep) {
			ctx.drawImage(this.bgImage, this.x, this.y, this.width, this.height);
			this.tipLabs.render(ctx)
			this.stepLab.render(ctx)
			this.renderScene(ctx)
			this.reStartBtn.render(ctx)
			this.mainColorImg.render(ctx)
		}
	}

	// 重写这个方法更新数据
	updateScene() {

	}

	// 重写这个方法渲染
	renderScene(ctx) {

	}

	// 重写点击事件处理
	handleOfSceneClick(x, y) {

	}

	// 重写这个方法，来显示状态信息
	getTipStrs() {
		return [""]
	}
}