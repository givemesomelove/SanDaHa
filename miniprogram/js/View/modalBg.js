/*
	全屏蒙层的背景
*/

import { Btn_Width, menuFrame } from "../common/Defines";
import { isPointInFrame } from "../common/util";
import Button from "./Button";
import Item from "./item";

const Screen_Width = GameGlobal.canvas.width
const Screen_Height = GameGlobal.canvas.height

export default class ModalBg extends Item {
	constructor() {
		super()

		this.x = 0
		this.y = 0
		this.width = Screen_Width
		this.height = Screen_Height
		this.bgColor = "rgba(0, 0, 0, 0.7)"
		// this.selectBlock = this.handleOfClickBg.bind(this)
        this.btns = []
        
        this.backBtn = new Button(Screen_Width - 16 - Btn_Width, menuFrame.bottom + 8, "返回", this.handleOfClickBg.bind(this))
	}

	handleOfClickBg() {
		this.setActive(false)
    }

    setActive(active) {
        super.setActive(active)

        this.backBtn.setActive(active)
    }
    
    render(ctx) {
        super.render(ctx)

        this.backBtn.render(ctx)
    }
}