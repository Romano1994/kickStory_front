import { createApp, defineAsyncComponent } from 'vue'
import App from './App.vue'
import router from '@/js/router'
import "bootstrap/dist/css/bootstrap.min.css"
import 'bootstrap-icons/font/bootstrap-icons.css';
import "bootstrap"
import './js/total-css';
import apiCall from './js/menu/mixins/api/api-call';
import apiMix from './js/menu/mixins/api/api-mix';
import axios from 'axios';
import VueAwesomePaginate from "vue-awesome-paginate";
import "vue-awesome-paginate/dist/style.css";
//fontawesome
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faComment, faEye, faFlag, faClock } from '@fortawesome/free-solid-svg-icons'
import auth from './js/auth';

// import leaflet from 'leaflet';
import 'leaflet/dist/leaflet.css';

import './registerServiceWorker'
// SEO 유틸리티는 router.js에서 사용
// import './utils/antiCrawler' // 크롤링 방지 활성화

const app = createApp(App);
const COMMON_COMPONENTS=[];

app.component('font-awesome-icon', FontAwesomeIcon)
library.add(faComment, faEye, faFlag, faClock);

function loadComponents(){

    for (let component of COMMON_COMPONENTS){
        app.component(
          component,
          //동적import
          defineAsyncComponent(() => import(`@/components/${component}.vue`))
        );
    }
}

// 새로고침 설정
window.onload = () => {
  const access = sessionStorage.getItem(auth.accessName);

  if(access) {
      auth.scheduleTokenReissue();
  }

}

//라이브러리 전역 변수 등록
app.config.globalProperties.$apiCall=apiCall;
app.config.globalProperties.$axios=axios;

app.mixin(apiMix);

loadComponents();
app.use(router);

app.use(VueAwesomePaginate);
app.mount('#app')