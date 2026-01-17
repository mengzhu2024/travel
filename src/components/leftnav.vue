<!-- 左边菜单 -->
<template>
  <el-menu default-active="2" :collapse="collapsed" collapse-transition router :default-active="$route.path"
           unique-opened class="el-menu-vertical-demo" background-color="#334157" text-color="#fff"
           active-text-color="#ffd04b">
    <el-menu-item v-for="menu in allmenu" v-if="!menu.hidden && (!menu.role || user.role === menu.role)" :index="menu.path" :key="menu.menuId">
      <i :class="menu.icon"></i>
      <span>{{ menu.name }}</span>
    </el-menu-item>
  </el-menu>
</template>
<script>
import menu from '../router/menu'
export default {
  name: 'leftnav',
  props: {
    user: {
      type: Object,
      required:true
    }
  },
  data() {
    return {
      collapsed: false,
      allmenu: menu.menus,
    }
  },
  // 创建完毕状态(里面是操作)
  created() {
    // 监听
    this.$root.Bus.$on('toggle', value => {
      this.collapsed = !value
    })
  }
}
</script>
<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 240px;
  min-height: 400px;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  border: none;
  text-align: left;
}

.el-menu-item-group__title {
  padding: 0px;
}

.el-menu-bg {
  background-color: #1f2d3d !important;
}

.el-menu {
  border: none;
}

.logobox {
  height: 40px;
  line-height: 40px;
  color: #9d9d9d;
  font-size: 20px;
  text-align: center;
  padding: 20px 0px;
}

.logoimg {
  height: 40px;
}
</style>
