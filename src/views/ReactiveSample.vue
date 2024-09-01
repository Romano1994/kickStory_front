<template lang="">
    <div class="reactive-sample-container">
        sample container
    </div>
</template>
<script>
export default {
    
}
</script>
<style>
    .reactive-sample-container{
        background-color: white;
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