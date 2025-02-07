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
	cloud_randPlayers,
	cloud_startGame
} from "../control/cloudFunc";
import BigIcon from "../View/bigIcon";
import { createBtn } from "../View/btn";
import Item from "../View/item";

import Scene from "./scene"

export default class SceneReady extends Scene {
	constructor() {
		super()
		this.bgImage = makeImage("sceneBg_2")
		this.sceneStep = GameStep.Ready
		
        this.icons = this.initHeadIcon()
    }

	initHeadIcon() {
		let icons = []
		for (let i = 0; i < 4; i ++) {
			const icon = new BigIcon(i)
			icons.push(icon)
		}
		return icons
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

		const x = this.width - Btn_Width - 32
		const y = this.height - Btn_Height - 100
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
		const titles = []
		const blocks = []

		// 删除、创建房间
		if (GameGlobal.databus.roomStamp) {
			titles.push("删除房间")
			blocks.push(this.handleOfDeleteRoom.bind(this))
		} else {
			titles.push("创建房间")
			blocks.push(this.handleOfCreatRoom.bind(this))
		}
		// 退出、加入房间
		const userId = GameGlobal.databus.userId
		const online = getUserOnline(userId)
		if (online) {
			titles.push("退出房间")
			blocks.push(this.handleOfOutRoom.bind(this))
		} else {
			titles.push("加入房间")
			blocks.push(this.handleOfJoinRoom.bind(this))
		}
		// 开始、删除游戏 
		if (GameGlobal.databus.gameInfo) {
			titles.push("删除游戏")
			blocks.push(this.handleOfDeleteRoom.bind(this))
		} else {
			titles.push("开始游戏")
			blocks.push(this.handleOfCreateGame.bind(this))
		}

		// 打乱玩家顺序
		titles.push("打乱顺序")
		blocks.push(this.handleOfRandRoom.bind(this))

		let btns = []
		const sideCount = Math.floor(titles.length / 2);
		const x = this.width - Btn_Width - 32
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

	// 打乱玩家顺序
	handleOfRandRoom() {
		if (!this.checkLoginState()) return;

		let players = GameGlobal.databus.roomPlayers
		players = randomPlayers(players)
		cloud_randPlayers(players)
	}

	// 开始游戏
	handleOfCreateGame() {
		if (!this.checkLoginState()) return;

		if (GameGlobal.databus.roomPlayers.length < 4) {
			tipToast("人数不够")
		}

		let players = GameGlobal.databus.roomPlayers
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
		// 在线用户
		if (GameGlobal.databus.roomStamp && GameGlobal.databus.roomPlayers) {
			const userIds = GameGlobal.databus.roomPlayers
			this.icons.forEach((item, index) => {
				item.config(userIds[index]);
			});
		} else {
			this.icons.forEach(item => item.config(null))
		}
		// 加载按钮
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
	}

	renderScene(ctx) {
		renderItems(this.icons, ctx)
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