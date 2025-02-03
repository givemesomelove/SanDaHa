const { getUserKeyBySeat, Seat } = require("../common/util");

// 调用云函数
const cloudFunc = ({
    name,
    data,
    success,
    fail,
    end
}) => {
    wx.cloud.callFunction({
        name: name,
        data: data,
        success: res => {
            console.log('云函数' + name + '调用成功,得到结果:');
            console.log(res.result);
            if (success) {
                success(res.result)
            };
            if (end) {
                end()
            };
        },
        fail: err => {
            console.error('云函数' + name + '调用失败，原因:' + err);
            if (fail) {
                fail(err)
            };
            if (end) {
                end()
            };
        },
    })
};
exports.cloudFunc = cloudFunc

// 登录
exports.cloud_login = name => {
	const data = {
		"name": name
	};
	cloudFunc({
		name: "myLogin",
		data: data,
		success: result => {
			GameGlobal.databus.updateLogin(result["userId"], name);
		}
	})
}

// 创建房间
exports.cloud_createRoom = () => {
	const data = {
		"type": 3,
		"userId": GameGlobal.databus.userId
	};
	cloudFunc({
		name: "joinRoom",
		data: data,
	})
}

// 删除房间
exports.cloud_deleteRoom = () => {
	const data = {
		"type": 2,
	};
	cloudFunc({
		name: "deleteRoom",
		data: data,
	})
}

// 加入房间
exports.cloud_joinRoom = () => {
	const data = {
		"type": 1,
		"userId": GameGlobal.databus.userId
	}
	cloudFunc({
		name: "joinRoom",
		data: data
	})
}

// 退出房间
exports.cloud_outRoom = () => {
	const data = {
		"type": 4,
		"userId": GameGlobal.databus.userId
	}
	cloudFunc({
		name: "joinRoom",
		data: data
	})
}

// 开始游戏
exports.cloud_startGame = (players) => {
	const data = {
		"type" : 3,
		"players" : players
	}
	cloudFunc({
		name : "createGame",
		data : data
	})
}

// 删除游戏
exports.cloud_deleteGame = () => {
	const data = {
		"type" : 1,
	}
	cloudFunc({
		name : "createGame",
		data : data
	})
}

// 叫分选庄
exports.cloud_callScore = (userId, score) => {
	const data = {
		"type": 4,
		"userId": userId,
		"score": score
	}
	cloudFunc({
		name: "createGame",
		data: data,
	})
}

// 庄家埋底选色
exports.cloud_bottomAColor = (color, bottomCardIds) => {
	const data = {
		"type" : 5,
		"cards" : bottomCardIds,
		"userKey" : getUserKeyBySeat(Seat.Down),
		"color" : color
	}
	cloudFunc({
		name: "createGame",
		data: data
	})
}

// 出牌
exports.cloud_pickCard = (cardIds) => {
	const data = {
		"type" : 6,
		"cards" : cardIds, 
		"userKey" : GameGlobal.databus.userKey,
		"userId" : GameGlobal.databus.userId
	}
	cloudFunc({
		name: "createGame",
		data: data
	})
}

// 选谁赢
exports.cloud_pickWin = userId => {
	const data = {
		"type" : 7,
		"userId" : userId
	}
	cloudFunc({
		name: "createGame",
		data: data
	})
}