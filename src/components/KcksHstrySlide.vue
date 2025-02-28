<script>
import KcksHstryEditor from "@/components/KcksHstryEditor.vue";
import KcksHstryMergeEditor from "@/components/KcksHstryMergeEditor.vue";
import {diff_match_patch} from "diff-match-patch";

export default {
  name: "KcksHstrySlide",
  components: {KcksHstryEditor, KcksHstryMergeEditor},
  emits: ['getHstry'],
  props: ["orgMdfctnCntnt", "aiContent", "commCdDtl", "avgRating", "nop", "releaseYear", "kcksHstryMdfctnVer", 'kcksHstryMdfctnNo', 'kcksHstryMdfctnYn', 'commCdDtlNm'],
  data() {
    return {
      mdfctnCntnt: '',
      isShowEditor: false,
      isMerge: false,
      mergeCntntnt: '',
      dmp: null,
      isRating: false,
      rating: 0
    }
  },
  mounted() {
    this.mdfctnCntnt = this.orgMdfctnCntnt;
  },
  methods: {
    openEditor() {
      this.isShowEditor = true;
      this.$emit('getHstry');
    },
    updateContent(html) {
      this.mdfctnCntnt = html;
    },
    closeEditor() {
      this.$emit("getHstry");
      this.isShowEditor = false;
    },
    changeStatus(isMerge) {
      this.isMerge = isMerge;
      this.mergeCntntnt = this.mdfctnCntnt;
      this.$emit('getHstry');
    },
    getDiff(orgMdfctnCntnt, mdfctnCntnt) {
      if (this.dmp === null) this.dmp = new diff_match_patch();

      let diff = null;
      if (orgMdfctnCntnt === null && mdfctnCntnt !== null) {
        diff = this.dmp.diff_main('', mdfctnCntnt.replaceAll('<br>', ''))
      } else if (orgMdfctnCntnt !== null && mdfctnCntnt === null) {
        diff = this.dmp.diff_main(orgMdfctnCntnt, '');
      } else if (orgMdfctnCntnt !== null && mdfctnCntnt !== null) {
        diff = this.dmp.diff_main(orgMdfctnCntnt, mdfctnCntnt.replaceAll('<br>', ''))
      } else {
        diff = this.dmp.diff_main('', '');
      }

      this.dmp.diff_cleanupSemantic(diff);
      return diff;
    },
    saveRating(){
      // this.putApi('/rating',{commCdDtl:this.commCdDtl,rating:this.rating,mbrNo:this.mbrNo},this.succRating,this.ratingFail)
      this.putApi('/rating',{commCdDtl:this.commCdDtl,rating:this.rating,mbrNo:1},this.succRating,this.ratingFail)
      // this.patch('/rating',{commCdDtl:this.commCdDtl,rating:this.rating,mbrNo:1},this.succRating,this.fail)
    },
    succRating(res){
      alert(res.data);
      this.isRating=false;
    },
    ratingFail(err){
      alert(err);
    }

  },
  computed: {
    diffCntnt() {
      let diff = this.getDiff(this.orgMdfctnCntnt, this.mergeCntntnt);
      // let diff = this.getDiff(this.orgMdfctnCntnt, this.mdfctnCntnt);
      diff = this.dmp.diff_prettyHtml(diff);
      diff = diff.replaceAll('&lt;', '<');
      diff = diff.replaceAll('&gt;', '>');
      diff = diff.replaceAll('#ffe6e6', 'red');
      diff = diff.replaceAll('#e6ffe6', 'blue');
      return diff;
    },
    starArr() {
      return Array.from({length: 5}, (_, i) => ({
        id: `rating-star-${i + 1}`,
        checked: (i + 1) <= this.rating
      }));
    }
  }
}
</script>
<template>
  <div class="slide-wrapper" ref="slideContainer">
    <button type="button" class="close  ms-auto" aria-label="Close" @click="$emit('closeSlide')">
      <span aria-hidden="true">&times;</span>
    </button>
    <h1>{{ commCdDtlNm }}</h1>
    <br><br>
    <span>
        <h4 class="slide-title">
          출시년도 {{ releaseYear === 0 ? '정보없음' : releaseYear }}
        </h4>
        <button type="button" class="btn btn-outline-secondary">편잡하기</button>
        <hr>
        <br>

        <h4 class="slide-title">
          Ratings⭐
          <span>
            {{ avgRating + "/" + nop }} 명 참여중
            </span>
        </h4>
        <button type="button" class="btn btn-outline-secondary" v-if="!isRating" @click="isRating=!isRating">평가하기</button>
        <button type="button" class="btn btn-outline-secondary" v-else-if="isRating" @click="saveRating">저장하기</button>
        <div v-if="isRating">
          <span v-for="(item,idx) in starArr" :key="(idx+1)">
          <label :for="item.id">
            <i class="bi bi-star" v-if="!item.checked"></i>
            <i class="bi bi-star-fill" v-else></i>
          </label>
          <input type="radio" name="rating-star" :value="idx+1" v-model="rating" style="display:none"
                 :id='item.id'>
          </span>

        </div>
        <hr>
        <br>
      </span>
    <span v-if="mdfctnCntnt!==''&&mdfctnCntnt!==null">

      <h2 class="slide-title">About</h2>
      <button class="btn btn-outline-secondary" @click="openEditor">편집하기</button>
      <hr>
      <div v-html="mdfctnCntnt">
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

      <h2>About</h2>
      <span>ai가 작성한 내용입니다.</span>
      <hr>
      <div>
        {{ aiContent }}
      </div>
    </span>

    <span v-else>

      <h2>About</h2>
      <span>ai가 작성한 내용입니다.</span>
      <hr>
      <div>
        {{ aiContent }}
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

      <h2 class="slide-title">About</h2>
      <button class="btn btn-outline-secondary" @click="openEditor">편집하기</button>
      <hr>
      <div>
        작성된 내용이 없습니다. 내용을 추가해주세요.
      </div>
    </span>

    <!--    <h2 class="slide-title">현재 내용</h2>-->
    <!--    <hr>-->
    <!--    <div v-html="diffCntnt">-->
    <!--    </div>-->
    <!--    <br><br>-->
  </div>

  <KcksHstryEditor v-if=" isShowEditor && !isMerge" :orgMdfctnCntnt="orgMdfctnCntnt"
                   @update:mdfctnCntnt="updateContent"
                   :mdfctnCntnt="mdfctnCntnt" :kcksHstryMdfctnNo="kcksHstryMdfctnNo"
                   :commCdDtl="commCdDtl" :content="content" @close-editor="closeEditor"
                   @update:changeStatus="changeStatus"
                   :kcksHstryMdfctnYn="kcksHstryMdfctnYn"
                   :kcksHstryMdfctnVer="kcksHstryMdfctnVer"></KcksHstryEditor>
  <KcksHstryMergeEditor v-if="isShowEditor&& isMerge " :orgMdfctnCntnt="orgMdfctnCntnt"
                        @update:mdfctnCntnt="updateContent"
                        :diffCntnt="diffCntnt"
                        :mdfctnCntnt="mdfctnCntnt" :kcksHstryMdfctnNo="kcksHstryMdfctnNo"
                        :commCdDtl="commCdDtl" :content="content" @close-editor="closeEditor"
                        @update:changeStatus="changeStatus" :mergeCntnt="mergeCntntnt"
                        :isMerge="isMerge" :kcksHstryMdfctnYn="kcksHstryMdfctnYn"
                        :kcksHstryMdfctnVer="kcksHstryMdfctnVer"></KcksHstryMergeEditor>
  <!--  <KcksHstryEditor :hstryContent="hstryContent" @update:hstryContent="updateContent" :currCard="currCard"></KcksHstryEditor>-->
</template>

<style scoped>

</style>