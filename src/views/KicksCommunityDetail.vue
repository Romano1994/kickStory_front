<template>
<div class="community-detail" :class="{ 'is-mobile': isMobile }"> 
    <div class="detail-card fade-in-up">
      <div class="detail-header">
        <div class="title-area">
          <h1 class="detail-title">{{ post.pstTitl }}</h1>
          <div class="title-underline"></div>
          <div class="detail-meta">
            <span class="meta-item"><font-awesome-icon :icon="['fas', 'user']" /> {{ post.id }}</span>
            <span class="dot">•</span>
            <span class="meta-item"><font-awesome-icon :icon="['fas', 'comment']" /> {{ post.cmtCnt }}</span>
            <span class="dot">•</span>
            <span class="meta-item"><font-awesome-icon :icon="['fas', 'eye']" /> {{ post.pstHit }}</span>
            <span class="dot">•</span>
            <span class="meta-item"><font-awesome-icon :icon="['fas', 'clock']" /> {{ formatDate(post.regDtt) }}</span>
          </div>
        </div>
      </div>
      <div class="detail-content ql-snow">
        <div class="ql-editor content" v-html="safeHtml(post.pstCntnt)"></div>
      </div>
    </div>

    <div class="comments-card fade-in-up">
      <div class="comments-header">
        <h3 class="comments-title">
          <font-awesome-icon :icon="['fas', 'comments']" class="title-icon" />
          댓글
          <span class="badge">{{ comments.length }}</span>
        </h3>
      </div>

      <!-- 댓글 작성 (상단) -->
      <div class="comment-form top-form" v-if="activeReplyToId === null">
        <div class="form-row">
          <input class="comment-nickname" placeholder="닉네임" v-model="nickname"/>
          <textarea class="comment-textarea" v-model="newComment" placeholder="사이좋게 지내요. 서로를 배려하는 댓글을 남겨주세요."></textarea>
        </div>
        <div class="form-actions">
          <button class="comment-submit" @click="submitReply()" :disabled="!nickname || !nickname.trim() || !newComment || !newComment.trim()">등록</button>
        </div>
      </div>

      <!-- 댓글 목록 -->
      <div class="comments-list">
        <div
          v-for="comment in comments"
          :key="comment.id"
          class="comment"
          :class="{ 'reply-comment': comment.prtId }"
        >
          <div class="comment-left">
            <div class="avatar">{{ (comment.id || '?').toString().charAt(0).toUpperCase() }}</div>
          </div>
          <div class="comment-right">
            <div class="comment-meta">
              <span class="comment-writer">{{ comment.id }}</span>
              <span class="comment-time"><font-awesome-icon :icon="['fas', 'clock']" /> {{ formatDate(comment.regDtt) }}</span>
            </div>
            <div class="comment-body">
              <template v-if="comment.prtId">
                <span class="mention">@{{ comment.prtId }}</span>
              </template>
              {{ comment.cmtCntnt }}
            </div>
            <div class="comment-actions">
              <button class="reply-btn" @click="toggleReply(comment.cmtNo)">{{ activeReplyToId === comment.cmtNo ? '답글 숨기기' : '답글' }}</button>
            </div>
            <div v-if="activeReplyToId === comment.cmtNo" class="reply-form">
              <div class="form-row">
                <input class="comment-nickname" placeholder="닉네임" v-model="nickname"/>
                <textarea class="comment-textarea" v-model="newComment" placeholder="사이좋게 지내요. 서로를 배려하는 댓글을 남겨주세요."></textarea>
              </div>
              <div class="form-actions">
                <button @click="submitReply(comment.cmtNo)" class="comment-submit" :disabled="!nickname || !nickname.trim() || !newComment || !newComment.trim()">등록</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <CommonModal :show="showConfirmModal" :content="alertMsg" type="alert" @confirm="handleConfirm" />
  </div>
</template>

<script setup>
import { onMounted, ref, watch, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import CommonModal from "@/components/CommonModal.vue";
// import router from "@/js/router";
// import auth from "@/js/auth";
import DOMPurify from "dompurify";

const route = useRoute()
const post = ref({})
const nickname = ref("")
const comments = ref([])
const newComment = ref("")
const activeReplyToId = ref(null)
const alertMsg = ref("")

const showConfirmModal = ref(false);

// function closeConfirmModal() {
//   showConfirmModal.value = false;
// }

function handleConfirm(){
  showConfirmModal.value = false;
}

// function openConfirmModal(){
//   showConfirmModal.value = true;
// }

function safeHtml(html) {
  return DOMPurify.sanitize(html)
}

function toggleReply(commentId) {
  if (activeReplyToId.value === commentId) {
    // 이미 열려있으면 닫는다
    activeReplyToId.value = null
  } else {
    // 다른 곳 열려있으면 새로 연다
    activeReplyToId.value = commentId
    newComment.value = ''
  }
}


async function submitReply(cmtNo) {
  try {

    // let isLogin = await auth.getLoginStatus();
    //
    // if(!isLogin){
    //   openConfirmModal();
    //   return;
    // }

    if (!nickname.value?.trim()) {
      handleAlert("닉네임을 입력하세요");
      return;
    }
    if (!newComment.value.trim()) {
      handleAlert("댓글을 입력하세요");
      return;
    }

    await axios.post(`/psts/${route.params.id}/cmts`, {
      prtCmtNo: cmtNo,
      cmtCntnt: newComment.value,
      regNm: nickname.value
    })
    newComment.value = ''
    activeReplyToId.value = null
    localStorage.setItem("nickname", nickname.value);
    await fetchComments() // 새로고침
  } catch (e) {
    console.error(e)
  }
}
function setNickName(){
  const localNick = localStorage.getItem("nickname");
  if (localNick) {
    nickname.value = localNick;
  }
}

function handleAlert(msg) {
  alertMsg.value = msg;
  showConfirmModal.value = true;
}

const fetchPost = async () => {
  const { id } = route.params
  const res = await axios.get(`/psts/${id}`)
  post.value = res.data
}

const fetchComments = async () => {
  const { id } = route.params
  const res = await axios.get(`/psts/${id}/comments`)
  console.log(res)
  comments.value = res.data
}

const formatDate = (utc) => {
  const d = new Date(utc)
  const kst = new Date(d.getTime() + 9 * 60 * 60 * 1000)
  return `${kst.getFullYear()}.${String(kst.getMonth() + 1).padStart(2, '0')}.${String(kst.getDate()).padStart(2, '0')} ${String(kst.getHours()).padStart(2, '0')}:${String(kst.getMinutes()).padStart(2, '0')}`
}

onMounted(() => {
  fetchPost()
  fetchComments()
  setNickName()
})

// mobile detection
const isMobile = ref(false)
function updateIsMobile(){ isMobile.value = window.innerWidth <= 768 }
onMounted(() => {
  updateIsMobile()
  window.addEventListener('resize', updateIsMobile)
})
onUnmounted(() => window.removeEventListener('resize', updateIsMobile))

watch(
    () => route.params.id,
    (id) => {
      if (id) {
        fetchPost()
        fetchComments()
      }
    },
    { immediate: true }
)
</script>

<style scoped>
@import '../css/main.css';
@import '../css/common.css';
</style>
