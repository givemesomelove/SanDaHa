let instance;

/**
 * 全局状态管理器
 * 负责管理游戏的状态，包括帧数、分数、子弹、敌人和动画等
 */
export default class DataBus {
    constructor() {
        // 确保单例模式
        if (instance) return instance;
        instance = this;

        this.userId = null;
        // 房间信息
        this.roomPlayers = [];
        this.roomStamp = null;
        // 游戏信息
        this.gameInfo = null;
        // 当前排序策略
        this.ranks = this.getRanks(1);

		this.loginBlock = null
    }

    // 游戏数据变化
    updateGameData = data => {
        this.gameInfo = data ? data : null
        if (!this.userId || !data) return
        // 排序策略
        this.ranks = this.getRanks(data.mainColor)
    }

    // 游戏房间变化
    updateRoomData = data => {
        if (data && data.players) {
            this.roomPlayers = data.players;
            this.roomStamp = data.createStamp;
        } else {
            this.roomPlayers = null;
            this.roomStamp = null;
        }
    }

    // 用户登陆状态变化
    updateLogin = userId => {
        // 缓存用户名
		wx.setStorageSync('userId', userId);
        this.userId = userId
        this.updateGameData(this.gameInfo)
        this.loginBlock && this.loginBlock()
    }

    // 根据主色获取排序策略
    getRanks = mainColor => {
        const isDefault = mainColor == 0 || mainColor == 5 || mainColor == 1
        // 大小王
        let ranks = [54, 53]
        // 四个七
        let card7s = [7, 20, 33, 46]
        if (!isDefault) {
            const value = card7s.splice(mainColor - 1, 1)[0];
            card7s.unshift(value);
        }
        ranks = ranks.concat(card7s)
        // 四个2
        let card2s = [2, 15, 28, 41]
        if (!isDefault) {
            const value = card2s.splice(mainColor - 1, 1)[0];
            card2s.unshift(value);
        }
        ranks = ranks.concat(card2s)
        // 红桃\黑桃\梅花\梅花
        const cardHearts = [1, 13, 12, 11, 10, 9, 8, 5]
        const cardSpades = [14, 26, 25, 24, 23, 22, 21, 18]
        const cardClubs = [27, 39, 38, 37, 36, 35, 34, 31]
        const cardDiamonds = [40, 52, 51, 50, 49, 48, 47, 44];
        if (isDefault) {
            ranks = ranks.concat(cardHearts)
            ranks = ranks.concat(cardSpades)
            ranks = ranks.concat(cardClubs)
            ranks = ranks.concat(cardDiamonds)
        } else if (mainColor == 2) {
            ranks = ranks.concat(cardSpades)
            ranks = ranks.concat(cardHearts)
            ranks = ranks.concat(cardClubs)
            ranks = ranks.concat(cardDiamonds)
        } else if (mainColor == 3) {
            ranks = ranks.concat(cardClubs)
            ranks = ranks.concat(cardHearts)
            ranks = ranks.concat(cardSpades)
            ranks = ranks.concat(cardDiamonds)
        } else if (mainColor == 4) {
            ranks = ranks.concat(cardDiamonds)
            ranks = ranks.concat(cardHearts)
            ranks = ranks.concat(cardSpades)
            ranks = ranks.concat(cardClubs)
        }
        return ranks
	}
	
	startWatchMode = () => {
		if (!this.roomPlayers || !this.userId) return
		const players = this.roomPlayers
		if (players.includes(this.userId) || players.length < 4) {
			return false
		}

		// 开始观战
		this.userId = this.roomPlayers[0]
		this.updateGameData(this.gameInfo)
		this.loginBlock && this.loginBlock()
		return true
	}

	exitWatchMode = () => {
		// 缓存用户名
		this.userId = wx.getStorageSync('userId')
		this.updateGameData(this.gameInfo)
		this.loginBlock && this.loginBlock()
	}

	watchNext = () => {
		let index = this.roomPlayers.findIndex(item => item == this.userId)
		index = index == 3 ? 0 : index + 1
		this.userId = this.roomPlayers[index]
		this.updateGameData(this.gameInfo)
        this.loginBlock && this.loginBlock()
	}

	watchLast = () => {
		let index = this.roomPlayers.findIndex(item => item == this.userId)
		index = index == 0 ? 3 : index - 1
		this.userId = this.roomPlayers[index]
		this.updateGameData(this.gameInfo)
        this.loginBlock && this.loginBlock()
	}
}
