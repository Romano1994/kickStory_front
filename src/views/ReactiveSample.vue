<template lang="">
    <div class="reactive-sample-container">
        sample container
    </div>
</template>
<script>
export default {
    mounted(){
        this.getApi('/test',{test:"test"}, this.success, this.fail);
        this.postApi('/posttest', {test:"test"}, this.success, this.fail);
        this.putApi('/puttest', {test:"test"}, this.success, this.fail);
        this.deleteApi('/deletetest', {test:"test"}, this.success, this.fail);


    },
    methods:{
        success(data) {
            console.log(data);
        },
        fail(err) {
            console.log(err.message);
        },
    }
}
</script>
<style>
    .reactive-sample-container{
        background-color: var(--color4);
        height:100px;
        font-size: 1rem;
        color: var(--color1);
    }

    @media screen and (max-width:var(--max-width)) {
        .reactive-sample-container{
            background-color: white;
            height:300px;
        }
    }
</style>