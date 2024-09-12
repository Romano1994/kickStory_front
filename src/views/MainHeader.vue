<template lang="">
    <div class="header-container-outline">
    <div class="header-container">
        <div class="logo-container">
            <div class="logo-item">
                <img class="logo-img" src="@/assets/logo1.jpg">
            </div>
        </div>
        <div class="login-container">
            <router-link to="/login">
            <div class="login-item">
              LogIn
            </div>
        </router-link>
            <router-link to="/join">      
            <div class="login-item">
                Join
            </div>
        </router-link>
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
    grid-column:2/3;

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
    height: 2rem;
    align-items: end;
}

.login-item {
    margin: 4px;
    color: rgb(255, 244, 204);
    text-decoration: none;
}

.login-item:hover {
    margin: 4px;
    color: white;
    font-size: larger;
}

@media screen and (max-width:720px) {
    .header-container-outline{
    border: 4px solid rgb(255, 244, 204);
    grid-column:1/2;
    }

}
</style>