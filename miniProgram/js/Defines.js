// 屏幕宽高
export const Screen_Width = canvas.width;
export const Screen_Height = canvas.height;

// 卡牌宽高
export const Card_Width = 36
export const Card_Height = 48
// 卡牌选中图片的宽高
export const Card_Select_Width = 36
// 卡牌最小间距
export const Card_Margin = 24 
// 卡牌距离屏幕边距
export const Card_Spacing = 16
// 大按钮宽高
export const Btn_Width = 150
export const Btn_Height = 75
// 小按钮宽高
export const Btn_M_Wdith = 75
export const Btn_M_Height = 37.5
// 名字展示顺序
export const Name_Margin = 40
// 名字中心的y坐标
export const Name_CenterY = Screen_Height / 2 - 50

// 默认功能栏frame
const menuFrame = wx.getMenuButtonBoundingClientRect()
export const MenuTop = menuFrame.top
export const MenuLeft = menuFrame.left
export const MenuBottom = menuFrame.bottom
export const MenuRight = menuFrame.right

// 底部手牌区域的顶点
export const HandCard_Top = Screen_Height - 34 - 5 * (Card_Height + 5) + 5
// 出牌按钮位置
export const PickBtn_Top = HandCard_Top - 16 - Btn_Height
// 底牌位置
export const BottomCard_Top = HandCard_Top - 16 - Card_Height

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




