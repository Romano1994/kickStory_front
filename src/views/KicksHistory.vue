<template lang="">
    <div class="page-container grid-column-3">
        <div class="card-container" v-for="(items,index) in cards" :key="index">
            <div class="card-item">
                {{items}}
                <hr>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            cards:['카드1','카드2','카드3','카드4','카드5']
        }
    }
}
</script>
<style>
    .card-container{
        display: flex;
        justify-content: center;
        margin: 1rem;
        color: black;
    }
    .card-item{
        width: 15rem;
        height: 20rem;
        background-color: white;
    }
</style>