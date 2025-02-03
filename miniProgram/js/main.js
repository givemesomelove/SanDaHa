import Prepare from "./prepare"
import { renderItems, updateItems } from "./common/util"
import SceneReady from "./scene/sceneReady"
import SceneCallScore from "./scene/sceneCallScore"
import SceneBottomAColor from "./scene/sceneBottomAndColor"
import ScenePickCard from "./scene/scenePickCard"

/**
 * 游戏主函数
 */
export default class Main {
    aniId = 0; // 用于存储动画帧的ID

    constructor() {
        this.prepare = new Prepare(
            this.handleOfRoomChanged.bind(this),
            this.handleOfGameChanged.bind(this),
        )
        // 画布
        this.canvas = GameGlobal.canvas
        this.ctx = canvas.getContext('2d');
        
        GameGlobal.databus.loginBlock = this.handleOfLogin.bind(this)

        this.initScene()
        // 开始游戏
        this.start();
    }

    // 初始化场景
    initScene() {
        this.readyScene = new SceneReady()
        this.callScoreScene = new SceneCallScore()
        this.bottomAndColorScene = new SceneBottomAColor()
        this.pickCardScene = new ScenePickCard()
        // this.selectWinScene = new SceneSelectWin()
        // this.endScene = new SceneEnd()
        this.scenes = [this.readyScene, this.callScoreScene, this.bottomAndColorScene, this.pickCardScene]
    }

    /**
     * 开始或重启游戏
     */
    start() {
        cancelAnimationFrame(this.aniId); // 清除上一局的动画
        this.aniId = requestAnimationFrame(this.loop.bind(this)); // 开始新的动画循环
    }

    // 实现游戏帧循环
    loop() {
        this.render(); // 渲染游戏画面
        // 请求下一帧动画
        this.aniId = requestAnimationFrame(this.loop.bind(this));
    }

    /**
     * canvas重绘函数
     * 每一帧重新绘制所有的需要展示的元素
     */
    render() {
        this.ctx.clearRect(0, 0, GameGlobal.canvas.width, GameGlobal.canvas.height); // 清空画布

        renderItems(this.scenes, this.ctx)
    }

    // 游戏逻辑更新主函数
    update() {
        updateItems(this.scenes)
    }

    handleOfRoomChanged = data => {
        GameGlobal.databus.updateRoomData(data)
        this.update()
    }

    handleOfGameChanged = data => {
        GameGlobal.databus.updateGameData(data)
        this.update()
    }

    handleOfLogin = userId => {
        this.update()
    }
}