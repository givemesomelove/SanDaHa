import Pool from './base/pool';
import nextPlayer, { cardRanks, getRanks } from './util';

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

        this.userName = null;
        this.userId = null;
        this.roomCreateStamp = null;
        this.roomPlayers = null;
        this.gameInfo = null;
        this.userKey = null;
        // 对局内
        this.leftKey = null;
        this.rightKey = null;
        this.upKey = null;
        // 玩家手牌
        this.handCards = null;
        this.leftHandCards = null;
        this.upHandCards = null;
        this.rightHandCards = null;
        // 当前排序策略
        this.ranks = getRanks();
        this.updateBlock = null;

        // 监听房间变化
        startRoomWatch = () => {
            this.roomWatch = db.collection('room').limit(1).watch({
                onChange: snapshot => {
                    console.log('监听到房间数据表变化', snapshot.docs)
                    this.handleOfRoomEvent(snapshot.docs[0]);
                },
                onError: err => {
                    console.error('the watch closed because of error', err);
                    // 错误发生后，延迟一段时间后重试启动监听
                    setTimeout(() => {
                        startRoomWatch.call(this); // 使用 call 保留 this 的上下文
                    }, 500); // 延迟时间，可以根据需要调整
                }
            });
        }
        startRoomWatch.call(this)

        // 监听游戏变化
        startGameWatch = () => {
            this.gameWatch = db.collection('game').limit(1).watch({
                onChange: snapshot => {
                    console.log('监听到房间数据表变化', snapshot.docs)
                    this.handleOfGameEvent(snapshot.docs[0]);
                },
                onError: err => {
                    console.error('the watch closed because of error', err);
                    // 错误发生后，延迟一段时间后重试启动监听
                    setTimeout(() => {
                        gameWatch.call(this); // 使用 call 保留 this 的上下文
                    }, 500); // 延迟时间，可以根据需要调整
                }
            });
        }
        startGameWatch.call(this)

        // 房间数据变化
        handleOfRoomEvent = data => {
            if (data && data["createStamp"]) {
                this.roomCreateStamp = data["createStamp"];
            } else {
                this.roomCreateStamp = null;
            }

            if (data && data["players"]) {
                this.roomPlayers = data["players"];
            } else {
                this.roomPlayers = null;
            }
            if (this.updateBlock) this.updateBlock()
        }

        updateLogin(userId, userName) {
            this.userId = userId
            this.userName = userName
            this.handleOfGameEvent(this.gameInfo)
        }

        // 游戏数据变化
        handleOfGameEvent = data => {
            this.gameInfo = data ? data : null

            if (this.userId && data) {
                // 排序策略
                this.ranks = getRanks()

                const players = this.gameInfo["turnPlayers"]
                // 当前玩家 
                let curIndex = players.indexOf(this.userId)
                this.userKey = "player" + (++curIndex) + "Info"

                let cards = this.gameInfo[this.userKey]["handCards"]
                this.handCards = cardRanks(cards)
                // 左边的玩家
                curIndex = curIndex >= players.length ? 0 : curIndex
                this.leftKey = "player" + (++curIndex) + "Info"

                let leftCards = this.gameInfo[this.leftKey]["handCards"]
                this.leftHandCards = cardRanks(leftCards)
                // 上面的玩家
                curIndex = curIndex >= players.length ? 0 : curIndex
                this.upKey = "player" + (++curIndex) + "Info"

                let upCards = this.gameInfo[this.upKey]["handCards"]
                this.upHandCards = cardRanks(upCards)
                // 右边的玩家
                curIndex = curIndex >= players.length ? 0 : curIndex
                this.rightKey = "player" + (++curIndex) + "Info"

                let rightCards = this.gameInfo[this.rightKey]["handCards"]
                this.rightHandCards = cardRanks(rightCards)
            }

            if (this.updateBlock) this.updateBlock()
        }
    }
