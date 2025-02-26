import axios from "axios";

// 토큰 만료 시간 확인
const getExpTime = async () => {
    const cookies = document.cookie.split("; ");
    let expTime = "";

    for (const cookie of cookies) {
        const [key, value] = cookie.split("=");
        if (key == "kick_exp") {
            expTime = value;
        }
    }

    if(expTime) {
        return expTime - Math.floor(Date.now() / 1000);
    }
}

// 토큰 재발급 axios
const reissue = async () => {
    try {
        await axios.post("/auth/reissue", {});
    } catch(error) {
        // 재발급 실패 시 로그아웃
        this.postApi('/logout', {}, () =>{
            this.$router.push('/')
            .then(() => {
                window.location.reload();
            });
        })
    }
}

// 토큰 재발급 예약
const schduleTokenReissue = () => {
    const oneMinBefore = (getExpTime() - 60) * 1000;

    setTimeout(reissue(), oneMinBefore > 0 ? oneMinBefore : 0);
}

// 로그인 여부 확인
const getLoginStatus = async () => {
    try {
      const result = await axios.post("/auth/loginStatus",{}, {withCredentials: true});
      return result.data;
    } catch(error) {
      return false;
    }
}

export default {schduleTokenReissue, getLoginStatus};