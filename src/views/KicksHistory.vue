<template lang="">
    <div class="page-container grid-column-3">
        <!-- <div class="card-container" v-for="(item,index) in cards" :key="index">
            <div class="outer card" :ref="`jordan${index}`" @mousemove="e=>moveCard(e,index,true)"
                @mouseleave="e=>moveCard(e,index,false)">
                <div class="overlay card"></div>

                <div class="outer-layer p-2">
                    <div class="inner card p-3" >
                        <div class="card-title ">
                            <span class="badge bg-warning card-badge">
                                Best
                            </span>
                                {{item.commCdDtlNm}}
                        </div>
                        <div class="card-background"></div>
                        <div class="card-container">
                            <div class="card-text">
                                {{item.jrdHstrySmmryCntnt}}
                            </div>
                        </div>
                    </div>
                    <img class="card-img-top" :src="getImgUrl(item.imgPath)" alt="jrd-img">
                </div>
            </div>
        </div> -->

        <div class="card-container" >
            <div class="outer card" :ref="`jordan1`" @mousemove="e=>moveCard(e,1,true)"
                @mouseleave="e=>moveCard(e,1,false)">
                <div class="overlay" ref="overlay1"></div>
                <div class="outer-layer p-2">
                    <div class="inner card p-3" >
                        <div class="card-title ">
                            <span class="badge bg-warning card-badge">
                                Best
                            </span>
                                Jordan 1
                        </div>
                        <div class="card-background"></div>
                        <div class="card-container">
                            <div class="card-text">
                                조던 1은 .....
                            </div>
                        </div>
                    </div>
                    <img class="card-img-top" src="@/assets/jordan1.webp" alt="jrd-img">
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
        moveCard(e, idx, flag) {
            // const parent = this.$refs[`jordan${idx}`][0];
            // console.log("parent",parent);
            // console.log("e.target", e.target);

            // if(e.target!=parent){
            //     return;
            // }

            if (!flag) {
                // this.$refs[`jordan${idx}`][0].style.transform = `rotateY(0deg) rotateX(0deg)`;
                this.$refs[`jordan1`].style.transform = `rotateY(0deg) rotateX(0deg)`;
                // this.$refs[`jordan1`].style.transition = `all 0.1s`;

                // this.$refs[`jordan${idx}`][0].style.transition=`all ease 0.5s`;
                this.$refs['overlay1'].style='background-position : none; filter:opacity(0)';

                return;
            }

            let offsetX = e.offsetX;
            let offsetY = e.offsetY;

            let width = e.target.getBoundingClientRect().width;
            let height = e.target.getBoundingClientRect().height;

            let yDegree = (offsetX - width / 2) / width * 60;
            let xDegree = (offsetY - height / 2) / height * 60;

            // this.$refs[`jordan${idx}`][0].style.transform = `perspective(${height * 10}px) rotateY(${yDegree}deg) rotateX(${xDegree}deg)`;
            this.$refs[`jordan1`].style.transform = `perspective(${height * 10}px) rotateY(${yDegree}deg) rotateX(${xDegree}deg)`;
            this.$refs['overlay1'].style=`background-position : ${yDegree}%`;

        },
    },
}
</script>
<style>
.card-container {
    display: flex;
    justify-content: center;
    margin: 1.5rem;
    border: none;
}

.card {
    transition: all 0.5s;
    width: 23rem;
    height: 32rem;
}

.overlay {
    position: absolute;
    width: 23rem;
    height: 32rem;
    /* radial-gradient 로 변경 */
    background: linear-gradient(105deg,
            transparent 40%,
            rgba(255, 219, 122, 0.8) 45%,
            rgba(132, 50, 255, 0.8) 45% ,
            transparent 54%);
    filter: brightness(1.2) opacity(0.8);
    mix-blend-mode: color-dodge;
    background-size:150% 150%;
    background-position: 100%;
}

.outer {
    background-image: url(@/assets/wave_back.png);
    background-size: cover;
    align-items: center;

}

/* .outer:hover{
    transform:rotateY(20deg);

} */

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
    /* width: calc(100% - 1rem); */
    width: 19rem;
    padding: 2px 2rem;
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

.card-container {
    /* padding: 1rem 1rem 0 0; */
    width: inherit;
}

.card-text {
    max-height: 7rem;
    overflow-y: scroll;
    padding: 0.5rem;
    -ms-overflow-style: none;
}

.card-text::-webkit-scrollbar {
    display: none;
}

.card-img-top {
    position: absolute;
    width: 26rem;
    top: -13%;
    left: 46%;
    transform: translateX(-50%) rotate(-25deg);
    pointer-events: none;
}
</style>