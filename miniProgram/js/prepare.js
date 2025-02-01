import Pool from './base/pool';

export default class Prepare {
	constructor() {
		// 获取canvas的2D绘图上下文;
		const canvas = wx.createCanvas();
		GameGlobal.ctx = canvas.getContext('2d');

		// 创建复用池
		GameGlobal.pool = new Pool();

		// 读取卡牌列表
		const fs = wx.getFileSystemManager();
		fs.readFile({
			filePath: 'js/card.json',
			encoding: 'utf8',
			success(res) {
				console.log("卡牌列表读取成功:" + res)
			}
		})

		// 从云端读取数据库
		// wx.cloud.init({ env: wx.cloud.dynamicCurrentEnv });
		// const db = wx.cloud.database();

		
	}


}







