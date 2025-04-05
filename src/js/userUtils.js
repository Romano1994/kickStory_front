import axios from "axios";
import auth from "../js/auth";
import router from './router';

const isLoggedIn = () => {
    const access = sessionStorage.getItem(auth.accessName);

    if(!access) {
        return false;
    }

    const payloadBase64 = access.split('.')[1];

    if(!payloadBase64) {
        return;
    }

    const payload = JSON.parse(atob(payloadBase64));

    if(payload.exp) {
        // 밀리초 단위로 변환
        const expTime = payload.exp * 1000;

        return expTime - (Date.now()) > 0 ?  true :  false;
    }
}

const logOut = () => {
    delete axios.defaults.headers.common['Authorization'];
    sessionStorage.removeItem(auth.accessName);
    axios.post('/logout', {})
        .then(() => {
            alert('로그아웃에 성공했습니다.');
            // 홈으로 이동
            router.push('/')
            .then(() => {
                window.location.reload();
            });
        })
        .catch(() => {
            alert('로그아웃에 실패했습니다.');
        });
    
}
export default {isLoggedIn, logOut};