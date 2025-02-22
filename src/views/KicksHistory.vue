<template>
  <div class="page-container grid-column-3">
    <div class="card-container" v-for="(item,index) in cards" :key="index">
      <div class="wrapper" :ref="`wrapper${index}`">
        <div class="outer card" :ref="`jordan${index}`"
             @mousemove="e=>moveCard(e,index,true)"
             @mouseleave="e=>moveCard(e,index,false)" @click="()=> changeCardSize(index, item.commCdDtl)">
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
                  <span>⭐ {{ item.avgRating === null ? 0 : item.avgRating }} / {{ item.nop === null ? 0 : item.nop }} 명 참여 </span>
                  <span class="mid-dot"> &#183; </span>
                  <span class="release-year"> 출시년도 {{
                      item.releaseYear === null ? "정보없음" : item.releaseYear + '년'
                    }}
                  </span>
                </div>
                <hr>
                <!--                <div class="">* 출시년도 1993</div>-->
                <span v-if="currIndex!==index">
                <div class="card-text">
                  {{ item.kcksHstrySmmryCntnt }}
                </div>
                </span>
                <span v-else-if="currIndex===index">
<!--                  <div class="card-text" v-if="kcksHstryMdfctnYn==='Y'" v-html="mdfctnCntnt">
                  </div>
                  <div class="card-text" v-else>
                        {{ kcksHstry }}
                  </div>-->
                  <div class="card-text">
                        {{ kcksHstry }}
                  </div>
                <div class="more-btn" v-if="!isShowSlide" @click="e=>openSlide(e,item.commCdDtl)">더보기</div>
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
  <KcksHstrySlide v-if="isShowSlide" ref="slide" :orgMdfctnCntnt="mdfctnCntnt" :aiContent="kcksHstry"
                  :avg-rating="avgRating" :nop="nop" :release-year="releaseYear" :currCard="currCard"
                  :kcksHstryMdfctnYn="kcksHstryMdfctnYn" :commCdDtlNm="commCdDtlNm"
                  :kcksHstryMdfctnVer="kcksHstryMdfctnVer" :kcksHstryMdfctnNo="kcksHstryMdfctnNo" @get-hstry="getHstry"
                  @closeSlide="closeSlide"></KcksHstrySlide>
  <!--  <KcksHstrySlide ref="slide" :orgHstryContent="hstryContent" :aiContent="aiContent" @closeSlide="closeSlide" :currCard="currCard"></KcksHstrySlide>-->
</template>
<script>
import KcksHstrySlide from "@/components/KcksHstrySlide.vue";

export default {
  components: {KcksHstrySlide},
  mounted() {
    this.getSmmry();
  },
  data() {
    return {
      cards: [],
      isBig: false,
      currIndex: -1,
      isEnter: false,
      isShowSlide: false,
      currCard: -1,
      hstryContent: '안녕여기 데이터는\n 이렇게',
      aiContent: '',
      kcksHstryMdfctnYn: "N",
      mdfctnCntnt: '',
      kcksHstry: '',
      kcksHstryMdfctnVer: '',
      releaseYear: '',
      avgRating: '',
      nop: '',
      kcksHstryMdfctnNo: -1,
      commCdDtlNm:'',
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
      this.getApi('/smmryHstry', {commCd: '0001'}, this.setSmmry, this.fail);
    },
    setSmmry(res) {
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
    changeCardSize(idx, commCdDtl) {

      if (this.currIndex !== -1) {
        let currWrapper = document.getElementsByClassName('big')[0];
        if (currWrapper !== undefined) {
          currWrapper.style = '';
          currWrapper.classList.toggle('big');
        }
        if (this.isShowSlide) {
          this.isShowSlide = false;
        }
      }

      if (this.currIndex === idx) {
        this.currIndex = -1;
        this.currCard = -1;
        this.kcksHstry = '';
        this.kcksHstryMdfctnYn = '';
        this.mdfctnCntnt = '';
        this.releaseYear = '';
        this.avgRating = '';
        this.nop = '';
        this.kcksHstryMdfctnNo = -1;
      } else if (this.currIndex === -1 || this.currIndex !== idx) {
        this.currCard = commCdDtl;
        this.getHstry();
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
      e.target.src = "../assets/jordan1.webp";
    },
    openSlide(e, commCdDtl) {
      this.currCard = commCdDtl;
      this.isShowSlide = true;
      e.stopPropagation();
      let wrapper = this.$refs[`wrapper${this.currIndex}`][0];
      wrapper.style = "left:25%;top:50%;-webkit-transform: translate(-50%, -50%) scale(1.3);"
      // let height = document.body.scrollHeight;
      // this.$nextTick(() => {
      //   // this.$refs.slide.style='animation:slide-in 3s forwards;'
      //   this.$refs.slide.$refs.slideContainer.style = `height: ${height}px;`
      // })

    },
    getHstry() {
      this.getApi(`/kcksHstry/${this.currCard}`, null, this.setHstry, this.fail);
    },
    setHstry(res) {
      let list = res.data;

      this.mdfctnCntnt = '';

      list.forEach((data, idx) => {
        if (idx === 0) {
          this.commCdDtlNm=data.commCdDtlNm;
          this.kcksHstryMdfctnYn = data.kcksHstryMdfctnYn;
          this.releaseYear = data.releaseYear;
          this.avgRating = data.avgRating;
          this.nop = data.nop;
          this.kcksHstryMdfctnVer = data.kcksHstryMdfctnVer;
          this.kcksHstry = data.kcksHstry;
        }
        if (this.kcksHstryMdfctnYn !== 'N') {
          let cntntArr = JSON.parse(data.mdfctnCntnt);
          for (let temp of cntntArr) {

            if (this.mdfctnCntnt.length === 0) {
              this.mdfctnCntnt = temp.str;
            } else if (temp.type === 'add') {
              this.mdfctnCntnt = this.mdfctnCntnt.slice(0, temp.position) + temp.str + this.mdfctnCntnt.slice(temp.position);
            } else if (temp.type === 'delete') {
              this.mdfctnCntnt = this.mdfctnCntnt.slice(0, temp.position) + this.mdfctnCntnt.slice(temp.position + temp.length);
            }

          }
          this.kcksHstryMdfctnNo = data.kcksHstryMdfctnNo;

        }
      })
    },

    closeSlide() {
      this.currCard = -1;
      this.isShowSlide = false;
      document.documentElement.style.setProperty('--scroll', `${window.scrollY}px`);
      let wrapper = this.$refs[`wrapper${this.currIndex}`][0];
      wrapper.style = "left:50%;top:50%;margin-top:var(--scroll);transform: translate(-50%, -50%) scale(1.3)"
    },

  },//methods
}
</script>
