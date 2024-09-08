<template lang="">
    <div class="header-container-outline">
    <div class="header-container">
        <div class="logo-container">
            <div class="logo-item">
                <img class="logo-img" src="@/assets/logo1.jpg">
            </div>
        </div>
        <div class="login-container">
            <div class="login-item">
                로그인
            </div>      
            <div class="login-item">
                회원가입
            </div>
        </div>
    </div>
</div>
</template>
<script>
export default {

}
</script>
<style>
.header-container-outline{
    border: 4px solid rgb(255, 244, 204);
    grid-column-start: 2;
    grid-column-end: 5;

}
.header-container {
    background-color: rgb(36, 32, 28);
    margin: 3px;
    border: 2px solid rgb(255, 244, 204);
    height: 10rem;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}

.logo-container {
    display: flex;
    align-items: center;
}

.logo-item {
    width: 13rem;
    background-size: cover;
    overflow: hidden;
}

.logo-img {
    width: 100%;
    object-fit: cover;
}

.login-container {
    position: absolute;
    bottom: 0;
    right: 0;
    margin: 10px;
    display: flex;
}

.login-item {
    margin: 4px;
}

@media screen and (max-width:720px) {
    .header-container {
        height: 6rem;
        justify-content: center;
        /* 작은 화면에서도 중앙 정렬 */
    }

    .logo-container {
        background-color: black;
        font-family: "Micro 5 Charted";
        font-size: 5rem;
        color: var(--color1);
        display: flex;
        padding: 0%;
    }
}
</style>