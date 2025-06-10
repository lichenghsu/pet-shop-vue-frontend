<template>
  <n-layout has-sider style="height: 100vh">
    <SidebarMenu />

    <n-layout>
      <Topbar />

      <n-layout-content style="padding: 24px">
        <router-view />
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>

<script lang="ts" setup>
import { NLayout, NLayoutContent } from 'naive-ui'
import SidebarMenu from '@/components/admin/SidebarMenu.vue'
import Topbar from '@/components/admin/Topbar.vue'
</script>
