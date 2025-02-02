<script>
import KcksHstryEditor from "@/components/KcksHstryEditor.vue";

export default {
  name: "KcksHstrySlide",
  components: {KcksHstryEditor},
  props: ["orgMdfctnCntnt", "aiContent", "currCard", "avgRating", "nop", "releaseYear","kcksHstryMdfctnVer"],
  data() {
    return {
      mdfctnCntnt: null,
      isShowEditor: false,
    }
  },
  mounted() {
    this.mdfctnCntnt = this.orgMdfctnCntnt;
  },
  methods: {
    openEditor() {
      this.isShowEditor = true;
    },
    updateContent(html) {
      this.mdfctnCntnt = html;
    },
  }
}
</script>

<template>
  <div class="slide-wrapper" ref="slideContainer">
    <button type="button" class="close  ms-auto" aria-label="Close" @click="$emit('closeSlide')">
      <span aria-hidden="true">&times;</span>
    </button>
    <h1>JORDAN 1</h1>
    <br><br>

    <span>
      <h4 class="slide-title">
        출시년도 {{ releaseYear === 0 ? '정보없음' : releaseYear }}
      </h4>
      <button type="button" class="btn btn-outline-secondary">편잡하기</button>
      <hr>
      <br>

      <h4 class="slide-title">
        Ratings
        <span>⭐
            {{ avgRating + "/" + nop }} 명 참여중
          </span>
      </h4>
      <button type="button" class="btn btn-outline-secondary">평가하기</button>
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

      <h2>About</h2><span>ai가 작성한 내용입니다.</span>
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
  </div>
  <KcksHstryEditor v-if="isShowEditor" :orgMdfctnCntnt="orgMdfctnCntnt" @update:mdfctnCntnt="updateContent" :mdfctnCntnt="mdfctnCntnt"
                   :commCdDtl="currCard" :content="content" @close-editor="isShowEditor=false" :kcksHstryMdfctnVer="kcksHstryMdfctnVer"></KcksHstryEditor>
  <!--  <KcksHstryEditor :hstryContent="hstryContent" @update:hstryContent="updateContent" :currCard="currCard"></KcksHstryEditor>-->
</template>

<style scoped>

</style>