<template>
<div class="new-post-container" :class="{ 'is-mobile': isMobile }">
    <div class="new-post-card fade-in-up">
      <div class="card-header">
        <h1 class="page-title">
          <font-awesome-icon :icon="['fas', 'pen']" class="title-icon" />
          새 글 작성
        </h1>
        <p class="page-sub">커뮤니티에 패션 이야기를 남겨보세요</p>
      </div>

      <div class="form-group horizontal">
        <label class="form-label">제목</label>
        <div class="input-wrap full">
          <span class="input-icon"><font-awesome-icon :icon="['fas', 'heading']" /></span>
          <input v-model="title" type="text" placeholder="제목을 입력하세요" class="text-input" />
        </div>
      </div>

      <div class="form-group horizontal">
        <label class="form-label" for="nickname">닉네임</label>
        <div class="input-wrap">
          <span class="input-icon"><font-awesome-icon :icon="['fas', 'user']" /></span>
          <input id="nickname" v-model="nickname" type="text" placeholder="닉네임" class="text-input" />
        </div>
      </div>

      <div class="form-group horizontal">
        <label class="form-label" for="password">비밀번호</label>
        <div class="input-wrap">
          <span class="input-icon"><font-awesome-icon :icon="['fas', 'lock']" /></span>
          <input id="password" v-model="password" type="password" :disabled="isPasswordLocked" placeholder="비밀번호" class="text-input" />
        </div>
      </div>

      <div class="editor-card">
        <QuillEditor
          ref="quill"
          v-model:content="content"
          content-type="html"
          :options="options"
          class="quill-wrap"
        />
      </div>

      <div class="actions">
        <button class="write-button" @click="submitPost">등록</button>
      </div>
    </div>

    <CommonModal
      :show="showConfirmModal"
      :content="alertMsg"
      type="alert"
      @confirm="handleConfirm"
    />
  </div>
</template>

<script setup>
import {QuillEditor} from "@vueup/vue-quill";
import Quill from 'quill';
import ImageResize from 'quill-image-resize-vue';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import {nextTick, onActivated, onMounted, ref, onUnmounted} from "vue";
import axios from 'axios';
import CommonModal from "@/components/CommonModal.vue";
import router from "@/js/router";
import { useRoute } from "vue-router";

Quill.register('modules/imageResize', ImageResize);
const route = useRoute();
const title = ref("");
const content = ref("");
const nickname = ref("");
const password = ref("");
const pstNo = ref("");
const showConfirmModal = ref(false);
const quill = ref(null);
const alertMsg = ref("");
const isEdit = ref(false);
const isPasswordLocked = ref(false);

function resetForm() {
  title.value = "";
  content.value = "";
  const localNick = localStorage.getItem("nickname");
  if(localNick){
    nickname.value = localNick;
  }else{
    nickname.value = "";
  }
  password.value = "";
  pstNo.value = "";
  showConfirmModal.value = false;

  nextTick(() => {
    const q = quill.value?.getQuill();
    if (q) {
      q.setText("");
      q.history?.clear?.();
    }
  });
}

async function fetchPost(id) {
  try {
    const res = await axios.get(`/psts/${id}`);
    const post = res.data;
    title.value = post.pstTitl;
    content.value = post.pstCntnt;
    nickname.value = post.id;
    pstNo.value = post.pstNo;
  } catch (e) {
    console.error(e);
    handleAlert("글을 불러오지 못했습니다");
  }
}

function handleAlert(msg) {
  alertMsg.value = msg;
  showConfirmModal.value = true;
}

// 라우트 진입 시(초회) 초기화
onMounted(() => {
  if (route.params.id) {
    isEdit.value = true;
    const histState = window.history.state || {}
    password.value = histState.verifiedPassword
    isPasswordLocked.value = true
    history.replaceState({}, "")
    fetchPost(route.params.id); // 기존 글 가져오기
  }else{
    resetForm();
  }
});

// keep-alive로 캐시된 화면이면 재진입 때도 초기화
onActivated(() => {
  if (!route.params.id) {
    resetForm();
  }
});

// mobile detection (replace media queries)
const isMobile = ref(false)
function updateIsMobile(){ isMobile.value = window.innerWidth <= 768 }
onMounted(() => { updateIsMobile(); window.addEventListener('resize', updateIsMobile) })
onUnmounted(() => window.removeEventListener('resize', updateIsMobile))
const options = {
  theme: "snow",
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote', 'code-block'],
      ['link', 'image', 'video', 'formula'],
      [{'header': 1}, {'header': 2}],               // custom button values
      [{'list': 'ordered'}, {'list': 'bullet'}, {'list': 'check'}],
      [{'script': 'sub'}, {'script': 'super'}],
      [{'indent': '-1'}, {'indent': '+1'}],
      [{'direction': 'rtl'}],
      [{'size': ['small', false, 'large', 'huge']}],
      [{'header': [1, 2, 3, 4, 5, 6, false]}],
      [{'color': ['white', 'red', 'green', 'yellow', 'blue', 'grey', 'black']}, {'background': []}],
      [{'font': []}],
      [{'align': []}],
      ['clean']
    ],
    imageResize: {
      modules: [ 'Resize', 'DisplaySize' ], // 핸들 + 크기표시
    },
  },
};

async function submitPost() {
  if (!title.value.trim()) {
    handleAlert("제목을 입력하세요");
    return;
  }
  const q = quill.value?.getQuill();
  if (!q || !q.root.innerHTML.trim() || q.getText().trim() === "") {
    handleAlert("내용을 입력하세요");
    return;
  }
  if (!nickname.value.trim()) {
    handleAlert("닉네임을 입력하세요");
    return;
  }

  console.log(password.value);

  if (!password.value.trim()) {
    handleAlert("비밀번호를 입력하세요");
    return;
  }

  try {
    if(isEdit.value){
      console.log(password.value);
      await axios.patch(`/psts/${pstNo.value}`, {
        pstNo: pstNo.value,
        pstTitl: title.value,
        pstCntnt: content.value,
        regNm: nickname.value,
        pstPwd: password.value,
      });
      handleAlert("수정되었습니다");
    }else{
      const res = await axios.post("/psts", {
        pstTitl: title.value,
        pstCntnt: content.value,
        regNm: nickname.value,
        pstPwd: password.value,
        pstTypeCd: "F",
      });

      const no = res.data?.pstNo;   // ✅ 바디에서 꺼냄
      if (no) {
        pstNo.value = no;
      }
      localStorage.setItem("nickname", nickname.value);
      handleAlert("등록 되었습니다");
    }
  } catch (err) {
    console.error(err);

    handleAlert("등록 오류");
  }
}

function handleConfirm() {
  if(pstNo.value != null && pstNo.value != "") {
    showConfirmModal.value = false;
    router.push({ path: `/kc/${pstNo.value}`, query: { t: Date.now() } })
  }else{
    showConfirmModal.value = false;
  }
}
</script>

<style scoped>
@import '../css/main.css';
@import '../css/common.css';

.new-post-container :deep(.quill-wrap) {
  background: #121212;
}

.new-post-container :deep(.ql-container.ql-snow) {
  background: #121212;
}

.new-post-container :deep(.ql-editor) {
  background: #121212;
}
</style>