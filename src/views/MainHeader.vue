<template>
    <div class="header-container-outline">
        <div class="header-container">
            <div class="logo-container">
                <div class="logo-item">
                    <img class="logo-img" src="@/assets/lookup_logo.png" alt="Logo">
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
        
        <!-- 모바일용 MenuBar -->
        <div class="mobile-menu-bar" v-show="isMobile">
            <div class="menu-container">
                <div class="menu-item" v-for="(item,index) in filteredMenus" :key="index">
                    <router-link class="menu-router" :to="item.path">
                        <span class="menu-item-link">{{item.name}}</span>
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import userUtils from "../js/userUtils"
import menus from '@/js/menu/menus'

export default {
    name: 'MainHeader',
    data() {
        return {
            isLoggedIn: false,
            isMobile: false,
            menus: menus
        }
    },
    computed: {
        filteredMenus() {
            return this.menus.filter(menu => menu.depth === 1);
        }
    },
    mounted() {
        this.isLoggedIn = userUtils.isLoggedIn();
        this.checkMobile();
        window.addEventListener('resize', this.checkMobile);
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.checkMobile);
    },
    methods: {
        logOut() {
            userUtils.logOut();
            this.isLoggedIn = false;
        },
        checkMobile() {
            this.isMobile = window.innerWidth <= 768;
        }
    }
}
</script>

<style scoped>
/* 모바일용 MenuBar 스타일 */
.mobile-menu-bar {
    background-color: var(--color2, rgb(164, 155, 123));
    border-top: 1px solid rgba(255, 244, 204, 0.2);
    padding: 0;
    width: 100%;
}

.mobile-menu-bar .menu-container {
    display: flex;
    justify-content: space-between;
    max-width: 100%;
    margin: 0;
    padding: 0;
    width: 100%;
}

.mobile-menu-bar .menu-item {
    border: 1px solid rgba(255, 244, 204, 0.3);
    flex: 1;
    text-align: center;
    align-content: center;
    min-height: 2.5rem;
    font-weight: 1000;
    border-radius: 0;
    margin: 0;
    background-color: rgba(255, 244, 204, 0.05);
    transition: all 0.2s ease;
}

.mobile-menu-bar .menu-item:hover {
    background-color: rgba(255, 244, 204, 0.1);
    transform: translateY(-1px);
}

.mobile-menu-bar .menu-item-link {
    color: rgb(255, 244, 204);
    text-decoration: none;
    font-size: 0.9rem;
    font-weight: 600;
    display: block;
    padding: 0.5rem;
    transition: all 0.2s ease;
}

.mobile-menu-bar .menu-item-link:hover {
    color: white;
    font-size: 1rem;
}

.mobile-menu-bar .menu-router {
    text-decoration: none;
    display: block;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* 모바일에서만 표시 */
@media (min-width: 769px) {
    .mobile-menu-bar {
        display: none;
    }
}

/* 작은 화면에서 메뉴 아이템 크기 조정 */
@media (max-width: 480px) {
    .mobile-menu-bar .menu-item-link {
        font-size: 0.8rem;
        padding: 0.4rem;
    }
    
    .mobile-menu-bar .menu-item {
        min-height: 2rem;
    }
}

/* 매우 작은 화면 (360px 이하) */
@media (max-width: 360px) {
    .mobile-menu-bar .menu-item-link {
        font-size: 0.75rem;
        padding: 0.35rem;
    }
    
    .mobile-menu-bar .menu-item {
        min-height: 1.8rem;
    }
}
</style>