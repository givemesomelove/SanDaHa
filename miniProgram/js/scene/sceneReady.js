/*
    准备阶段的场景
*/

import { Btn_Height, Btn_Width } from "../common/Defines";
import { clickItems, GameStep, getLocalUserId, getUserOnline, makeImage, playerName, playerNames, randomPlayers, removeItems, renderItems, showLoading, userIdByName } from "../common/util";
import {
	cloud_createRoom,
	cloud_deleteGame,
	cloud_deleteRoom,
	cloud_joinRoom,
	cloud_login,
	cloud_outRoom,
	cloud_startGame
} from "../control/cloudFunc";
import { createBtn } from "../View/btn";

import Scene from "./scene"

export default class SceneReady extends Scene {
	constructor() {
		super()
		this.bgImage = makeImage("sceneBg_2")
		this.sceneStep = GameStep.Ready
	}

	initLoginBtn() {
		let names = ["谭别", "西瓜别", "鸟别", "徐别", "虎别"]

		const blocks = []
		for (let i = 0; i < names.length; i ++) {
			const userId = userIdByName(names[i])
			blocks[i] = () => this.handleOfLogin(userId)
		}

		let btns = []
		const sideCount = Math.floor(names.length / 2);
		const x = this.width / 2 - Btn_Width / 2
		const y = this.height / 2 - Btn_Height / 2 - sideCount * Btn_Height
		for (let i = 0; i < names.length; i++) {
			const btn = createBtn(x, y + i * Btn_Height, names[i], blocks[i])
			btns.push(btn)
		}
		return btns
	}

	// 登录
	handleOfLogin(userId) {
		showLoading(1)
		GameGlobal.databus.updateLogin(userId)
	}

	// 准备按钮(普通)
	initRoomBtns() {
		const userId = GameGlobal.databus.userId
		const online = getUserOnline(userId)

		const x = this.width / 2 - Btn_Width / 2
		const y = this.height / 2 - Btn_Height / 2
		if (online) {
			const btn = createBtn(x, y, "取消准备",this.handleOfOutRoom.bind(this))
			return [btn]
		} else {
			const btn = createBtn(x, y, "准备",this.handleOfJoinRoom.bind(this))
			return [btn]
		}
	}

	// 准备按钮(管理员)
	initGMBtns() {
		const titles = ["创建房间", "加入房间", "删除房间", "开始游戏", "删除游戏"]
		const blocks = []
		blocks[0] = this.handleOfCreatRoom.bind(this)
		blocks[1] = this.handleOfJoinRoom.bind(this)
		blocks[2] = this.handleOfDeleteRoom.bind(this)
		blocks[3] = this.handleOfCreateGame.bind(this)
		blocks[4] = this.handleOfDeleteGame.bind(this)

		let btns = []
		const sideCount = Math.floor(titles.length / 2);
		const x = this.width / 2 - Btn_Width / 2
		const y = this.height / 2 - Btn_Height / 2 - sideCount * Btn_Height
		for (let i = 0; i < titles.length; i++) {
			const btn = createBtn(x, y + i * Btn_Height, titles[i], blocks[i])
			btns.push(btn)
		}
		return btns
	}

	// 创建房间
	handleOfCreatRoom() {
		if (!this.checkLoginState()) return

		cloud_createRoom()
	}

	// 删除房间
	handleOfDeleteRoom() {
		cloud_deleteRoom()
	}

	// 加入房间
	handleOfJoinRoom() {
		if (!this.checkLoginState()) return;
		cloud_joinRoom()
	}

	// 退出房间
	handleOfOutRoom() {
		if (!this.checkLoginState()) return;
		cloud_outRoom()
	}

	// 开始游戏
	handleOfCreateGame() {
		if (!this.checkLoginState()) return;

		if (GameGlobal.databus.roomPlayers.length < 4) {
			tipToast("人数不够")
		}

		let players = GameGlobal.databus.roomPlayers
		players = randomPlayers(players)
		cloud_startGame(players)
	}

	// 删除游戏
	handleOfDeleteGame() {
		cloud_deleteGame()
	}

	// 检查登录状态
	checkLoginState() {
		if (!GameGlobal.databus.userId) {
			tipToast("先点左边的登录按钮")
			return false;
		}
		return true;
	}

	// 重写这个方法更新数据
	updateScene() {
		removeItems(this.btns)
		this.btns = []
		if (!this.needUpdate) return

		const userId = GameGlobal.databus.userId
		// 是否登陆过
		const localId = getLocalUserId()
		const everLogin = localId ? true : false
		// 是否已登录
		const isLogin = userId ? true : false
		// 是否是管理员
		const isGM = isLogin && playerName(userId) == "虎别"

		if (!everLogin) {
			// 没有登陆过
			this.btns = this.initLoginBtn()
		} else if (!isLogin) {
			// 当前没有登陆，就直接登陆
			this.handleOfLogin(localId)
		} else if (everLogin && isLogin && !isGM) {
			this.btns = this.initRoomBtns()
		} else if (everLogin && isLogin && isGM) {
			this.btns = this.initGMBtns()
		}
		console.log(this.btns)
	}

	renderScene(ctx) {
		renderItems(this.btns, ctx)
	}

	handleOfSceneClick(x, y) {
		clickItems(this.btns, x, y)
	}

	// 重写这个方法，来显示状态信息
	getTipStrs() {
		let texts = []
		if (GameGlobal.databus.roomStamp && GameGlobal.databus.roomPlayers) {
			texts.push("当前有房间")
			const names = playerNames(GameGlobal.databus.roomPlayers)
			texts.push("在线:" + names)
		} else {
			texts.push("当前无房间")
		}

		if (GameGlobal.databus.gameInfo) {
			texts.push("当前有游戏")
		} else {
			texts.push("当前无游戏")
		}
		return texts
	}
}