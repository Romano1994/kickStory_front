<template>
  <div class="page-container grid-column-3">
    <div class="card-container" v-for="(item,index) in cards" :key="index">
      <div class="wrapper" :ref="`wrapper${index}`">

          <div class="outer card" :ref="`jordan${index}`"
             @mousemove="e=>moveCard(e,index,true)"
             @mouseleave="e=>moveCard(e,index,false)" @click="()=> changeCardSize(index)"
             @animationend="()=>{isEnter=false;
             console.log('애니메이션 end 실행',index)}">
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
              <div v-if="currIndex!==index" class="card-text-container">
                <div class="card-text">
                  <span>{{ item.jrdHstrySmmryCntnt }}</span>
                </div>
              </div>
              <div v-else-if="currIndex===index" class="card-content">
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
      isEnter: false,
    }
  },
  methods: {
    getImgUrl(src) {
      if (src == null) {
        return null
      }
      return require('@/assets' + src);
    },
    getSmmry() {
      this.getApi('/getSmmryHstry', {commCd: '0001'}, this.setSmmry, this.fail);
    },
    setSmmry(res) {
      this.cards = res.data;
    },
    fail(err) {
      console.log(err);
    },
    moveCard(e, idx, flag) {
      if (!this.isEnter && (this.currIndex === idx || this.currIndex===-1)) {
        let jordan = this.$refs[`jordan${idx}`][0];
        let overlay = this.$refs[`overlay${idx}`][0];
        if (!flag) {
          jordan.style = `transform: rotateY(0deg) rotateX(0deg);`;
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
      }
    },
    changeCardSize(idx) {
      if (this.currIndex !== -1) {
        let currWrapper = document.getElementsByClassName('big')[0];
        if (currWrapper !== undefined) {
          currWrapper.style = '';
          currWrapper.classList.toggle('big');
        }
      }

      if (this.currIndex === idx) {
        this.currIndex = -1;
      } else if (this.currIndex === -1 || this.currIndex !== idx) {

        this.currIndex = idx;
        let wrapper = this.$refs[`wrapper${idx}`][0];
        console.log("wrapper", wrapper);
        let jordan = this.$refs[`jordan${idx}`][0];
        wrapper.classList.toggle("big");
        let rect = wrapper.getBoundingClientRect();

        document.documentElement.style.setProperty('--left', `${rect.left}px`);
        document.documentElement.style.setProperty('--top', `${rect.top}px`);

        // if (this.isBig) {
        this.isEnter = true;
        if ((idx + 1) % 3 !== 0) {
          wrapper.style = `animation: bigger-left 3s forwards`;
        } else {
          console.log("들어오는지 확인")
          wrapper.style = `animation: bigger-right 3s forwards`;
        }
        jordan.style = 'animation: flip 3s';
        // } else {
        //   this.isEnter = true;
        //
        //   wrapper.style = 'animaition:smaller 3s';
        //   jordan.style = '';
        //   this.currIndex = -1;
        // }
      }
    },

  },//methods

}
</script>
<style>

</style>