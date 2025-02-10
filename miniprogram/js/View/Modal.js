/*
	全屏蒙层的背景基类
*/

import { Screen_Height, Screen_Width } from "../common/Defines";
import { GameStep, getCurStep } from "../common/util";
import Item from "./item";
import SetBtn from "./topLeftBtn";



export default class Modal extends Item {
	constructor() {
		super()
		
		this.x = 0
		this.y = 0
		this.width = Screen_Width
		this.height = Screen_Height
		this.bgColor = "rgba(0, 0, 0, 0.7)"
		
        this.backBtn = new SetBtn(0, this.handleOfClickBg.bind(this), 'back')
        this.dismissBlock = null
		this.enable = true

        this.updateSubItems()
        this.initEvent()
	}

	handleOfClickBg = () => {
        this.active = false
        if (this.dismissBlock) this.dismissBlock()
    }

    setActive(dismissBlock) {
		this.active = true
		this.dismissBlock = dismissBlock
	}
}