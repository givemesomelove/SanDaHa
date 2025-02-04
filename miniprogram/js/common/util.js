export const GameStep = Object.freeze({
  Ready: '准备',
  CallScore: '叫分中',
  SelecBottomAndColor: '庄家埋底选主',
  PickCard: '出牌中',
  SelectWinner: '本轮谁赢',
  End: '游戏结束'
});

export const Seat = Object.freeze({
  Up: 'Up',
  Down: 'Down',
  Left: 'Left',
  Right: 'Right',
});

// 根据方位获取用户id
export const getUserId = seat => {
  const gameInfo = GameGlobal.databus.gameInfo
  const curUserId = GameGlobal.databus.userId
  let index = gameInfo.turnPlayers.indexOf(curUserId)
  if (seat == Seat.Left) {
    index += 1
  } else if (seat == Seat.Up) {
    index += 2
  } else if (seat == Seat.Right) {
    index += 3
  }
  index %= 4
  return gameInfo.turnPlayers[index]
}

// 根据用户id获取用户key
export const getUserKey = userId => {
  if (!GameGlobal.databus.gameInfo) return null

  const players = GameGlobal.databus.gameInfo.turnPlayers
  const index = players.indexOf(userId)
  return `player${index + 1}Info`
}

// 根据用户方位获取用户key
export const getUserKeyBySeat = seat => {
  const userId = getUserId(seat)
  const userKey = getUserKey(userId)
  return userKey
}

// 拼接图片地址
export const imgPath = name => {
  return "images/" + name + ".png";
}

export const makeImage = name => {
  let img = wx.createImage()
  img.src = imgPath(name)
  return img
}

export const headImage = seat => {
  const userId = getUserId(seat)
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

// 防抖，直到0.8秒后执行
export const debounce = func => {
  let timeout;
  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), 800);
  };
};

// 防抖，0.8秒内不重复执行
export const debounceImmediate = func => {
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
export const playerName = userId => {
  if (!GameGlobal.allPlayers) return "未知";

  for (const player of GameGlobal.allPlayers) {
    if (player._id == userId) {
      return player.name
    }
  }
  return "未知";
}

// 根据用户id列表获取用户名字列表
export const playerNames = userIds => {
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

// 根据用户id获取用户名字
export const userIdByName = name => {
  if (!GameGlobal.allPlayers) return null;

  for (const player of GameGlobal.allPlayers) {
    if (player.name == name) {
      return player._id
    }
  }
  return null;
}

// 时间戳转成字符串
export const Stamp2DateString = stamp => {
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

export const getCurStep = () => {
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

// 手牌按颜色分堆
export const cardSplits = (cards) => {
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

// 给卡牌排序
export const cardRanks = cardIds => {
  const ranks = GameGlobal.databus.ranks
  // 排序开始
  let results = cardIds.slice();
  results.sort((cardId1, cardId2) => {
    let index1 = ranks.indexOf(cardId1);
    let index2 = ranks.indexOf(cardId2);
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

// 卡牌列表是否相同
export const isCardsUpdate = (cardIds1, cardIds2) => {
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
export const removeItems = items => {
  if (!items || items.length == 0) return

  items.forEach(item => {
    item && item.remove()
  })
}

// 渲染整个数组的元素（元素必须要有render方法）
export const renderItems = (items, ctx) => {
  if (!items || items.length == 0) return

  items.forEach(item => {
    item && item.render(ctx)
  })
}

export const clickItems = (items, x, y) => {
  if (!items || items.length == 0) return

  items.forEach(item => {
    item && item.handleOfClick(x, y)
  })
}

export const updateItems = items => {
  if (!items || items.length == 0) return

  items.forEach(item => {
    item && item.update()
  })
}

// 是当前玩家操作吗
export const isFocuseMy = () => {
  if (!GameGlobal.databus.gameInfo ||
    !GameGlobal.databus.userId) return false

  return GameGlobal.databus.gameInfo.focusPlayer == GameGlobal.databus.userId
}

// 当前玩家是庄家吗
export const isEnemyMy = () => {
  if (!GameGlobal.databus.gameInfo ||
    !GameGlobal.databus.userId) return false

  return GameGlobal.databus.gameInfo.enemyPlayer == GameGlobal.databus.userId
}

// 当前玩家是管理员吗
export const isGMMy = () => {
  if (!GameGlobal.databus.userId) return false

  const userName = playerName(GameGlobal.databus.userId)
  return userName == "虎别"
}

// 获取主色编号对应字符串
export const colorName = (color) => {
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

// 获取当前在线玩家状态
export const getUserOnline = userId => {
  const roomPlayers = GameGlobal.databus.roomPlayers
  if (!roomPlayers) return false

  return roomPlayers.includes(userId)
}

// 获取本地缓存的用户名
export const getLocalUserId = () => {
  // return null
  try {
    const userId = wx.getStorageSync('userId')
    return userId
  } catch (e) {
    return null
  }
}

// 展示loading
export const showLoading = seconds => {
  wx.showLoading({
    title: '加载中',
  })
  setTimeout(function () {
    wx.hideLoading()
  }, seconds * 1000)
}

// 展示toast
export const tipToast = (text) => {
  wx.showToast({
    title: text,
    icon: 'error',
    mask: true
  })
}

// 打乱玩家座位
export const randomPlayers = (array) => {
  const newArray = [...array]; // 创建副本
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// 点是否在Rect中
export const isPointInFrame = (curX, curY, x, y, width, height) => {
  return (curX > x &&
    curX < x + width &&
    curY > y &&
    curY < y + height)
}

// 绘制圆角矩形
export const drawRoundRect = (ctx, x, y, width, height, radius, fillColor) => {
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

// 绘制不可点击按钮
export const drawBtnRoundRect = (ctx, x, y) => {
  const height = (Btn_Height - 35)
  const width = (Btn_Width - 25)
  const fixX = x - width / 2
  const fixY = y - height / 2
  drawRoundedRect(ctx, fixX, fixY, width, height, height / 2, '#FFA500')
}

// 绘制红色边框
export const drawRoundedRectBorder = (ctx, x, y, width, height, radius, borderColor) => {
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
