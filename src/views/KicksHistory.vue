<template>
  <div class="page-container grid-column-3">
    <!--    <div class="card-container">-->
    <!--      <div class="outer card big">-->
    <!--        <div class="overlay" ref="overlay1"></div>-->
    <!--        <div class="outer-layer p-2">-->
    <!--          <div class="inner card p-3">-->
    <!--            <div class="card-title ">-->
    <!--              <span class="badge bg-warning card-badge">Best</span>-->
    <!--              <span>Jordan 1</span>-->
    <!--            </div>-->
    <!--            <div class="card-background"></div>-->
    <!--            <div class="card-container">-->
    <!--              <div class="card-text">-->
    <!--                조던 1은 .....-->
    <!--              </div>-->
    <!--            </div>-->
    <!--          </div>-->
    <!--          <img class="card-img-top" src="@/assets/jordan1.webp" alt="jrd-img">-->
    <!--        </div>-->
    <!--      </div>-->
    <!--    </div>-->
    <div class="card-container" v-for="(item,index) in cards" :key="index">
      <div class="wrapper" :ref="`wrapper${index}`">
        <div class="outer card" :ref="`jordan${index}`" @mousemove="e=>moveCard(e,index,true)"
             @mouseleave="e=>moveCard(e,index,false)" @click="()=> changeCardSize(index)">
          <div class="overlay" :ref="`overlay${index}`"></div>
          <div class="holo-overlay" :class="{radial : index%2!==0}"></div>
          <!--Front Face-->
          <div class="outer-layer front p-2">
            <div class="inner p-3">
              <div class="card-title ">
                <span class="badge bg-warning card-badge">Best</span>
                <span>{{ item.commCdDtlNm }}</span>
              </div>
              <div class="card-background"></div>
              <div v-if="currIndex!=index" class="card-text-container">
                <div class="card-text">
                  <span>{{ item.jrdHstrySmmryCntnt }}</span>
                </div>
              </div>
              <div v-else-if="currIndex==index" class="card-content">
                <span>안녕</span>
              </div>
            </div>
            <img class="card-img-top" :src="getImgUrl(item.imgPath)" alt="jrd-img">
          </div>

          <!--        BackFace-->
          <div class="outer-layer back">
            <img src="@/assets/kickstory.webp" style="width: 300px;" alt="jrd-img">
          </div>
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
      cards: [],
      isBig: false,
      currIndex: -1,
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
      this.getApi('/getSmmryHstry', {commCd: '0001'}, this.setSmmry, this.fail);
    },
    setSmmry(res) {
      let data = res.data;
      this.cards = data;
    },
    fail(err) {
      console.log(err);
    },
    moveCard(e, idx, flag) {
      let jordan = this.$refs[`jordan${idx}`][0];
      let overlay = this.$refs[`overlay${idx}`][0];
      if (!flag) {
        if (this.currIndex === idx) {
          jordan.style = 'animation: flip 3s';
        } else {
          jordan.style = `transform: rotateY(0deg) rotateX(0deg);`;
        }
        overlay.style = 'filter:opacity(0)';
        overlay.style = '';

        return;
      }
      let offsetX = e.offsetX;
      let offsetY = e.offsetY;

      let width = e.target.getBoundingClientRect().width;
      let height = e.target.getBoundingClientRect().height;

      let yDegree = (offsetX - width / 2) / width * 50;
      let xDegree = (offsetY - height / 2) / height * 50;

      jordan.style = `transform: rotateY(${yDegree}deg) rotateX(${xDegree}deg);`;
      overlay.style = `background: radial-gradient(farthest-corner at ${offsetX}px ${offsetY}px, #ffffff, #000000); filter:brightness(1.3) opacity(0.7)`;
    },
    changeCardSize(idx) {
      this.isBig = !this.isBig;
      this.currIndex = idx;
      let wrapper = this.$refs[`wrapper${idx}`][0];
      let jordan = this.$refs[`jordan${idx}`][0];
      wrapper.classList.toggle("big");
      if (this.isBig) {
        wrapper.style = 'transform : translate(-50%,-50%) scale(1.3)';
        // jordan.style = 'animation: flip 5s '
      } else {
        wrapper.style = '';
        jordan.style = '';
        this.currIndex = -1;

      }
    }
  },
}
</script>
<style>
.card-container {
  display: flex;
  justify-content: center;
  margin: 1.5rem;
  border: none;
  /* padding: 1rem 1rem 0 0; */
}

.wrapper {
  perspective: 1000px;
  /*
  transition: all 5s;
  */
}
.card {
  transition: all 0.5s;
  width: 23rem;
  height: 32rem;
  /*animation: flip 5s;*/
}
.outer {
  background-image: url(@/assets/wave_back.png);
  background-size: cover;
  align-items: center;
  transform-style: preserve-3d;
}

.big {
  position: absolute;
  z-index: 9999;
  left: 50%;
  top: 50%;
}

.overlay {
  position: absolute;
  width: inherit;
  height: inherit;
  /*background: radial-gradient(farthest-corner at center,#ffffff, #000000);
  filter: brightness(1.3) opacity(0.3);*/
}

.holo-overlay {
  position: absolute;
  background: repeating-linear-gradient(#e66465, #9198e5 20%);
  filter: opacity(0.3);
  width: inherit;
  height: inherit;
}

.radial {
  background: repeating-radial-gradient(#e66465, #9198e5 30%);
}

.outer-layer {
  display: flex;
  justify-content: center;
  align-items: center;
  width: inherit;
  height: inherit;
  background: linear-gradient(#2c313190, #36969c90);
}
.inner {
  align-items: center;
  width: 96%;
  height: 96%;
  background: linear-gradient(#52d4eb60, #7FC7B660);
  /* opacity: 0.6; */
}
.card-title {
  z-index: 999;
  font-weight: bold;
  font-size: 1.3rem;
  background-color: var(--color1);
  width: 98%;
  padding: 2px 2rem;
}

.card-badge {
  left: -1rem;
  position: absolute;
  transform: rotate(-10deg);
}

.card-background {
  display: flex;
  width: 98%;
  height: 55%;
  background-color: #00000060;
  justify-content: center;
  align-items: center;
  border: 1mm ridge rgba(211, 220, 50, .6);
  pointer-events: none;
}

.card-text-container {
  width: inherit;
  pointer-events: none;
}

.card-text {
  max-height: 7rem;
  overflow-y: scroll;
  padding: 0.5rem;
  -ms-overflow-style: none;
  pointer-events: none;
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

.front, .back {
  position: absolute;
  -webkit-backface-visibility: hidden; /* Safari */
  backface-visibility: hidden;
}

.back {
  transform: rotateY(180deg);
  width: inherit;
  height: inherit;
  background-color: #000000;
}

@keyframes flip {
  100% {
    transform: rotateY(720deg);
  }
}
</style>