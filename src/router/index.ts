import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import AdminLayout from '@/views/admin/AdminLayout.vue'
import Dashboard from '@/views/admin/Dashboard.vue'
import ProductList from '@/views/admin/ProductList.vue'
import CategoryList from '@/views/admin/CategoryList.vue'
import TagList from '@/views/admin/TagList.vue'
import LoginView from '@/views/LoginView.vue'
import AdminOrderList from '@/views/admin/AdminOrderList.vue'
import UserList from '@/views/admin/UserList.vue'
import Settings from '@/views/admin/Settings.vue'

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
        component: CategoryList,
        meta: { requiresAuth: true, requiresAdmin: true }
      },
      {
        path: 'tags',
        name: 'AdminTagList',
        component: TagList,
        meta: { requiresAuth: true, requiresAdmin: true }
      },
      {
        path: 'products',
        name: 'ProductList',
        component: ProductList,
        meta: { requiresAuth: true, requiresAdmin: true }
      },
      {
        path: 'orders',
        name: 'AdminOrderList',
        component: AdminOrderList,
        meta: { requiresAuth: true, requiresAdmin: true }
      },
      {
        path: 'users',
        name: 'AdminUserList',
        component: UserList,
        meta: { requiresAuth: true, requiresAdmin: true }
      },
      {
        path: 'settings',
        name: 'AdminSettings',
        component: Settings,
        meta: { requiresAuth: true, requiresAdmin: true }
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return next({ path: '/login', query: { redirect: to.fullPath } })
  }

  if (to.meta.requiresAdmin && !auth.user?.role?.includes('ROLE_ADMIN')) {
    return next({ path: '/login', query: { redirect: to.fullPath } })
  }

  next()
})
export default router
