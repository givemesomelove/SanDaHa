import Music from './runtime/music'; // 导入音乐类
import DataBus from './databus'; // 导入数据类，用于管理游戏状态和数据
import {
    Screen_Height,
    Screen_Width
} from './Defines';
import SceneReady from './scene/sceneReady';
import SceneCallScore from './scene/sceneCallScore';
import SceneBottomAColor from './scene/sceneBottomAndColor';
import ScenePickCard from './scene/scenePickCard';
import ScenePickWin from './scene/sceneSelectWin';
import SceneEnd from './scene/sceneEnd';
import Prepare from './prepare';

/**
 * 游戏主函数
 */
export default class Main {
    aniId = 0; // 用于存储动画帧的ID
    sceneReady = new SceneReady();
    sceneCallScore = new SceneCallScore();
    sceneBottomAColor = new SceneBottomAColor();
    scenePickCard = new ScenePickCard();
    scenePickWin = new ScenePickWin();
    sceneEnd = new SceneEnd();

    constructor() {
        this.prepare = new Prepare()

        GameGlobal.databus = new DataBus(); // 全局数据管理，用于管理游戏状态和数据
        this.update = this.update.bind(this);
        GameGlobal.databus.updateBlock = this.update;
        GameGlobal.musicManager = new Music(); // 全局音乐管理实例

        // 开始游戏
        this.start();
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
        ctx.clearRect(0, 0, Screen_Width, Screen_Height); // 清空画布

        this.sceneReady.render(ctx)
        this.sceneCallScore.render(ctx)
        this.sceneBottomAColor.render(ctx)
        this.scenePickCard.render(ctx)
        this.scenePickWin.render(ctx)
        this.sceneEnd.render(ctx)
    }

    // 游戏逻辑更新主函数
    update() {
        this.sceneReady && this.sceneReady.update()
        this.sceneCallScore && this.sceneCallScore.update()
        this.sceneBottomAColor && this.sceneBottomAColor.update()
        this.scenePickCard && this.scenePickCard.update()
        this.scenePickWin && this.scenePickWin.update()
        this.sceneEnd && this.sceneEnd.update()
    }
}