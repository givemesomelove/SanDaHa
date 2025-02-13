/*
    叫分选庄的场景
*/

import { GameStep, makeImage } from "../common/util";
import HandCards from "../View/handCards";
import ScorePicker from "../View/ScorePicker";
import Scene from "../View/scene";

export default class SceneScore extends Scene {
	constructor() {
		super()
		this.step = GameStep.CallScore
		
		this.stepLab.text = GameStep.CallScore
		this.handCards = new HandCards({})
		this.scorePicker = new ScorePicker()

		this.updateSubItems()
	}

	render(ctx) {
        super.render(ctx)
    }

}