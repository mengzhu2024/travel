// 导入组件
import Vue from 'vue';
import Router from 'vue-router';
// 登录
import login from '@/views/login';
// 首页
import index from '@/views/index';
import menu from './menu'
import Front from "@/views/front/Front";
import scenicList from "@/views/front/scenicList";
import hotelList from "@/views/front/hotelList";
import InformationList from "@/views/front/InformationList";
import StrategyList from "@/views/front/StrategyList";
import scienceDetail from "@/views/front/scienceDetail";
import scenicOrder from "@/views/front/scenicOrder";
import pay from "@/views/front/pay";
import hotelDetail from "@/views/front/hotelDetail";
import hotelOrder from "@/views/front/hotelOrder";
import userCenter from "@/views/front/UserCenter";
import reportList from "@/views/front/reportList";
import strategyDetail from "@/views/front/strategyDetail";
/**
 * 基础菜单
 */
// 启用路由
Vue.use(Router);

const routers = [{
    path: '/',
    name: '',
    component: login,
    hidden: true
}, {
    path: '/login',
    name: '登录',
    component: login,
    hidden: true
}, {
    path: '/index',
    name: '首页',
    component: index
},
    {
        path: '/front',
        name: 'front',
        component: Front,
        redirect: '/scenicList',
        children: [
            {path: '/scenicList', name: 'scenicList', component: scenicList},
            {path: '/hotelList', name: 'hotelList', component: hotelList},
            {path: '/informationList', name: 'informationList', component: InformationList},
            {path: '/strategyList', name: 'strategyList', component: StrategyList},
            {path: '/scienceDetail', name: 'scienceDetail', component: scienceDetail},
            {path: '/userScenicOrder', name: 'scenicOrder', component: scenicOrder},
            {path: '/pay', name: 'pay', component: pay},
            {path: '/hotelDetail', name: 'hotelDetail', component: hotelDetail},
            {path: '/userHotelOrder', name: 'hotelOrder', component: hotelOrder},
            {path: '/userCenter', name: 'userCenter', component: userCenter},
            {path: '/userReport', name: 'reportList', component: reportList},
            {path: '/strategyDetail', name: 'strategyDetail', component: strategyDetail},
        ]
    }
]
routers[2].children = menu.menus
// 导出路由
export default new Router({
    routes: routers
})
