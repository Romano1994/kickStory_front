<template lang="">
  <div class="menu-container">
                <div class="menu-item" v-for="(item,index) in filteredMenus" :key="index" >
                    <router-link :to="item.path">
                        <span class="menu-item-link">{{item.name}}</span>
                    </router-link>
                </div>
            </div>
</template>
<script>
import menus from '@/js/menu/menus';
export default {
    computed:{
        filteredMenus(){
            return this.menus.filter(menu => menu.depth==1);
        }
    },
    data(){
        return{
            menus:menus
        }
    }
}
</script>
<style>
.menu-container{
    display:flex;
    justify-content:space-evenly ;
}
.menu-item{
    border:1px solid rgb(255, 244, 204);
    flex-basis: 100%;
    text-align: center;
    align-content: center;
    min-height: 2.5rem;
    font-weight: 1000;
}
.menu-item-link{
    color:rgb(255, 244, 204);
    text-decoration: none;
}
.menu-item-link:hover{
    color:white;
    font-size: larger;
}
</style>