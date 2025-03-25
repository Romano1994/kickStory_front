const accessName = process.env.VUE_APP_JWT_ACCESSNAME;

const isLoggedIn = () => {
    const access = sessionStorage.getItem(accessName);

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

export default {isLoggedIn};