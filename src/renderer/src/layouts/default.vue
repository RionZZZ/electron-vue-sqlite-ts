<template>
  <el-container>
    <el-header>
      <div class="header-title">权限系统</div>
      <div class="header-right">
        <Db />
        <el-dropdown trigger="click">
          <span class="dropdown-user">
            <el-icon class="el-icon--right" size="20">
              <User />
            </el-icon>
            <span class="dropdown-user-name">{{ userName }}</span>
            <el-icon class="el-icon--right" color="#999">
              <arrow-down />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="handleChangePassword">修改密码</el-dropdown-item>
              <el-dropdown-item divided @click="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>
    <el-container>
      <el-aside width="224px">
        <el-scrollbar>
          <el-menu
            :default-active="activePath"
            class="el-menu-vertical"
            router
            background-color="#fff"
            text-color="#333"
            active-text-color="#3A81FC"
          >
            <el-sub-menu v-for="menu in menuList" :key="menu.key" :index="menu.key">
              <template #title>
                <span>{{ menu.title }}</span>
              </template>
              <el-menu-item-group>
                <el-menu-item
                  v-for="subMenu in menu.children"
                  :key="subMenu.name"
                  :index="subMenu.path"
                  >{{ subMenu.meta?.title }}</el-menu-item
                >
              </el-menu-item-group>
            </el-sub-menu>
          </el-menu>
        </el-scrollbar>
      </el-aside>
      <el-main>
        <router-view v-slot="{ Component }">
          <transition name="el-fade-in-linear" :duration="100" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
  <ChangePassword v-model:visible="showDialog" />
</template>

<script setup name="Layout" lang="ts">
import { onBeforeMount, ref, type Ref } from 'vue'
import { useRoute, onBeforeRouteLeave, type RouteRecordRaw } from 'vue-router'
import routes from 'virtual:generated-pages'
import { type Meta } from '@renderer/types/router'
import { UserStore } from '@renderer/stores'
import { storeToRefs } from 'pinia'
import Db from '@renderer/components/db.vue'
import ChangePassword from '@renderer/components/change-password.vue'

interface Menu {
  title: string
  key: string
  children: RouteRecordRaw[]
}
const showDialog = ref(false)
const userStore = UserStore()
const { userName } = storeToRefs(userStore)
const { logout } = userStore
const activePath = ref(useRoute().path)

onBeforeMount(() => {
  settingMenu()
})

onBeforeRouteLeave((to, _from, next) => {
  activePath.value = to.path
  next()
})

const menuList: Ref<Menu[]> = ref([])
const topMenu: Menu[] = [{ title: '权限管理', key: 'purview', children: [] }]
const settingMenu = () => {
  const menuRoutes = [...routes]
  menuRoutes
    .filter(route => (route.meta as Meta)?.menuIndex)
    .sort(
      (route1, route2) => +((route1.meta as Meta).menuIndex! > (route2.meta as Meta).menuIndex!) - 1
    )
    .forEach(route => {
      topMenu.forEach(menu => {
        if (route.path.indexOf(menu.key) === 1) {
          menu.children.push(route)
        }
      })
    })

  console.log(topMenu)
  menuList.value = topMenu
}

const handleChangePassword = () => {
  showDialog.value = true
}
</script>

<style lang="scss" scoped>
.header-title {
  margin-left: 40px;
  color: #333;
  font-size: 20px;
  font-weight: 400;
}
.header-right {
  display: flex;
  align-items: center;
}
.dropdown-user {
  display: flex;
  &-name {
    margin: 0 4px;
    font-size: 14px;
    color: #333333;
  }
}
</style>
