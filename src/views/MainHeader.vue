<template lang="">
    <div class="header">
        <div class="logo">
           Kickstory
        </div>
    </div>
</template>
<script>
export default {

}
</script>
<style>
.header {
    border: 1px solid grey;
    height: 5rem;
}

.logo {
    background-color: black;
    font-family: var(--header-font);
    font-size: 3rem;
    color: var(--color1);
}

@media screen and (max-width:720px) {
    .header {
        border: 1px solid grey;
        height: 6rem;
        justify-content: center;
        display: flex;
    }

    .logo {
        background-color: black;
        font-family: "Micro 5 Charted";
        font-size: 5rem;
        color: var(--color1);
        display: flex;
        padding: 0%;
    }
}
</style>