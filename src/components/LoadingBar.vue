<template>
    <div class="loading-bar-container" v-show="on">
        <div class="loading-bar-shape"></div>
        <div class="loading-bar-text">loading...</div>
    </div>
    </template>
    <script>
    import { commSwitch } from '@/js/comm-switch';
    export default {
        name:"LoadingBar",
        data(){
            return{
                on:false,
            }
        },
        computed:{
     
        },
        created(){
            commSwitch.setSwitch('LoadingBar',this)
        }
    }
    
    </script>
    <style>
    </style>