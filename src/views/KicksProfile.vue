<template>
    <div class="page-container kp-container">
        <!-- 유저 정보 섹션-->
        <div class="info-div user-profile">
            <div class="section-title">유저 정보</div>
            <div class="user-info-container">
                <div class="user-info-left">
                    <div class="info-row">
                        <span class="info-label">이메일</span>
                        <span class="info-value">{{mbrEmail}}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">아이디</span>
                        <span class="info-value">{{mbrId}}</span>
                    </div>
                </div>
            </div>
        </div>
        <!-- 히스토리 수정 내역 섹션-->
        <div class="info-div history-section">
            <div class="section-title">히스토리 수정 내역</div>
            <div class="empty-content">
                <p>수정 내역이 없습니다.</p>
            </div>
        </div>
        <!-- 커뮤니티 정보 섹션-->
        <div class="info-div community-section">
            <div class="section-title">커뮤니티 정보</div>
            <div class="empty-content">
                <p>커뮤니티 활동 내역이 없습니다.</p>
            </div>
        </div>
    </div>
</template>
<script>
import userUtils from "@/js/userUtils";
export default {
    data() {
        return {
            mbrId: "",
            mbrNo: "",
            mbrEmail: "",
        }
    },
    mounted() {
        // 멤버 아이디 조회
        this.mbrId = userUtils.getMbrId();

        // 멤버 번호
        this.mbrNo = userUtils.getMbrNo();

        // 유저 정보 조회
        this.getUserInfo();

        // 히스토리 조회
        this.getHstry();

        // 커뮤니티 조회
        this.getCommunity();
    },
    methods: {
        // 멤버 정보 조회
        getUserInfo() {
            // 멤버 정보 조회 성공 콜백
            const getMbrInfoSuccess = (result) => {
                let data = result.data;

                this.mbrEmail = data.email !== undefined ? data.email : "";
            };
            
            // 멤버 정보 조회 실패 콜백
            const getMbrInfoFail = () => {
                alert("멤버 정보를 가져오는데 실패했습니다.")
            };

            // 멤버 정보 조회
            this.getApi("/getMbrInfo", {}, getMbrInfoSuccess, getMbrInfoFail);
        },

        // 멤버별 히스토리 조회
        getHstry() {

            // 히스토리 조회 성공 콜백
            const getHstrySuccess = (result) => {
                console.log("success", result);
            };
            
            // 히스토리 조회 실패 콜백
            const getHstryFail = (result) => {
                console.log("fail", result);
            };

            // 히스토리 내역 조회
            this.getApi("/getHstryWithMbrNo", {"mbrNo" : this.mbrNo}, getHstrySuccess, getHstryFail);
        },

        // 멤버별 커뮤니티 조회
        getCommunity() {

            // 커뮤니티 조회 성공 콜백
            const getPstsSuccess = (result) => {
                console.log("psts success", result);
            };
            
            // 커뮤니티 조회 실패 콜백
            const getPstsFail = (result) => {
                console.log("psts fail", result);
            };

            // 커뮤니티 내역 조회
            this.getApi("/getPstWithMbrNo", {"mbrNo" : this.mbrNo}, getPstsSuccess, getPstsFail);
        }
    }
}
</script>
<style>
    .kp-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        align-content: center;
        padding: 2rem;
    }
    .info-div {
        display: flex;
        border: 1px solid #e0e0e0;
        width: 40rem;
        min-height: 10rem;
        margin-top: 50px;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        background: white;
        padding: 1.5rem;
    }
    .user-profile {
        flex-direction: column;
    }
    .user-info-container {
        display: flex;
        justify-content: space-between;
        gap: 2rem;
        margin-top: 1rem;
    }
    .user-info-left, .user-info-right {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    .info-row {
        display: flex;
        align-items: center;
        padding: 0.8rem;
        background: #f8f9fa;
        border-radius: 8px;
        transition: all 0.3s ease;
    }
    .info-row:hover {
        background: #f0f0f0;
        transform: translateX(5px);
    }
    .info-label {
        width: 80px;
        font-weight: 600;
        color: #666;
    }
    .info-value {
        flex: 1;
        color: #333;
    }
    .section-title {
        font-size: 1.2rem;
        font-weight: 600;
        color: #333;
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
        border-bottom: 2px solid #f0f0f0;
    }
    .empty-content {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        color: #999;
        font-size: 0.9rem;
    }
    .history-section, .community-section {
        flex-direction: column;
    }
</style>