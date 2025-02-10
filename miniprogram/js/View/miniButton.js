import { Btn_Height, Btn_M_Height, Btn_M_Wdith, Btn_Width } from "../common/Defines";
import { makeImage } from "../common/util";
import Item from "./item";


export default class MiniButton extends Item {
	constructor(x, y, text, clickBlock) {
		super()

		this.x = x
		this.y = y
		this.image = makeImage("scene1_btn")
		this.width = Btn_M_Wdith
		this.height = Btn_M_Height
		this.text = text
		this.textColor = 'white'
        this.selectBlock = clickBlock
        this.active = true
        this.enable = true
	}
}