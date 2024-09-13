<template lang="">
    <div class="footer-container">
        MainFooter
    </div>
</template>
<script>
export default {
    
}
</script>
<style>
    .footer-container{
        border: 1px solid var(--color1);
        grid-column:2/3;
    }
@media screen and (max-width:720px) {
    .footer-container{
        grid-column:1/2;
    }
    
}
</style>