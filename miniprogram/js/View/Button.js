import { Btn_Height, Btn_Width } from "../common/Defines";
import { makeImage } from "../common/util";
import Item from "./item";


export default class Button extends Item {
	constructor(x, y, text, clickBlock) {
		super()

		this.x = x
		this.y = y
		this.image = makeImage("scene1_btn")
		this.width = Btn_Width
		this.height = Btn_Height
		this.text = text
		this.textColor = 'white'
		this.selectBlock = clickBlock
	}
}