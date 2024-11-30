<template lang="">
    <div class="page-container grid-column-3">
        <div class="card-container" v-for="(item,index) in cards" :key="index">
            <div class="outer card" >
                <div class="outer-layer p-2">
                    <div class="inner card p-3" >
                        <div class="card-title border border-secondary">
                            <span class="badge bg-warning card-badge">
                                Best
                            </span>
                                {{item.commCdDtlNm}}
                    </div>
                        <div class="card-background"></div>
                        <div class="card-text">
                            {{item.jrdHstrySmmryCntnt}}
                        </div>
                    </div>
                    <img class="card-img-top" :src="getImgUrl(item.imgPath)" alt="jrd-img">
                </div>
        </div>
        </div>
    </div>
</template>
<script>
export default {
    mounted() {
        this.getSmmry();
    },
    data() {
        return {
            cards: []
        }
    },
    methods: {
        getImgUrl(src) {
            if (src == null) {
                return null
            }
            let image = require('@/assets' + src);
            return image;
        },
        getSmmry() {
            this.getApi('/getSmmryHstry', { commCd: '0001' }, this.setSmmry, this.fail);
        },
        setSmmry(res) {
            let data = res.data;
            this.cards = data;
        },
        fail(err) {
            console.log(err);

        },
    },
}
</script>
<style>
.card-container {
    display: flex;
    justify-content: center;
    margin: 1rem;
    border: none;
}

.outer {
    background-image: url(@/assets/wave_back.png);
    background-size: cover;
    align-items: center;
    width: 23rem;
    height: 32rem;
}

.outer-layer {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 23rem;
    height: 40rem;
    background: linear-gradient(#2c313190, #36969c90);
}

.inner {
    align-items: center;
    width: 21rem;
    height: 30rem;
    background: linear-gradient(#52d4eb60, #7FC7B660);
    /* opacity: 0.6; */
}

.card-title {
    z-index: 9999;
    /* align-self: flex-start; */
    font-weight: bold;
    font-size: 1.3rem;
    background-color: var(--color1);
    width: calc(100%-10px);

}

.card-badge {
    left: -1rem;
    position: absolute;
    transform: rotate(-10deg);
}

.card-background {
    display: flex;
    width: 19rem;
    height: 17rem;
    background-color: #00000060;
    justify-content: center;
    align-items: center;
    border: 1mm ridge rgba(211, 220, 50, .6);
}

.card-text {
    max-height: 7rem;
    overflow: auto;
}

.card-img-top {
    position: absolute;
    z-index: 99;
    width: 26rem;
    top: -19%;
    left: 46%;
    transform: translateX(-50%) rotate(-25deg);
}
</style>