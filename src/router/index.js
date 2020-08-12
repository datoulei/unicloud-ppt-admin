import Vue from "vue";
import VueRouter from "vue-router";
import BaseLayout from "@/layout/BaseLayout";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: BaseLayout,
    children: [
      {
        path: '',
        name: 'Home',
        component: Home
      }
    ]
  },
  {
    path: "/login",
    name: "Login",
    component: Login
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  let isLogin = false;
  const loginType = Vue.ls.get('loginType');
  const token = Vue.ls.get('token');
  const code = Vue.ls.get('code');
  switch (loginType) {
    case 'internet':
      isLogin = !!token;
      break;
    case 'local':
      isLogin = !!code;
      break;
    default:
      break;
  }
  if (!isLogin) {
    // 未登录
    if (to.path !== '/login') {
      next('/login');
    } else {
      next();
    }
  } else {
    // 已登录
    if (to.path === '/login') {
      next('/')
    } else {
      next();
    }
  }
})

export default router;
