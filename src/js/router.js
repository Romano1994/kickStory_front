import { createRouter, createWebHistory } from "vue-router";
import HomePage from "@/views/HomePage.vue";
import menus from "./menu/menus";
import auth from "./auth"

const mainRoutes= [];

(function loadRoutes(menus){
  for(let menu of menus){
    menu.component = () => import(`@/views/${menu.componentPath}.vue`);
    mainRoutes.push(menu);
  }
})(menus);

const routes = [
  {
    path: "/",
    name: "HomePage",
    component: HomePage,
    props:true,
    children: mainRoutes, // Hompage 주소 '/'를 고정값으로 가지고 있는다
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 네비게이션 가드 - 전역 가드
router.beforeEach(async(to, from, next) => {
  // 토큰 만료 체크 및 재발급
  await auth.checkExp();

  // 로그인 여부 검사
  const isLoggedIn = await auth.getLoginStatus();

  if(!to.meta.requiresAuth) {
    if(!isLoggedIn) { // access 토큰 존재 여부 확인
      if(to.path !== '/login') {
        return next('/login');
      }
    }
  }

  next();
});

export default router;