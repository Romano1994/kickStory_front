<template lang="">
    <div class="header-container-outline">
    <div class="header-container">
        <div class="logo-container">
            <div class="logo-item">
                <img class="logo-img" src="@/assets/logo_modified2.png">
            </div>
        </div>
        <div class="login-container">
            <template v-if="!isLoggedIn">
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
            </template>
            <template v-if="isLoggedIn">
                <div class="login-item" @click="logOut">
                  LogOut
                </div>
            </template>
        </div>
    </div>
</div>
</template>
<script>
import userUtils from "../js/userUtils"

export default {
    data() {
      return {
        isLoggedIn : false,
      }
    },
    mounted() {

      this.isLoggedIn = userUtils.isLoggedIn();
    },
      
    methods: {
        logOut() {
          userUtils.logOut();
        },
    }
}
</script>
<style>
.header-container-outline{
    border: 4px solid var(--color1);
    grid-column:2/3;
}

.header-container {
  background-color: var(--color3);
  margin: 3px;
  border: 2px solid var(--color1);
  height: 10rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden; /* ensure children don't escape */
}

.logo-container {
  display: flex;
  align-items: center;
  justify-content: center; /* center horizontally */
  width: 100%;
  height: 100%;
}

.logo-item {
  width: 5rem; 
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.logo-img {
  display: block;
  max-width: 85%;
  max-height: 85%; /* keep some padding inside header */
  object-fit: contain; /* keep full image visible */
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

@media screen and (max-width: 720px) {
  .header-container-outline {
    border: 4px solid rgb(255, 244, 204);
    grid-column: 1/2;
  }

}
</style>