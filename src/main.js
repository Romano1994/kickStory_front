import { createApp, defineAsyncComponent } from 'vue'
import App from './App.vue'
import router from '@/js/router'
import axios from 'axios';


const app = createApp(App);
const COMMON_COMPONENTS=[];

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
app.config.globalProperties.$axios=axios;

loadComponents();
app.use(router);
app.mount('#app')

