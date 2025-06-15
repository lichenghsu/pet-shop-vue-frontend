import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import AdminLayout from '@/views/admin/AdminLayout.vue'
import Dashboard from '@/views/admin/Dashboard.vue'
import ProductList from '@/views/admin/ProductList.vue'
import CategoryList from '@/views/admin/CategoryList.vue'
import TagList from '@/views/admin/TagList.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/admin',
    component: AdminLayout,
    children: [
      {
        path: '',
        name: 'AdminDashboard',
        component: Dashboard
      },
      {
        path: 'categories',
        name: 'AdminCategoryList',
        component: CategoryList
      },
      {
        path: 'tags',
        name: 'AdminTagList',
        component: TagList
      },
      {
        path: 'products',
        name: 'ProductList',
        component: ProductList
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
