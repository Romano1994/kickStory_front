<template>
    <div class="header-container-outline">
        <div class="header-container">
            <div class="logo-container">
                <div class="logo-item">
                    <img class="logo-img" src="@/assets/logo_modified2.png" alt="Logo">
                </div>
            </div>
            <!-- <div class="login-container">
                <template v-if="!isLoggedIn">
                    <router-link to="/login" class="login-item">
                        LogIn
                    </router-link>
                    <router-link to="/join" class="login-item">
                        Join
                    </router-link>
                </template>
                <template v-else>
                    <div class="login-item" @click="logOut">
                        LogOut
                    </div>
                </template>
            </div> -->
        </div>
    </div>
</template>

<script>
import userUtils from "../js/userUtils"

export default {
    name: 'MainHeader',
    data() {
        return {
            isLoggedIn: false,
        }
    },
    mounted() {
        this.isLoggedIn = userUtils.isLoggedIn();
    },
    methods: {
        logOut() {
            userUtils.logOut();
            this.isLoggedIn = false;
        },
    }
}
</script>