/*
    准备阶段的场景
*/

import {
	cloud_createRoom,
	cloud_deleteGame,
	cloud_deleteRoom,
	cloud_joinRoom,
	cloud_login,
	cloud_outRoom,
	cloud_startGame
} from "../cloudFunc";
import {
	createBtn
} from "../common/btn";
import {
	clickItems,
	cloudFunc,
	GameStep,
	renderItems, 
	cleanItems,
	Stamp2DateString,
	playerNames,
	playerName,
	getOnlinePlayers,
	getLocalUserName,
	showLoading,
	tipToast,
	randomPlayers,
	makeImg
} from "../util";

import Scene from "../common/scene"
import { Btn_Height, Btn_Width, MenuBottom, Screen_Height, Screen_Width } from "../Defines";

export default class SceneReady extends Scene {
	constructor() {
		super()
		this.bgImage = makeImg("sceneBg_2")
		this.sceneStep = GameStep.Ready
	}

	initNamesBtn() {
		let titles = ["我是谭别", "我是西瓜别", "我是鸟别", "我是徐别", "我是虎别"]	

		const blocks = [
			() => {
				this.handleOfLogin("谭别")
			},
			() => {
				this.handleOfLogin("西瓜别")
			},
			() => {
				this.handleOfLogin("鸟别")
			},
			() => {
				this.handleOfLogin("徐别")
			},
			() => {
				this.handleOfLogin("虎别")
			},
		]
		let btns = []
		const sideCount = Math.floor(titles.length / 2);
		const centerX = Screen_Width / 2
		const leftX = centerX - Btn_Width / 2
		const startY = Screen_Height / 2 - Btn_Height / 2 - sideCount * Btn_Height
		for (let i = 0; i < titles.length; i++) {
			const btn = createBtn(leftX, startY + i * Btn_Height, titles[i], blocks[i])
			btns.push(btn)
		}
		return btns
	}

	initRoomBtns() {
		const userIds = GameGlobal.databus.roomPlayers
		
		let titles = ["加入房间"]	

		const blocks = [
			() => {
				this.handleOfLogin("谭别")
			},
			() => {
				this.handleOfLogin("西瓜别")
			},
			() => {
				this.handleOfLogin("鸟别")
			},
			() => {
				this.handleOfLogin("徐别")
			},
			() => {
				this.handleOfLogin("虎别")
			},
		]
		let btns = []
		const sideCount = Math.floor(titles.length / 2);
		const centerX = Screen_Width / 2
		const leftX = centerX - Btn_Width / 2
		const startY = Screen_Height / 2 - Btn_Height / 2 - sideCount * Btn_Height
		for (let i = 0; i < titles.length; i++) {
			const btn = createBtn(leftX, startY + i * Btn_Height, titles[i], blocks[i])
			btns.push(btn)
		}
		return btns
	}

	initLeftBtns() {
		let titles = ["我是谭别", "我是西瓜别", "我是鸟别", "我是徐别", "我是虎别"]
		const localName = getLocalUserName()
		let unClicks = [false, false, false, false, false]
		if (localName) {
			titles = ["谭别", "西瓜别", "鸟别", "徐别", "虎别"]
			const myIndex = titles.indexOf(localName)
			unClicks = [true, true, true, true, true]
			unClicks[myIndex] = false
			titles[myIndex] = GameGlobal.databus.userId ? "我" : "点击登录"
		}

		const blocks = [
			() => {
				this.handleOfLogin("谭别")
			},
			() => {
				this.handleOfLogin("西瓜别")
			},
			() => {
				this.handleOfLogin("鸟别")
			},
			() => {
				this.handleOfLogin("徐别")
			},
			() => {
				this.handleOfLogin("虎别")
			},
		]
		let btns = []
		const onlines = getOnlinePlayers()
		const sideCount = Math.floor(titles.length / 2);
		const centerX = Screen_Width / 2
		const leftX = centerX - Btn_Width - 10
		const startY = Screen_Height / 2 - Btn_Height / 2 - sideCount * Btn_Height
		for (let i = 0; i < titles.length; i++) {
			const btn = createBtn(leftX, startY + i * Btn_Height, titles[i], blocks[i])
			btn.online = onlines[i]
			btn.unClickable = unClicks[i]
			btns.push(btn)
		}
		return btns
	}

	initRightBtns() {
		// 管理员会走另外的通道
		const localName = getLocalUserName()
		if (!localName || localName == "虎别") {
			return this.initGMRightBtns()
		}

		// 普通玩家
		let isInRoom = false 
		if (GameGlobal.databus.roomPlayers && GameGlobal.databus.userId) {
			const playerIds = GameGlobal.databus.roomPlayers
			const playerId = GameGlobal.databus.userId
			if (playerIds.includes(playerId)) {
				isInRoom = true
			}
		}
		const title = isInRoom ? "已准备" : "点击准备"
		const block = isInRoom ? this.handleOfOutRoom.bind(this) : this.handleOfJoinRoom.bind(this)

		const centerX = Screen_Width / 2
		const leftX = centerX + 10
		const y = Screen_Height / 2 - Btn_Height / 2
		const btn = createBtn(leftX, y, title, block)
		return [btn]
	}

	initGMRightBtns() {
		const titles = ["创建房间", "加入房间", "删除房间", "开始游戏", "删除游戏"]
		const blocks = []
		blocks[0] = this.handleOfCreatRoom.bind(this)
		blocks[1] = this.handleOfJoinRoom.bind(this)
		blocks[2] = this.handleOfDeleteRoom.bind(this)
		blocks[3] = this.handleOfCreateGame.bind(this)
		blocks[4] = this.handleOfDeleteGame.bind(this)

		let btns = []
		const sideCount = Math.floor(titles.length / 2);
		const centerX = Screen_Width / 2
		const leftX = centerX + 10
		const startY = Screen_Height / 2 - Btn_Height / 2 - sideCount * Btn_Height
		for (let i = 0; i < titles.length; i++) {
			const btn = createBtn(leftX, startY + i * Btn_Height, titles[i], blocks[i])
			btns.push(btn)
		}
		return btns
	}

	// 登录
	handleOfLogin(name) {
		showLoading(1)
		// 缓存用户名
		wx.setStorage({
			key: "userName",
			data: name
		})
		// 登陆
		cloud_login(name)
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
		cleanItems(this.leftBtns)
		cleanItems(this.rightBtns)
		if (this.needUpdate) {
			this.leftBtns = this.initLeftBtns()
			this.rightBtns = this.initRightBtns()
		} else {
			this.leftBtns = null
			this.rightBtns = null
		}
	}

	renderScene(ctx) {
		renderItems(this.leftBtns, ctx)
		renderItems(this.rightBtns, ctx)
	}

	handleOfSceneClick(x, y) {
		clickItems(this.leftBtns, x, y)
		clickItems(this.rightBtns, x, y)
	}

	// 重写这个方法，来显示状态信息
	getTipStrs() {
		let text4 = "当前无游戏"
		if (GameGlobal.databus && GameGlobal.databus.gameInfo) {
			text4 = "当前有游戏"
		}
		return [text4]
	}
}