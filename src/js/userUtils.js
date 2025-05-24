import axios from "axios";
import auth from "../js/auth";
import router from './router';

const parseAccess = (access) => {
    if(!access) {
        return "";
    }

    const payloadBase64 = access.split('.')[1];

    if(!payloadBase64) {
        return;
    }

    return JSON.parse(atob(payloadBase64));
}

const isLoggedIn = () => {
    const access = sessionStorage.getItem(auth.accessName);

    if(!access) {
        return false;
    }

    const payload = parseAccess(access);

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

const getMbrId = () => {
    if(!isLoggedIn) {
        return "";
    }

    const access = sessionStorage.getItem(auth.accessName);

    const payload = parseAccess(access)
    
    return payload.id;
}

const getMbrNo = () => {
    if(!isLoggedIn) {
        return "";
    }

    const access = sessionStorage.getItem(auth.accessName);

    const payload = parseAccess(access);

    return payload.mbrNo;
}

export default {isLoggedIn, logOut, getMbrId, getMbrNo};