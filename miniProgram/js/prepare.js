import Pool from './base/pool';
import DataBus from './control/databus';
import tinyemitter from './libs/tinyemitter';

GameGlobal.imgs = {}

// 获取canvas的2D绘图上下文;
GameGlobal.canvas = wx.createCanvas();

// 创建复用池
GameGlobal.pool = new Pool();

// 全局数据管理，用于管理游戏状态和数据
GameGlobal.databus = new DataBus();

// 全局发送监听指挥部
GameGlobal.emitter = new tinyemitter()

// 全局音乐管理
// GameGlobal.musicManager = new Music();

export default class Prepare {
	constructor(roomChangedBlock, gameChangedBlock) {
		this.gameChangedBlock = gameChangedBlock
		this.roomChangedBlock = roomChangedBlock

		// 读取卡牌列表
		this.readCardListFile()

		wx.cloud.init({
			env: wx.cloud.dynamicCurrentEnv
		});
		const db = wx.cloud.database();
		// 从云端读取数据库
		this.loadDbData(db)
		// 监控数据库
		this.maxRoomWatchRetryTimes = 10
		this.maxGameWatchRetryTimes = 10
		this.startRoomWatching(db)
		this.startGameWatching(db)

		this.loadExtraImg()
	}

	// 读取卡牌列表
	readCardListFile = () => {
		const fs = wx.getFileSystemManager();

		// 最佳实践方案
		fs.readFile({
			filePath: 'js/card.json',
			encoding: 'utf8',
			success(res) {
				try {
					// 完整处理流程
					const jsonArray = res.data
						.split('\n') // 分割行
						.map(line => line.trim()) // 去除首尾空格
						.filter(Boolean) // 过滤空行
						.map(line => {
							try {
								return JSON.parse(line); // 逐行解析
							} catch (e) {
								console.warn('解析失败的行:', line);
								return null;
							}
						})
						.filter(item => item !== null); // 过滤解析失败项
					console.log("解析卡牌列表成功", jsonArray)
					// 缓存本地卡牌信息
					GameGlobal.cardList = jsonArray
					// 预加载卡牌图片
					for (const card of jsonArray) {
						const imv = wx.createImage()
						const imgName = card["img"]
						imv.src = "images/" + imgName
						GameGlobal.imgs[imgName] = imv
					}
				} catch (err) {
					console.error("全局解析错误:", err);
					wx.showToast({
						title: '卡牌数据加载失败'
					});
				}
			},
			fail(err) {
				console.error("文件读取失败:", err);
			}
		});
	}

	// 读取云端数据表
	loadDbData(db) {
		// 读取用户表

		db.collection('user').get().then(res => {
			console.log("用户表读取成功:", res.data);
			GameGlobal.allPlayers = res.data;
			if (this.roomChangedBlock) this.roomChangedBlock
		}).catch(err => {
			console.log("用户表读取失败:", err);
		});
	}

	// 封装房间监听方法
	startRoomWatching = db => {
		// 创建新监听
		db.collection('room').limit(1).watch({
			onChange: snapshot => {
				console.log('监听到房间数据表变化', snapshot.docs);
				// GameGlobal.databus.updateRoomData(snapshot.docs[0])
				if (this.roomChangedBlock) this.roomChangedBlock(snapshot.docs[0])
			},
			onError: err => {
				if (--this.maxRoomWatchRetryTimes > 0) {
					console.log('监听房间失败,重试(' + this.maxRoomWatchRetryTimes + ')')
					setTimeout(() => this.startRoomWatching(db), 500)
				}
			}
		});
	}

	// 封装游戏监听方法
	startGameWatching = db => {
		// 创建新监听
		db.collection('game').limit(1).watch({
			onChange: snapshot => {
				console.log('监听到游戏数据表变化', snapshot.docs);
				if (this.gameChangedBlock) this.gameChangedBlock(snapshot.docs[0])
			},
			onError: err => {
				if (--this.maxGameWatchRetryTimes > 0) {
					console.log('监听游戏失败,重试(' + this.maxGameWatchRetryTimes + ')')
					setTimeout(() => this.startGameWatching(db), 500)
				}
			}
		});
	}

	// 额外准备的图片
	loadExtraImg() {
		const names = ["color_1", "color_2", "color_3", "color_4", "color_5"]
		for (const name of names) {
			const imv = wx.createImage()
			const path = "images/" + name + ".png"
			imv.src = path
			GameGlobal.imgs[name] = imv
		}
	}
}