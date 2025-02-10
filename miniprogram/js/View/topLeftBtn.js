/**
 * 左上角小按钮
 */

import { menuFrame } from "../common/Defines";
import { makeImage } from "../common/util";
import Item from "./item";

const itemWidth = 25

export default class SetBtn extends Item {
    constructor(index, selectBlock, imgName) {
        super()

        this.x = 8 + index * (itemWidth + 8)
        this.y = menuFrame.top
        this.width = itemWidth
        this.height = itemWidth
        this.selectBlock = selectBlock
        this.image = imgName ? makeImage(imgName) : null
        this.active = true
        this.enable = true
    }
}