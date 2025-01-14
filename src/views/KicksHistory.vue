<template>
  <div class="page-container grid-column-3">
    <div class="card-container" v-for="(item,index) in cards" :key="index">
      <div class="wrapper" :ref="`wrapper${index}`">
        <div class="outer card" :ref="`jordan${index}`"
             @mousemove="e=>moveCard(e,index,true)"
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
              <div class="card-text-container">
                <div class="rating">
                  <span>⭐ {{ item.avgRating }} / {{ item.nop }} 명 참여 </span>
                  <span class="mid-dot"> &#183; </span>
                  <span class="release-year"> {{ item.releaseYear }} 출시 </span>
                </div>
                <hr>
                <!--                <div class="">* 출시년도 1993</div>-->
                <span v-if="currIndex!==index">
                <div class="card-text">
                  {{ item.kcksHstrySmmryCntnt }}
                </div>
                </span>
                <span v-else-if="currIndex===index">
                <div class="card-text">
                  {{ item.kcksHstry }}
                </div>
                <div class="more-btn" v-if="!isShowSlide" @click="openSlide">더보기</div>
                </span>
              </div>
            </div>
            <img class="card-img-top" :src="getImgUrl(item.imgPath)" alt="shoe-img" @error="setAltImg">
          </div>
          <!--        BackFace-->
          <div class="outer-layer back">
            <img src="@/assets/kickstory.webp" style="width: 300px;" alt="kcks-img">
          </div>
        </div>

      </div>
    </div>
  </div>
  <div class="slide" ref="slide" v-if="isShowSlide">
    <!--  <div class="slide" ref="slide">-->
    <button type="button" class="close  ms-auto" aria-label="Close" @click="closeSlide">
      <span aria-hidden="true">&times;</span>
    </button>
    <h1>JORDAN 1</h1>
    <!--    <hr>-->
    <br><br>

    <h2>About</h2>
    <hr>
    <div>
      여기는 조던1에 대한 설명글을 작성한 부분입니다.
    </div>
    <br><br>

    <h2>Release</h2>
    <hr>
    <div>
      발매정보를 보여줍니다.
    </div>
    <br><br>

    <h2>Community</h2>
    <hr>
    <div>
      커뮤니티 관련 글들을 보여줍니다.
    </div>
    <br><br>

    <h2>About</h2><span>ai가 작성한 내용입니다.</span>
    <hr>
    <div>
      여기는 조던1에 대한 설명글을 작성한 부분입니다.
    </div>
  </div>
</template>
<script>

export default {
  mounted() {
    this.getHstry();
  },
  data() {
    return {
      cards: [],
      isBig: false,
      currIndex: -1,
      isEnter: false,
      isShowSlide: false,
    }
  },
  methods: {
    getImgUrl(src) {
      if (src == null) {
        return null
      }
      return require('@/assets' + src);
    },
    getHstry() {
      this.getApi('/getHstry', {commCd: '0001'}, this.setHstry, this.fail);
    },
    setHstry(res) {
      this.cards = res.data;
    },
    fail(err) {
      console.log(err);
    },
    moveCard(e, idx, flag) {
      if (this.currIndex === -1) {
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
        let jordan = this.$refs[`jordan${idx}`][0];
        wrapper.classList.toggle("big");
        let rect = wrapper.getBoundingClientRect();

        document.documentElement.style.setProperty('--left', `${rect.left}px`);
        document.documentElement.style.setProperty('--top', `${rect.top}px`);
        document.documentElement.style.setProperty('--scroll', `${window.scrollY}px`);

        this.isEnter = true;

        if ((idx + 1) % 3 !== 0) {
          wrapper.style = `animation: bigger-left 3s forwards;-webkit-animation:bigger-left 3s forwards;`;
          // wrapper.classList.add("bigger-left"); // 클래스 추가

        } else {
          wrapper.style = `animation: bigger-right 3s forwards;-webkit-animation:bigger-right 3s forwards;`;
          // wrapper.classList.add("bigger-right");
        }
        jordan.style = 'animation: flip 3s';
        // jordan.classList.add("flip");
      }
    },
    setAltImg(e) {
      console.log("호출됨?")
      e.target.src = "../assets/jordan1.webp";
    },
    openSlide(e) {
      this.isShowSlide = true;
      e.stopPropagation();
      let wrapper = this.$refs[`wrapper${this.currIndex}`][0];
      wrapper.style = "left:25%;top:50%;-webkit-transform: translate(-50%, -50%) scale(1.3);"
      let height = document.body.scrollHeight;
      this.$nextTick(() => {
        // this.$refs.slide.style='animation:slide-in 3s forwards;'
        this.$refs.slide.style = `height: ${height}px;`

      })
    },
    closeSlide() {
      this.isShowSlide = false;
      document.documentElement.style.setProperty('--scroll', `${window.scrollY}px`);
      let wrapper = this.$refs[`wrapper${this.currIndex}`][0];
      wrapper.style = "left:50%;top:50%;margin-top:var(--scroll);transform: translate(-50%, -50%) scale(1.3)"
    }
  },//methods


}
</script>
<style>


</style>