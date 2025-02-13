/**
 *  观战模式的蒙层
 */

import { Btn_Height, Btn_M_Wdith, Btn_Width, Screen_Width, TurnShow_Bottom } from "../common/Defines";
import Button from "./Button";
import MiniButton from "./miniButton";
import Modal from "./Modal";

 export default class SceneWatch extends Modal {
	 constructor() {
		 super()

		 this.bgColor = "rgba(0, 0, 0, 0.2)"

		 this.nextBtn = new MiniButton(
			 Screen_Width - 16 - Btn_M_Wdith, 
			 TurnShow_Bottom,
			 "下一位",
			 this.handleOfNext.bind(this)
		 )

		 this.lastBtn = new MiniButton(
			16, 
			TurnShow_Bottom,
			"上一位",
			this.handleOfLast.bind(this)
		)

		this.backBtn = null
		this.updateSubItems()
	 }

	 handleOfNext = () => {
		 GameGlobal.databus.watchNext()
	 }

	 handleOfLast = () => {
		GameGlobal.databus.watchLast()
	}
 }