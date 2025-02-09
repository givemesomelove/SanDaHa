/*
    场景的基类
 */

import { menuFrame, Screen_Height, Screen_Width } from "../common/Defines";
import { getCurStep, makeImage } from "../common/util";
import Item from "./item";
import Label from "./label";

export default class Scene extends Item {
    constructor() {
        super()
        this.x = 0
        this.y = 0
        this.width = Screen_Width
        this.height = Screen_Height
        this.enable = true
        // 添加点击事件
        this.initEvent()

        this.step = null
        this.bgImage = null

        this.stepLab = new Label(this.width / 2, (menuFrame.top + menuFrame.bottom) / 2, "", 'black')
    }

    update() {
        const step = getCurStep()
        this.active = this.step == step
        super.update()
    }
}
