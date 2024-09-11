<!-- HomePage.vue -->
<template lang="">
    <div class="main-container">
        <MainHeader></MainHeader>
        <div class="body-container">
            <div class="menu-container">
                <div class="menu-item" v-for="(item,index) in menus" :key="index">
                    {{item}}
                </div>
            </div>
        <router-link to="/sample" >reative sample</router-link>
        <router-view v-slot="{Component}">
            <keep-alive>
                <component :is="Component"></component>
            </keep-alive>
        </router-view>
    </div>
    <MainFooter></MainFooter>   
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
    data(){
        return{
            menus:['JORDAN HISTORY','COMMUNITY','PROFILE'],
        }
    }
}
</script>

<style>
.main-container{
    display: grid;
    grid-template-columns: 10rem auto 10rem;
}

.menu-container{
    display:flex;
    justify-content:space-evenly ;
}
.menu-item{
    border:1px solid rgb(255, 244, 204);
    flex-basis: 100%;
    text-align: center;
    align-content: center;
    min-height: 2rem;
    font-weight: 1000;
}

.body-container{
    grid-column:2/3;
    border: 1px solid rgb(255, 244, 204);
}


@media screen and (max-width:720px) {
    .main-container{
        display:grid;
        grid-template-columns: auto;
    }
    .body-container{
        grid-column:1/2;
        border: 1px solid rgb(255, 244, 204);
    }

}
</style>