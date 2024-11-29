<template lang="">
    <div class="page-container grid-column-3">
        <div class="card-container" v-for="(item,index) in cards" :key="index">
            <div class="card" style="width: 18rem;">
                {{item}}
            </div>
        </div>
    </div>
</template>
<script>
export default {
    mounted(){
        this.getHstrySmmry();
    },
    data(){
        return{
            cards:['카드1','카드2','카드3','카드4','카드5']
        }
    },
    methods:{
        getHstrySmmry(){
            this.getApi('/getSmmryHstry',{},this.setHstrySmmry,this.fail);
        },
        setHstrySmmry(res){
            console.log(res.data);
        },
        fail(err){
            console.log(err);
            
        },
    },
}
</script>
<style>
    .card-container{
        display: flex;
        justify-content: center;
        margin: 1rem;
        color: var(--color2);
    }
 
</style>