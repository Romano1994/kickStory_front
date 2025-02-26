<template>
    <div class="page-container kp-container">
        <!-- 유저 정보 섹션-->
        <div class="info-div">

        </div>
        <!-- 히스토리 수정 내역 섹션-->
        <div class="info-div">

        </div>
        <!-- 커뮤니티 정보 섹션-->
        <div class="info-div">

        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            mbrNo: "",
        }
    },
    mounted() {
        
    },
    methods: {
        // 멤버별 히스토리 조회
        getHstry() {
            // 멤버 번호
            this.mbrNo = this.sessioUtil("mbrNo");

            // 히스토리 내역 조회
            this.getApi("/kcksHstry/getHstryWithMbrNo", {"mbrNo" : this.mbrNo}, getHstrySuccess, getHstryFail)

            // 히스토리 조회 성공 콜백
            const getHstrySuccess = (result) => {
                console.log("success", result);
            };
            
            // 히스토리 조회 실패 콜백
            const getHstryFail = (result) => {
                console.log("fail", result);
            };
        },

        // 멤버별 커뮤니티 조회
        getCommunity() {
            // 멤버 번호
            this.mbrNo = this.sessioUtil("mbrNo");

            // 커뮤니티 내역 조회
            this.getApi("/psts/getPstsWithMbrNo", {"mbrNo" : this.mbrNo}, getPstsSuccess, getPstsFail);

            // 히스토리 조회 성공 콜백
            const getPstsSuccess = (result) => {
                console.log("psts success", result);
            };
            
            // 히스토리 조회 실패 콜백
            const getPstsFail = (result) => {
                console.log("psts fail", result);
            };
            
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
    }
    .info-div {
        display: flex;
        border: 1px solid white;
        width: 40rem;
        height: 10rem;
        margin-top: 50px;
    }
</style>