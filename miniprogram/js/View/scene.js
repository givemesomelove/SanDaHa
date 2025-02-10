/*
    场景的基类
 */

import { menuFrame, Screen_Height, Screen_Width } from "../common/Defines";
import { curColorImage, getCurStep, getScoreStr, makeImage } from "../common/util";
import Item from "./item";
import Label from "./label";
import ModalBg from "./sceneSetting";
import SetBtn from "./topLeftBtn";

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
        this.SetBtn = new SetBtn(0, this.handleOfClickSetting, 'settings')
		this.historyBtn = new SetBtn(1, this.handleOfClickHistory, 'history')
		this.mainColorBtn = new SetBtn(2, null, null)

		const x = 16 + 4 * 25 + 8
		this.scoreLab = new Label(x, (menuFrame.top + menuFrame.bottom) / 2, "", 'black')
    }

    handleOfModalBgDismiss = () => {
        this.enable = true
    }

    handleOfClickSetting = () => {
		GameGlobal.setPage.setActive(this.handleOfModalBgDismiss)
        this.enable = false
    }

    handleOfClickHistory = () => {
        GameGlobal.historyPage.setActive(this.handleOfModalBgDismiss)
        this.enable = false
    }

    update() {
        const step = getCurStep()
		this.active = this.step == step
		
		const colorImage = curColorImage()
		this.mainColorBtn.image = colorImage ? colorImage : null
		this.scoreLab.text = getScoreStr()
        super.update()
    }
}
