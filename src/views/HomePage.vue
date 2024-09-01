<!-- HomePage.vue -->
<template lang="">
    <MainHeader></MainHeader>
    <router-link to="ReactiveSample" >reative</router-link>
    <router-view v-slot="{Component}">
        <keep-alive>
            <component :is="Component"></component>
        </keep-alive>
    </router-view>
    <MainFooter></MainFooter>
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

<style></style>