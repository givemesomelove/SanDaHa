// 拼接图片地址
const imgPath = name => {
  return "images/" + name + ".png";
}
exports.imgPath = imgPath

const makeImage = name => {
  let img = wx.createImage()
  img.src = imgPath(name)
  return img
}
exports.makeImg = makeImage

const headImg = userKey => {
  const userId = GameGlobal.databus.gameInfo[userKey].playerId
  const name = playerName(userId)
  let imageName = ""
  if (name == "谭别") {
    imageName = "tan"
  } else if (name == "西瓜别") {
    imageName = "gua"
  } else if (name == "鸟别") {
    imageName = "niao"
  } else if (name == "徐别") {
    imageName = "xu"
  } else if (name == "虎别") {
    imageName = "hu"
  }
  return makeImage(imageName)
}
exports.getHeadImg = headImg

const {
  Screen_Width,
  Screen_Height,
  Btn_Height,
  Btn_Width
} = require("./Defines");

// 防抖，直到0.8秒后执行
exports.debounce = func => {
  let timeout;
  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), 800);
  };
};

// 防抖，0.8秒内不重复执行
exports.debounceImmediate = func => {
  let timeout;
  let firstRun = true; // 标记是否是第一次运行
  return function (...args) {
    const context = this;
    if (firstRun) {
      func.apply(context, args); // 如果是第一次，立即执行
      firstRun = false; // 设置为非首次运行
    } else {
      clearTimeout(timeout); // 如果不是首次，则清除之前的定时器
    }
    timeout = setTimeout(() => {
      // 重置为可以再次立即执行的状态（如果需要的话）
      // 在这个例子中，我们不在这里重置 firstRun，因为我们想要一个 800ms 的冷却期
      // 但如果您想在冷却期后允许再次立即触发，您可以在这里添加 
      firstRun = true;
      // 不过，那将使它更像是一个循环的防抖/节流混合体，而不是您当前描述的需求。
    }, 800);
  };
};

// 根据用户id获取用户名字
const playerName = userId => {
  if (!GameGlobal.allPlayers) return "未知";

  for (const player of GameGlobal.allPlayers) {
    if (player["_id"] == userId) {
      return player["name"]
    }
  }
  return "未知";
}
exports.playerName = playerName

// 根据用户id列表获取用户名字列表
exports.playerNames = userIds => {
  if (!userIds) return "无";
  if (!GameGlobal.allPlayers) return "未知";

  let players = "";
  for (const userId of userIds) {
    for (const player of GameGlobal.allPlayers) {
      if (userId == player["_id"]) {
        players += player["name"] + ","
      }
    }
  }
  return players.slice(0, -1);
}

// 时间戳转成字符串
exports.Stamp2DateString = stamp => {
  if (!stamp) {
    return "无";
  }

  const date = new Date(stamp * 1000);

  // 补零函数
  function padZero(num) {
    return num < 10 ? '0' + num : num;
  }

  // 提取日期和时间部分
  const month = padZero(date.getMonth() + 1); // 月份从0开始，所以要加1
  const day = padZero(date.getDate());
  const hours = padZero(date.getHours());
  const minutes = padZero(date.getMinutes());
  const seconds = padZero(date.getSeconds());

  // 拼接成所需的格式
  return `${month}-${day} ${hours}:${minutes}:${seconds}`;
}

const GameStep = Object.freeze({
  Ready: '准备',
  CallScore: '叫分中',
  SelecBottomAndColor: '庄家埋底选主',
  PickCard: '出牌中',
  SelectWinner: '本轮谁赢',
  End: '游戏结束'
});
exports.GameStep = GameStep;

exports.getCurStep = () => {
  const gameInfo = GameGlobal.databus.gameInfo
  const userId = GameGlobal.databus.userId
  if (!gameInfo || !userId) {
    return GameStep.Ready
  } else if (gameInfo["step"] == 1) {
    return GameStep.CallScore
  } else if (gameInfo["step"] == 2) {
    return GameStep.SelecBottomAndColor
  } else if (gameInfo["step"] == 3) {
    return GameStep.PickCard
  } else if (gameInfo["step"] == 4) {
    return GameStep.SelectWinner
  } else if (gameInfo["step"] == 6) {
    return GameStep.End
  }
  return GameStep.Ready
}

// 下一位
exports.nextPlayer = (players, player) => {
  const index = players.indexOf(player);
  if (index === players.length - 1) {
    return players[0];
  }
  return players[index + 1];
}

const getMainColor = () => {
  let mainColor = 0
  if (GameGlobal.databus &&
    GameGlobal.databus.gameInfo &&
    GameGlobal.databus.gameInfo["mainColor"] != 0) {
    mainColor = GameGlobal.databus.gameInfo["mainColor"]
  }
  return mainColor
}
exports.getMainColor = getMainColor

// 手牌按颜色分堆
exports.cardSplits = (cards) => {
  const ranks = GameGlobal.databus.ranks

  let tmpCards = [
    [],
    [],
    [],
    [],
    []
  ]
  for (const card of cards) {
    const index = ranks.indexOf(card);
    if (index < 10) {
      tmpCards[0].push(card)
    } else if (index >= 10 && index < 18) {
      tmpCards[1].push(card)
    } else if (index >= 18 && index < 26) {
      tmpCards[2].push(card)
    } else if (index >= 26 && index < 34) {
      tmpCards[3].push(card)
    } else {
      tmpCards[4].push(card)
    }
  }
  let res = []
  for (const items of tmpCards) {
    if (items.length > 0) {
      res.push(items)
    }
  }
  return res;
}

exports.getRanks = () => {
  // 获取主色
  const mainColor = getMainColor()
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

// 给卡牌排序
exports.cardRanks = (cards) => {
  const ranks = GameGlobal.databus.ranks
  // 排序开始
  let results = cards.slice();
  results.sort((card1, card2) => {
    let index1 = ranks.indexOf(card1);
    let index2 = ranks.indexOf(card2);
    if (index1 < index2) {
      return -1;
    } else if (index1 > index2) {
      return 1;
    } else {
      return 0;
    }
  })
  return results
}

// 将牌的位置安排好
exports.orderLineCard = (cards, x, y, width) => {
  if (!cards) {
    return
  }

  // 根据宽度width平均分
  let itemWidth = width / cards.length
  itemWidth = Math.min(itemWidth, 36)
  for (let i = 0; i < cards.length; i++) {
    let card = cards[i]
    card.x = x + i * card.width / 2
    card.y = y
    card.configLine(x + i * itemWidth, y, itemWidth)
  }
}

// 卡牌列表是否相同
exports.isCardsUpdate = (cardIds1, cardIds2) => {
  if (!cardIds1 && !cardIds2) return false
  if (!cardIds1 && cardIds2) return true
  if (cardIds1 && !cardIds2) return true
  if (cardIds1.length != cardIds2.length) return true

  for (let i = 0; i < cardIds1.length; i++) {
    if (cardIds1[i] != cardIds2[i]) {
      return true
    }
  }
  return false
}

// 回收整个数组的复用池(元素必须要有remove方法)
exports.cleanItems = items => {
  if (!items || items.length == 0) return

  items.forEach(item => {
    if (item) item.remove()
  })
}

// 渲染整个数组的元素（元素必须要有render方法）
exports.renderItems = (items, ctx) => {
  if (!items || items.length == 0) return

  items.forEach(item => {
    if (item) item.render(ctx)
  })
}

// 画场景的背景图
exports.drawBg = (ctx, image) => {
  ctx.drawImage(image, 0, 0, Screen_Width, Screen_Height);
}

exports.clickItems = (items, x, y) => {
  if (!items || items.length == 0) return

  items.forEach(item => {
    if (item) item.handleOfClick(x, y)
  })
}

// 是当前玩家操作吗
exports.isFocuseMy = () => {
  if (!GameGlobal.databus ||
    !GameGlobal.databus.userId ||
    !GameGlobal.databus.gameInfo) return false

  return GameGlobal.databus.gameInfo.focusPlayer == GameGlobal.databus.userId
}

// 获取主色编号对应字符串
exports.colorName = (color) => {
  switch (color) {
    case 1:
      return "红桃"
    case 2:
      return "黑桃"
    case 3:
      return "梅花"
    case 4:
      return "方片"
  }
  return ""
}

// 获取当前在线玩家列表
exports.getOnlinePlayers = () => {
  const onlines = [false, false, false, false, false]
  if (!GameGlobal.databus || !GameGlobal.databus.roomPlayers) return onlines

  const playerIds = GameGlobal.databus.roomPlayers
  for (const playerId of playerIds) {
    const name = playerName(playerId)
    if (name == "谭别") {
      onlines[0] = true
    } else if (name == "西瓜别") {
      onlines[1] = true
    } else if (name == "鸟别") {
      onlines[2] = true
    } else if (name == "徐别") {
      onlines[3] = true
    } else if (name == "虎别") {
      onlines[4] = true
    }
  }
  return onlines
}

exports.getLocalUserName = () => {
  // return null
  try {
    const name = wx.getStorageSync('userName')
    return name
  } catch (e) {
    return null
  }
}

// 绘制圆角矩形
const drawRoundedRect = (ctx, x, y, width, height, radius, fillColor) => {
  ctx.beginPath();
  // 绘制圆角路径
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius); // 右上角
  ctx.arcTo(x + width, y + height, x, y + height, radius); // 右下角
  ctx.arcTo(x, y + height, x, y, radius); // 左下角
  ctx.arcTo(x, y, x + width, y, radius); // 左上角
  ctx.closePath();
  // 填充颜色
  ctx.fillStyle = fillColor;
  ctx.fill();
}
exports.drawRoundedRect = drawRoundedRect

// 绘制不可点击按钮
exports.drawBtnRoundRect = (ctx, x, y) => {
  const height = (Btn_Height - 35)
  const width = (Btn_Width - 25)
  const fixX = x - width / 2
  const fixY = y - height / 2
  drawRoundedRect(ctx, fixX, fixY, width, height, height / 2, '#FFA500')
}

// 绘制红色边框
exports.drawRoundedRectBorder = (ctx, x, y, width, height, radius, borderColor) => {
  ctx.beginPath();
  // 绘制圆角路径
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius); // 右上角
  ctx.arcTo(x + width, y + height, x, y + height, radius); // 右下角
  ctx.arcTo(x, y + height, x, y, radius); // 左下角
  ctx.arcTo(x, y, x + width, y, radius); // 左上角
  ctx.closePath();
  // 设置边框颜色
  ctx.strokeStyle = borderColor;
  // 设置边框宽度（可选）
  ctx.lineWidth = 1; // 您可以根据需要调整边框宽度
  // 绘制边框
  ctx.stroke();
}

exports.showLoading = seconds => {
  wx.showLoading({
    title: '加载中',
  })
  setTimeout(function () {
    wx.hideLoading()
  }, seconds * 1000)
}

exports.tipToast = (text) => {
  wx.showToast({
    title: text,
    icon: 'error',
    mask: true
  })
}

exports.randomPlayers = (array) => {
  const newArray = [...array]; // 创建副本
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

exports.isPointInFrame = (curX, curY, x, y, width, height) => {
  return (curX > x &&
    curX < x + width &&
    curY > y &&
    curY < y + height)
}

exports.getUserKeyByUserId = userId => {
  if (!GameGlobal.databus ||
    !GameGlobal.databus.gameInfo) return null
  if (userId == GameGlobal.databus.gameInfo.player1Info.playerId) {
    return "player1Info"
  } else if (userId == GameGlobal.databus.gameInfo.player2Info.playerId) {
    return "player2Info"
  } else if (userId == GameGlobal.databus.gameInfo.player3Info.playerId) {
    return "player3Info"
  } else if (userId == GameGlobal.databus.gameInfo.player4Info.playerId) {
    return "player4Info"
  }
  return null
}

exports.isCardInfoGetted = () => {
    return GameGlobal.cardList ? true : false
}

