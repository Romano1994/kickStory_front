<template lang="">
    <div class="header">
        <div class="logo">
           Kickstory
        </div>
        <div class="header-login">
        </div>
    </div>
</template>
<script>
export default {
    
}
</script>
<style>
.header{
    border: 1px solid grey;
    height:5rem;
}
.logo{
    background-color: black;
    font-family:var(--header-font);
    height:100px;
    font-size: 3rem;
    color: var(--color1);
}

@media screen and (max-width:var(--max-width)){
    .logo{
    background-color: black;
    font-family:"Micro 5 Charted";
    font-size: 3rem;
    color: var(--color1);
    }
}
</style>