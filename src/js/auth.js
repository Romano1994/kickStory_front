import axios from "axios";

// 토큰 만료 시간 확인
const getExpTime = () => {
    const access = sessionStorage.getItem("access");

    if(!access) {
        console.log("there is no access token");
        return null;
    }

    const payloadBase64 = access.split('.')[1];

    if(!payloadBase64) {
        console.log("토큰 형식 잘못 됨");
        return;
    }

    try {
        const payload = JSON.parse(atob(payloadBase64));

        if(payload.exp) {
            // 밀리초 단위로 변환
            const expTime = payload.exp * 1000;
            return expTime;
        } else {
            console.log("exp 없음.");
        }
    } catch(error) {
        console.log("디코딩 중 에러", error);
        return null;
    }
}

// 토큰 재발급 axios
const reissue = async() => {
    
    console.log("reissue");
    
    try {
        const response = await axios.post("/auth/reissue", {});

        const access = response.headers['authorization']?.split(' ')[1];
        sessionStorage.setItem('access', access);
        // Axios 기본 헤더에 Access Token 설정
        axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;
        
        scheduleTokenReissue();

    } catch(error) {
        console.log("reissue error");
        
        // 재발급 실패 시 로그아웃
        axios.post('/logout', {}, () =>{
            this.$router.push('/')
            .then(() => {
                window.location.reload();
            });
        })
    }
}

// 토큰 재발급 예약
const scheduleTokenReissue = () => {
    const exptime = Number(getExpTime());
    const oneMinBefore = exptime - (Date.now()) - 60000;

    const parseSecond = Math.max(oneMinBefore / 1000, 0);
    console.log("토큰 재발급 예정:", parseSecond.toFixed(2));

    setTimeout(reissue, oneMinBefore > 0 ? oneMinBefore : 0);
}

// 로그인 여부 확인
const getLoginStatus = async () => {
    const access = sessionStorage.getItem("access");
    
    if(access) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;
    }

    try {
      const result = await axios.post("/auth/loginStatus",{});
      return result.data;
    } catch(error) {
      return false;
    }
}

export default {scheduleTokenReissue, getLoginStatus};