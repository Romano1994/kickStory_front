import { createRouter, createWebHistory } from "vue-router";
import HomePage from "@/views/HomePage.vue";
import menus from "./menu/menus";
import { updateMetaTags, generateStructuredData, addStructuredData, pageSEO } from "../utils/seo";
// import auth from "../js/auth";

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
  {
    path: "/404",
    name: "ErrorPage",
    component: () => import("@/views/ErrorPage.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@/views/ErrorPage.vue"),
  },
];

//로그인 확인 여부 : 네비게이션 가드 필요
const router = createRouter({
  history: createWebHistory(),
  routes,
});

/*
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
*/

router.afterEach((to) => {
  window.dataLayer = window.dataLayer || [];
  
  // SEO 최적화 - 페이지별 메타 태그 업데이트
  const routeName = to.name;
  let seoData = null;
  
  // 페이지별 SEO 데이터 설정
  switch (routeName) {
    case 'HomePage':
      seoData = pageSEO.home;
      break;
    case 'KicksMap':
      seoData = pageSEO.map;
      break;
    case 'KicksCommunity':
      seoData = pageSEO.community;
      break;
    case 'KicksCommunityNew':
      seoData = pageSEO.communityNew;
      break;
    case 'KicksCommunityEdit':
      seoData = pageSEO.communityEdit;
      break;
    case 'KicksCommunityDetail':
      seoData = pageSEO.communityDetail;
      break;
    default:
      // 경로 기반으로도 확인
      if (to.path === '/kc') {
        seoData = pageSEO.community;
      } else if (to.path.startsWith('/kc/')) {
        seoData = pageSEO.community;
      } else {
        seoData = pageSEO.home; // 기본값
      }
  }
  
  // 메타 태그 업데이트
  if (seoData) {
    updateMetaTags(seoData.title, seoData.description, seoData.keywords);
  }

  // 구조화된 데이터 추가
  const structuredData = generateStructuredData(routeName);
  addStructuredData(structuredData);

  // Google Analytics 이벤트 전송
  window.dataLayer.push({
    event: 'route_change',
    page_path: to.fullPath,
    page_title: seoData?.title || 'LookUP',
    page_location: window.location.href
  });
});

export default router;