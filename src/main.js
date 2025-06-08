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

//라이브러리 전역 변수 등록
app.config.globalProperties.$apiCall=apiCall;
app.config.globalProperties.$axios=axios;

app.mixin(apiMix);

createApp(App).use(VueAwesomePaginate).mount("#app");

loadComponents();
app.use(router);
app.mount('#app')

