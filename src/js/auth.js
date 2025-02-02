import axios from "axios";

// 토큰 재발급
const checkExp = async () => {
    const cookies = document.cookie.split("; ");
    let expTime = "";

    for (const cookie of cookies) {
        const [key, value] = cookie.split("=");
        if (key == "kick_exp") {
            expTime = value;
        }
    }

    let isExpired = false;
    if(expTime) {
        isExpired = Date.now() >= expTime;
    } else {
        isExpired = false;
    }

    if(isExpired) {
        await axios.post("/auth/reissue", {})
        .then(() => {
        });
    }
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

export default {checkExp, getLoginStatus};