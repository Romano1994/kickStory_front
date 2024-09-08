<!-- HomePage.vue -->
<template lang="">
    <div class="main-container">
        <MainHeader></MainHeader>
        <div class="body-container">
            <div class="menu-container"></div>
        <router-link to="/sample" >reative sample</router-link>
        <router-view v-slot="{Component}">
            <keep-alive>
                <component :is="Component"></component>
            </keep-alive>
        </router-view>
        <MainFooter></MainFooter>   
    </div>
    </div>
    
</template>

<script>
import MainHeader from "./MainHeader.vue"
import MainFooter from "./MainFooter.vue"
export default {
    methods: {
    },
    components: {
        MainHeader,
        MainFooter,
    },
}
</script>

<style>
.main-container{
    display: grid;
    grid-template-columns: repeat(5,1fr);
}

.body-container{
    grid-column-start: 2;
    grid-column-end: 5;
    border: 1px solid rgb(255, 244, 204);
}
</style>