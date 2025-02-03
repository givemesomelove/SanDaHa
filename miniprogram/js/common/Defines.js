// 卡牌宽高
export const Card_Width = 36
export const Card_Height = 48
// 卡牌选中图片的宽高
export const Card_Select_Width = 36
// 卡牌距离屏幕边距
export const Card_Spacing = 16
// 大按钮宽高
export const Btn_Width = 150
export const Btn_Height = 75
// 小按钮宽高
export const Btn_M_Wdith = 75
export const Btn_M_Height = 37.5

// 默认功能栏frame
export const menuFrame = wx.getMenuButtonBoundingClientRect()
// export const menuFrame = {}
// menuFrame.left = 292
// menuFrame.top = 44
// menuFrame.right = 380
// menuFrame.bottom = 76

// 底部手牌区域的顶点
export const HandCard_Top = () => {
	return GameGlobal.canvas.height - 34 - 5 * (Card_Height + 5) + 5
}
// 出牌按钮位置
export const PickBtn_Top = HandCard_Top() - 16 - Btn_Height
// 底牌位置
export const BottomCard_Top = HandCard_Top() - 16 - Card_Height

// 小间距
const M_Spacing = 8
const Spacing = 16
export const HeadHeight = 48
// 我的头像位置
export const MyHead_Top = PickBtn_Top - M_Spacing - HeadHeight
export const MyCard_Top = MyHead_Top - M_Spacing - Card_Height
// 右边头像的高度
export const RightCard_Top = MyCard_Top - Spacing - Card_Height
export const RightHead_Top = RightCard_Top + (Card_Height - HeadHeight) / 2
// 左边头像的高度
export const LeftCard_Top = RightCard_Top - Spacing - Card_Height
export const LeftHead_Top = LeftCard_Top + (Card_Height - HeadHeight) / 2
// 顶部头像高度
export const TopCard_Top = LeftCard_Top - M_Spacing - Card_Height
export const TopHead_Top = TopCard_Top - M_Spacing - HeadHeight







