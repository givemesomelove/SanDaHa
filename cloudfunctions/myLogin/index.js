// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({env: cloud.DYNAMIC_CURRENT_ENV}) // 使用当前云环境
const db = cloud.database();

// 云函数入口函数
// 需要传入名字name
exports.main = async (event, context) => {
    console.log("接收数据")

    const wxContext = cloud.getWXContext();
    const name = event["name"];
    const openId = wxContext.OPENID;
    // 根据name查询user表中name为当前name的记录，将openId写入当前记录，并查询当前记录的id
    const userResult = await db.collection('user').where({
        name: name
    }).get();
    const userRecord = userResult.data[0];
    // 更新当前记录的openId字段
    await db.collection('user').doc(userRecord["_id"]).update({
        data: {
            openId: openId
        }
    });

    // 返回当前记录的id
    return {
        success: true,
        userId: userRecord["_id"],
        message: '登录成功',
      };
}