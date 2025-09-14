<template>
  <div class="new-post-container">
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

      <div class="form-group" style="display:none;">
        <label class="form-label" for="password">비밀번호</label>
        <div class="input-wrap">
          <span class="input-icon"><font-awesome-icon :icon="['fas', 'lock']" /></span>
          <input id="password" v-model="password" type="password" placeholder="비밀번호" class="text-input" />
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
import {nextTick, onActivated, onMounted, ref} from "vue";
import axios from 'axios';
import CommonModal from "@/components/CommonModal.vue";
import router from "@/js/router";

Quill.register('modules/imageResize', ImageResize);

const title = ref("");
const content = ref("");
const nickname = ref("");
const password = ref("");
const pstNo = ref("");
const showConfirmModal = ref(false);
const quill = ref(null);
const alertMsg = ref("");

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

function handleAlert(msg) {
  alertMsg.value = msg;
  showConfirmModal.value = true;
}

// 라우트 진입 시(초회) 초기화
onMounted(() => {
  resetForm();
});

// keep-alive로 캐시된 화면이면 재진입 때도 초기화
onActivated(() => {
  resetForm();
});

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
  // if (!password.value.trim()) {
  //   handleAlert("비밀번호를 입력하세요");
  //   return;
  // }

  try {
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

  } catch (err) {
    console.error(err);

    handleAlert("등록 오류");
  }
}

function handleConfirm() {
  if(pstNo.value != null && pstNo.value != "") {
    router.push("/kc/"+pstNo.value);
  }else{
    showConfirmModal.value = false;
  }
}
</script>

<style scoped>
@import '../css/main.css';

.new-post-container { max-width: 1100px; margin: 0 auto; padding: 1rem 0.5rem 2rem; }

.new-post-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.10) 0%, rgba(255, 255, 255, 0.05) 100%);
  border: 1px solid rgba(255, 255, 255, 0.10);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  backdrop-filter: blur(10px);
  padding: 1.25rem;
}

.card-header { margin-bottom: 1rem; padding-bottom:3rem; }
.page-title { margin: 0; display: flex; align-items: center; gap: 0.6rem; color: var(--color1); font-family: var(--sub-font); font-size: 1.6rem; font-weight: 700; }
.title-icon { color: var(--color6); }
.page-sub { margin: 0.25rem 0 0; color: rgba(255,255,255,0.75); font-family: var(--main-font); font-size: 0.95rem; }

.form-group { margin-bottom: 0.75rem; }
.form-label { display: block; margin: 0 0 0.4rem; color: var(--color1); font-family: var(--sub-font); font-size: 0.95rem; font-weight: 600; }
.form-row { display: flex; gap: 0.75rem; margin-bottom: 0.75rem; flex-wrap: wrap; }

/* Horizontal form layout (label on the left) */
.form-group.horizontal {
  display: grid;
  grid-template-columns: 120px 1fr;
  align-items: center;
  column-gap: 0.75rem;
}
.form-group.horizontal .form-label {
  margin: 0; /* remove bottom margin when horizontal */
  text-align: left;
}
.form-group.horizontal .input-wrap.full { min-width: 0; }

.input-wrap { position: relative; display: flex; align-items: center; flex: 1; min-width: 240px; background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 12px; transition: all 0.2s ease; }
.input-wrap.full { min-width: 100%; }
.input-wrap:focus-within { border-color: var(--color6); box-shadow: 0 0 0 2px rgba(255, 160, 0, 0.15); background: rgba(255, 255, 255, 0.12); }
.input-icon { position: absolute; left: 12px; color: rgba(255, 244, 204, 0.7); font-size: 0.9rem; pointer-events: none; }
.text-input { width: 100%; height: 2.6rem; padding: 0 0.9rem 0 2.1rem; border: none; background: transparent; color: var(--color1); font-family: var(--main-font); font-size: 0.95rem; }
.text-input::placeholder { color: rgba(255, 244, 204, 0.6); }

.editor-card { background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12); border-radius: 12px; overflow: hidden; height: 52rem; display: flex; flex-direction: column; }
.quill-wrap { flex: 1; width: 100%; background: #fff; display: flex; flex-direction: column; min-height: 0; }

/* Quill styling */
:deep(.ql-toolbar.ql-snow) {
  background: linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.85) 100%);
  border: none;
  border-bottom: 1px solid rgba(0,0,0,0.08);
  padding: 4px 6px; /* reduce toolbar padding */
}

:deep(.ql-toolbar .ql-picker),
:deep(.ql-toolbar .ql-picker-label),
:deep(.ql-toolbar .ql-picker-item),
:deep(.ql-toolbar button) {
  color: #333;
  height: 28px;           /* reduce control height */
  line-height: 28px;
}

:deep(.ql-toolbar button) {
  padding: 2px 6px;       /* tighter buttons */
}

:deep(.ql-toolbar button:hover),
:deep(.ql-toolbar .ql-picker-label:hover),
:deep(.ql-toolbar .ql-picker-item:hover) {
  background: rgba(0,0,0,0.06);
  border-radius: 6px;
}

:deep(.ql-toolbar button.ql-active),
:deep(.ql-toolbar .ql-picker-label.ql-active) {
  background: rgba(255,160,0,0.15);
  color: #000;
  border-radius: 6px;
}

:deep(.ql-container.ql-snow) {
  border: none;
  width: 100%;
}

:deep(.ql-editor) {
  font-family: var(--main-font);
  color: var(--color1); /* use light theme text for dark backgrounds */
  line-height: 1.75;
  padding: 1rem 1.2rem;
}

/* Ensure toolbar on top and editor fills below */
:deep(.quill-wrap > .ql-container) {
  flex: 1;
  min-height: 0; /* allow flexbox to compute height correctly */
}

/* Editor placeholder */
:deep(.ql-editor.ql-blank::before) {
  color: rgba(0,0,0,0.35);
  font-style: normal;
}

/* Editor content typography */
:deep(.ql-editor h1) { font-size: 1.8rem; margin: 1rem 0 0.6rem; font-family: var(--sub-font); }
:deep(.ql-editor h2) { font-size: 1.5rem; margin: 0.9rem 0 0.5rem; font-family: var(--sub-font); }
:deep(.ql-editor h3) { font-size: 1.3rem; margin: 0.8rem 0 0.4rem; font-family: var(--sub-font); }
:deep(.ql-editor a) { color: #2a7a7f; text-decoration: underline; }
:deep(.ql-editor blockquote) {
  margin: 0.8rem 0;
  padding: 0.6rem 0.9rem;
  border-left: 3px solid #2a7a7f;
  background: rgba(42,122,127,0.08);
  border-radius: 6px;
}
:deep(.ql-editor pre) {
  background: #0f172a;
  color: #e2e8f0;
  border-radius: 8px;
  padding: 0.8rem;
  overflow: auto;
}

/* Lists spacing */
:deep(.ql-editor ol),
:deep(.ql-editor ul) { padding-left: 1.2rem; }
:deep(.ql-editor li) { margin: 0.2rem 0; }

/* Images */
:deep(.ql-editor img) {
  max-width: 100%;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
}

/* Scrollbar polish (WebKit) */
:deep(.ql-editor::-webkit-scrollbar) { width: 10px; }
:deep(.ql-editor::-webkit-scrollbar-thumb) { background: rgba(0,0,0,0.2); border-radius: 10px; }

/* Selection color */
:deep(.ql-editor)::selection { background: rgba(255,160,0,0.25); }

.actions { display: flex; justify-content: flex-end; margin-top: 1rem; }
.write-button { padding: 0.6rem 1.4rem; background: linear-gradient(135deg, var(--color6), #2a7a7f); color: #fff; border: none; border-radius: 12px; cursor: pointer; font-size: 0.95rem; font-family: var(--sub-font); font-weight: 700; box-shadow: 0 8px 24px rgba(0,0,0,0.2); transition: all 0.2s ease; }
.write-button:hover { transform: translateY(-1px); filter: brightness(1.05); }

.fade-in-up { animation: fadeInUp 480ms ease both; }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

@media (max-width: 768px) {
  .text-input { height: 2.4rem; }
  .input-wrap { min-width: 100%; }
  .form-group.horizontal {
    display: block;
  }
  .form-group.horizontal .form-label {
    margin: 0 0 0.4rem;
  }
  .editor-card { height: 70vh; }
}
</style>