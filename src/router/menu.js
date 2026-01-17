import ScenicSpot from "@/views/ScenicSpot";
import User from "@/views/User";
import Hotel from "@/views/Hotel";
import InformationInfo from "@/views/InformationInfo";
import Strategy from "@/views/Strategy";
import HotelHouse from "@/views/HotelHouse";
import ScenicOrder from "@/views/ScenicOrder";
import HotelOrder from "@/views/HotelOrder";
import Report from "@/views/Report";
import AdminInfo from "@/views/AdminInfo";
import statistic from "@/views/statistic";
const menus = [
  {
    menuId: 1,
    path: '/User',
    name: '用户管理',
    component: User,
    icon: 'el-icon-user'
  },
  {
    menuId: 2,
    path: '/ScenicSpot',
    name: '景点管理',
    component: ScenicSpot,
    icon: 'el-icon-menu'
  },
  {
    menuId: 3,
    path: '/Hotel',
    name: '酒店管理',
    component: Hotel,
    icon: 'el-icon-s-home'
  },
  {
    menuId: 4,
    path: '/InformationInfo',
    name: '旅游公告',
    component: InformationInfo,
    icon: 'el-icon-s-order'
  },
  {
    menuId: 5,
    path: '/Strategy',
    name: '旅游攻略',
    component: Strategy,
    icon: 'el-icon-document-checked'
  },
  {
     menuId: 7,
     path: '/HotelHouse',
     name: '房型管理',
     component: HotelHouse,
     icon: 'el-icon-chat-dot-round',
     hidden: true
   },
   {
     menuId: 8,
     path: '/ScenicOrder',
     name: '景区订单',
     component: ScenicOrder,
     icon: 'el-icon-s-order',
   },
   {
     menuId: 9,
     path: '/HotelOrder',
     name: '酒店订单',
     component: HotelOrder,
     icon: 'el-icon-s-order',
   },
   {
     menuId: 10,
     path: '/Report',
     name: '投诉管理',
     component: Report,
     icon: 'el-icon-phone',
   },
   {
     menuId: 11,
     path: '/AdminInfo',
     name: '个人中心',
     component: AdminInfo,
     icon: 'el-icon-user',
   },
   {
     menuId: 12,
     path: '/statistic',
     name: '数据统计',
     component: statistic,
     icon: 'el-icon-s-data',
   },
]
export default {menus}
