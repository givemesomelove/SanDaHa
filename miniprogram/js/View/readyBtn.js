import { Btn_Height, Screen_Height, Screen_Width } from "../common/Defines";
import { getUserOnline, makeImage } from "../common/util";
import { cloud_joinRoom, cloud_outRoom } from "../control/cloudFunc";
import Item from "./item";


export default class ReadyBtn extends Item {
	constructor() {
		super()

		this.width = 267
		this.height = 77
		this.x = (Screen_Width - this.width) / 2
		this.y = Screen_Height - this.height - 100
		this.image = makeImage("ready")
		this.enable = true
		this.active = true
		this.ready = false
		this.updateSubItems()
		this.selectBlock = this.handleOfClickReady.bind(this)
	}

	// 检查登录状态
    checkLoginState() {
        if (!GameGlobal.databus.userId) {
            tipToast("先点左边的登录按钮")
            return false;
        }
        return true;
	}

	handleOfClickReady = () => {
		if (!this.checkLoginState()) return;

		const userId = GameGlobal.databus.userId
		const online = getUserOnline(userId)
		if (online) {
			cloud_outRoom()
		} else {
			cloud_joinRoom()
		}
	}

	update() {
		if (this.active) {
			const userId = GameGlobal.databus.userId
			const online = getUserOnline(userId)
			this.image = online ? makeImage("cancel_ready") : makeImage("ready")
		}

		super.update()
	}
}