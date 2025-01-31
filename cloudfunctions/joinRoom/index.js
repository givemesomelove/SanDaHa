// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({env: cloud.DYNAMIC_CURRENT_ENV}) // 使用当前云环境
const db = cloud.database();

// DB:清空房间列表
const db_deleteRooms = async() =>{
    try {
        await db.collection('room').where({
            "_id": db.command.neq("0")
        }).remove();
    } catch (err) {
        console.error(err);
    }
}

// DB:新建房间
const db_createRoom = async (userId) => {
    const roomData = {
        "name": "2栋1楼",
        "players": [userId], 
        "createStamp": Math.floor(Date.now() / 1000),
    }
    await db.collection('room').add({
        data: roomData
    });
    console.log("新建房间并将用户放入房间成功", userId)
}

//  DB:加入房间
const db_joinRoom = async (userId) => {
    const roomResult = await db.collection('room').limit(1).get()
    const roomRecord = roomResult.data[0];
    console.log("当前房间为："+roomRecord);
    // 将当前玩家加入房间
    let players = roomRecord.players;
    if (players) {
        if (players.includes(userId)) {
            return
        } else {
            players.push(userId);
        }
    } else {
        players = [userId]
    }
    await db.collection('room').doc(roomRecord._id).update({
        data: {
            "players": players
        }
    });
}

// 退出房间
const db_outRoom = async (userId) => {
    const roomResult = await db.collection('room').limit(1).get()
    const roomRecord = roomResult.data[0];
    console.log("当前房间为："+roomRecord);
    // 将当前玩家加入房间
    let players = roomRecord.players;
    if (players.includes(userId)) {
        players = players.filter(playerId => playerId !== userId);
        await db.collection('room').doc(roomRecord._id).update({
            data: {
                "players": players
            }
        });
    }
}

// 云函数入口函数
// event:
// userId: 用户id
// type:0清空房间并新建房间,1位加入房间,2清空房间列表,3创建新房间
exports.main = async (event, context) => {
    const type = event["type"];
    console.log('云函数收到数据：', event)
    switch (type) {
        case 0: {
            const userId = event["userId"];
            db_deleteRooms();
            db_createRoom(userId);
            break;   
        }
        case 1: {
            const userId = event["userId"];
            db_joinRoom(userId);
            break;
        }
        case 2:
            db_deleteRooms();
            break;
        case 3: {
            const userId = event["userId"];
            db_createRoom(userId);
            break;
        }
        case 4: {
            const userId = event["userId"];
            db_outRoom(userId);
            break;
        }
    }
    return { success: true }
}