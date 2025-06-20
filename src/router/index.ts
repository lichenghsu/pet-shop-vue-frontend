import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import AdminLayout from '@/views/admin/AdminLayout.vue'
import Dashboard from '@/views/admin/Dashboard.vue'
import ProductList from '@/views/admin/ProductList.vue'
import CategoryList from '@/views/admin/CategoryList.vue'
import TagList from '@/views/admin/TagList.vue'
import LoginView from '@/views/LoginView.vue'

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
    return next('/login')
  }

  if (to.meta.requiresAdmin && auth.user?.role !== 'ROLE_ADMIN') {
    return next('/login')
  }

  next()
})
export default router
