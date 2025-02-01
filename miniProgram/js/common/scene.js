/*
	场景的基类
*/

import {
	Screen_Height,
	Screen_Width,
	Scene_Start_Bg_Icon,
	MenuTop,
	Scene_Ready_Bg_Icon,
	MenuBottom
} from "../Defines";
import {
	GameStep,
	getCurStep,
	isFocuseMy,
  makeImg
} from "../util";
import {
	createLab,
	createLabs
} from "./lab";

export default class Scene {
	constructor() {
		this.sceneStep = null
		this.gameStep = null
		this.bgImage = makeImg("sceneBg_1")

		this.x = 0
		this.y = 0
		this.width = Screen_Width
		this.height = Screen_Height

		this.tipLabs = createLabs(0, MenuTop, [""], 'black')
		this.handleOfClickScene = this.handleOfClick.bind(this)
		this.focuse = false

		this.stepLab = createLab(Screen_Width / 2, (MenuTop + MenuBottom) / 2, "", 'black')
	}

	// 点击事件接收
	handleOfClick(e) {
		const {
			clientX: x,
			clientY: y
		} = e.changedTouches[0];

		this.handleOfSceneClick(x, y)
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
		this.focuse = isFocuseMy()
		const gameStep = getCurStep()
		if (gameStep == this.sceneStep ||
			(gameStep != this.gameStep && this.gameStep == this.sceneStep)) {
			this.gameStep = gameStep
			this.needUpdate = gameStep == this.sceneStep
			this.updateScene()
		} else {
			this.gameStep == gameStep
		}

		if (gameStep == this.sceneStep) {
			this.initEvent()
			this.tipLabs.texts = this.getTipStrs()
			this.stepLab.text = gameStep
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