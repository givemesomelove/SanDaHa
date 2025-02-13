import { BottomCard_Top, Btn_Height, Btn_Width, Screen_Width, TurnShow_Bottom } from "../common/Defines";
import { cloud_SelectColor } from "../control/cloudFunc";
import Button from "./Button";
import Modal from "./Modal";
import SelectColor from "./selectColor";


export default class SceneColor extends Modal {
    constructor() {
        super()

        this.colorPicker = new SelectColor()

        const x = (Screen_Width - Btn_Width) / 2
		const y = TurnShow_Bottom + 16
		this.confirmBtn = new Button(x, y, "修改主色", this.handleOfClickConfirm.bind(this))

        this.updateSubItems()
    }

    handleOfClickConfirm() {
        this.confirmBtn.select = false
		// 判断是否选了主色
		const color = this.colorPicker.getCurSelectColor()
		if (color) {
			cloud_SelectColor(color)
        }
        this.handleOfClickBg()
    }

}