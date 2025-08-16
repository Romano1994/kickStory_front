import { createRouter, createWebHistory } from "vue-router";
import HomePage from "@/views/HomePage.vue";
import menus from "./menu/menus";
import auth from "../js/auth";

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

//로그인 확인 여부 : 네비게이션 가드 필요
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 네비게이션 가드 - 전역 가드
router.beforeEach(async(to, from, next) => {
  // 로그인 여부 검사
  const access = sessionStorage.getItem(auth.accessName);

  if(!to.meta.requiresAuth) {
    if(!access) { // access 토큰 존재 여부 확인
      if(to.path !== '/login') {
        return next('/login');
      }
    }
  }

  next();
});

router.afterEach((to) => {
  window.dataLayer = window.dataLayer || [];
  document.title = to.name;

  window.dataLayer.push({
    event: 'route_change',
    page_path: to.fullPath,
    page_title: to.name,
    page_location: window.location.href
  });
});

export default router;