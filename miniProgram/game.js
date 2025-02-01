import Main from './js/main';

wx.cloud.init({ env: wx.cloud.dynamicCurrentEnv });
const db = wx.cloud.database();


// 读取卡牌列表
const fs = wx.getFileSystemManager();
fs.readFile({
    filePath: 'js/card.json',
    encoding: 'utf8',
    success(res) {
        let cardList = JSON.parse(res.data);
        for (let i = 0; i < cardList.length; i ++) {
            let card = cardList[i];
            const imv = wx.createImage();
            imv.src = "images/"+card["img"];
            card["imv"] = imv;
            cardList[i] = card;
        }
        GameGlobal.cardList = cardList;
        console.log("读取本地卡片列表成功");
    },
    fail(res) {
        console.error(res)
    }
})

// 读取用户表
db.collection('user').get().then(res => {
    console.log("用户表读取成功:", res.data);
    GameGlobal.allPlayers = res.data;
}).catch(err => {
    console.log("用户表读取失败:", err);
});

new Main();
