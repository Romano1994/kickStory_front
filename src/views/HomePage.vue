<!-- HomePage.vue -->
<template lang="">
    <div class="main-container">
        <MainHeader></MainHeader>
        <div class="body-container">
           <MenuBar></MenuBar>
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
import MenuBar from "@/components/MenuBar.vue";
export default {
    methods: {
    },
    components: {
        MainHeader,
        MainFooter,
        MenuBar
    },
 
}
</script>

<style>
.main-container{
    display: grid;
    grid-template-columns: 10rem auto 10rem;
}



.body-container{
    grid-column:2/3;
    border: 1px solid var(--color1);
}


@media screen and (max-width:720px) {
    .main-container{
        display:grid;
        grid-template-columns: auto;
    }
    .body-container{
        grid-column:1/2;
        border: 1px solid var(--color1);
    }
}
</style>