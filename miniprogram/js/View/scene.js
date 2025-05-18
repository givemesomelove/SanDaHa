/*
    场景的基类
 */

import {
	menuFrame,
	Screen_Height,
	Screen_Width
} from "../common/Defines";
import {
	curColorImage,
	enableItems,
	getCurStep,
	getPlayInfoById,
	getPlayInfoBySeat,
	isEnemyMy,
	makeImage,
	tipToast
} from "../common/util";
import Item from "./item";
import Label from "./label";
import ModalBg from "./sceneSetting";
import SetBtn from "./topLeftBtn";

export default class Scene extends Item {
	constructor() {
		super()
		this.x = 0
		this.y = 0
		this.width = Screen_Width
		this.height = Screen_Height
		this.enable = true
		this.image = makeImage("sceneBg_2")
		// 添加点击事件
		this.initEvent()

		this.step = null
		this.bgImage = null

		this.stepLab = new Label(this.width / 2, (menuFrame.top + menuFrame.bottom) / 2, "", 'white')
		this.SetBtn = new SetBtn(0, this.handleOfClickSetting, 'settings')
		this.historyBtn = new SetBtn(1, this.handleOfClickHistory, 'history')
		this.mainColorBtn = new SetBtn(2, this.handleOfClickMainColor, null)
		this.watchBtn = new SetBtn(3, this.handleOfClickWatch, 'watch')
		this.watchBtn.configRight()

		const x = 16 + 4 * 25 + 8
		this.scoreLab = new Label(x, (menuFrame.top + menuFrame.bottom) / 2, "", 'white')
	}

	handleOfModalBgDismiss = () => {
		this.enable = true
	}

	handleOfClickSetting = () => {
		GameGlobal.setPage.setActive(this.handleOfModalBgDismiss)
		this.enable = false
	}

	handleOfClickHistory = () => {
		GameGlobal.historyPage.setActive(this.handleOfModalBgDismiss)
		this.enable = false
	}

	handleOfClickMainColor = () => {
		const isBeforePickCard = () => {
			const game = GameGlobal.databus.gameInfo
			if (!game) return false
		
			const enemyId = game.enemyPlayer
			const hand = getPlayInfoById(enemyId)
			return hand.turnsCards.length == 0
		}
		// 庄家才能修改
		if (!isEnemyMy()) return
		// 出牌前可以修改
		if (!isBeforePickCard()) return

		GameGlobal.colorPage.setActive(this.handleOfModalBgDismiss)
		this.enable = false
	}

	handleOfClickWatch = () => {
		const success = GameGlobal.databus.startWatchMode()
		if (!success) {
			tipToast("无法观战")
			return
		}

		GameGlobal.watchPage.setActive(this.handleOfWatchBgDismiss)
		enableItems(GameGlobal.pages, false)
	}

	handleOfWatchBgDismiss = () => {
		GameGlobal.databus.exitWatchMode()
		enableItems(GameGlobal.pages, true)
	}

	// 获取当前分数的几/几
	getScoreStr = () => {
		const gameInfo = GameGlobal.databus.gameInfo
		if (!gameInfo) return ""

		const target = gameInfo.targetScore
		if (!target) return ""
		const cur = gameInfo.curScore
		return `${cur}/${target}`
	}

	update() {
		const step = getCurStep()
		this.active = this.step == step

		const colorImage = curColorImage()
		this.mainColorBtn.image = colorImage ? colorImage : null
		this.scoreLab.text = this.getScoreStr()
		super.update()
	}
}