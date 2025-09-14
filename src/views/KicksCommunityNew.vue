<template>
<div style="display: flex; justify-content: center; flex-direction: column; justify-items: center; align-items: center;">
  <div style="display: flex; justify-content: center; flex-direction: column; justify-items: center; align-items: center; margin-top:3rem; padding-left: 3rem; padding-right: 3rem; max-width: 1000px; width: 100%;">
    <input
        v-model="title"
        type="text"
        placeholder="제목을 입력하세요"
        class ="search-input"
        style="width:100%; padding: 0.5rem; margin-bottom:1rem; font-size:1rem;"
    />

    <div style="display:flex; width:100%; gap:1rem; margin-bottom:1rem;">
      <input
          v-model="nickname"
          type="text"
          placeholder="닉네임"
          class ="search-input"
          style="flex:1; padding:0.5rem; font-size:1rem;"
      />
      <input
          v-model="password"
          type="password"
          placeholder="비밀번호"
          style="flex:1; padding:0.5rem; font-size:1rem; visibility: hidden;"
      />
    </div>
    <!-- Quill Editor -->
    <QuillEditor
        ref="quill"
        v-model:content="content"
        content-type="html"
        :options="options"
        style="height: 40rem; width:100%; background:#fff;"
    />

    <!-- 등록 버튼 -->
    <div style="display: flex; justify-content: flex-end; width:100%; margin-top:1rem; margin-bottom:1rem;">
      <button class="write-button" @click="submitPost">등록</button>
    </div>
  </div>
</div>

  <CommonModal
      :show="showConfirmModal"
      :content="alertMsg"
      type="alert"
      @confirm="handleConfirm"
  />
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

<style>
.write-button {
  width: 4rem;
  height: 2rem;
  padding: 8px;
  background-color: var(--color6);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  font-family: var(--sub-font);
}
.write-button:hover {
  background-color: #2988c8;
}
.search-input {
  flex: 1;
  padding: 6px 8px;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  font-family: var(--main-font);
  background-color: rgba(255, 255, 255, 0.1);
  color: var(--color1);
}
</style>