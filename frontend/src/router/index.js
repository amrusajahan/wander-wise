import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Login from '@/components/auth/loginCom.vue';
import Register from '@/components/auth/RegisterCom.vue';
import Dashboard from '@/components/auth/LogoutButton.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/plan-journey',
    name: 'plan-journey',
    // route level code-splitting
    // this generates a separate chunk (plan-journey.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "plan-journey" */ '../views/PlanJourneyView.vue')
  },
  {
    path: '/landmarks',
    name: 'landmarks',
    // route level code-splitting
    // this generates a separate chunk (landmarks.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "landmarks" */ '../views/LandmarksView.vue')
  },
  {
    path: '/feedback',
    name: 'feedback',
    // route level code-splitting
    // this generates a separate chunk (feedback.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "feedback" */ '../views/FeedbackView.vue')
  },
  {
    path: '/chatbot',
    name: 'chatbot',
    // route level code-splitting
    // this generates a separate chunk (feedback.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "feedback" */ '../views/ChatView.vue')
  },
  {
    path: '/:NotFound',
    name: 'NotFound',
    // route level code-splitting
    // this generates a separate chunk (NotFoundView.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "feedback" */ '../views/NotFoundView.vue')
  },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/dashboard', component: Dashboard, meta: { requiresAuth: true } },
]

// router.beforeEach((to, from, next) => {
//   if (to.matched.some(record => record.meta.requiresAuth)) {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       next('/login');
//     } else {
//       next();
//     }
//   } else {
//     next();
//   }
// });

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
