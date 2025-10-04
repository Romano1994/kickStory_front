<template>
  <div class="menu-container">
                <div class="menu-item" v-for="(item,index) in filteredMenus" :key="index" >
                    <router-link class="menu-router" :to="item.path">
                        <span class="menu-item-link">{{item.name}}</span>
                    </router-link>
                </div>
            </div>
</template>
<script>
import menus from '@/js/menu/menus';
import '@/css/menu-bar.css';

export default {
    computed:{
        filteredMenus(){
            return this.menus.filter(menu => menu.depth===1);
        }
    },
    data(){
        return{
            menus:menus
        }
    }
}
</script>