<template>
  <div class="community-detail">
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
import { onMounted, ref, watch } from 'vue'
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

.community-detail { max-width: 1100px; margin: 0 auto; padding: 1rem 0.5rem 2rem; }

.detail-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.10) 0%, rgba(255, 255, 255, 0.05) 100%);
  border: 1px solid rgba(255, 255, 255, 0.10);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  backdrop-filter: blur(10px);
  padding: 1.25rem 1.25rem 1rem;
  margin-bottom: 1.25rem;
}

.detail-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; margin-bottom: 0.75rem; }
.detail-title { margin: 0 0 0.5rem 0; color: var(--color1); font-family: var(--sub-font); font-size: 1.75rem; font-weight: 700; }
.title-underline { width: 100%; height: 3px; background: linear-gradient(90deg, var(--color6), transparent 60%); border-radius: 999px; opacity: 0.6; margin: 0.25rem 0 0.5rem; }
.detail-meta { display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem; color: rgba(255,255,255,0.75); font-size: 0.95rem; }
.meta-item { display: inline-flex; align-items: center; gap: 0.375rem; }
.dot { opacity: 0.5; }

.detail-content .content { white-space: pre-wrap; line-height: 1.8; font-size: 1.05rem; color: var(--color1); }
.detail-content .content h1,.detail-content .content h2,.detail-content .content h3 { color: var(--color1); font-family: var(--sub-font); margin-top: 1.2rem; margin-bottom: 0.6rem; }
.detail-content .content h1 { font-size: 1.6rem; }
.detail-content .content h2 { font-size: 1.35rem; }
.detail-content .content h3 { font-size: 1.2rem; }
.detail-content .content a { color: var(--color6); text-decoration: underline; }
.detail-content .content blockquote { margin: 0.75rem 0; padding: 0.75rem 1rem; border-left: 3px solid var(--color6); background: rgba(255,255,255,0.06); border-radius: 6px; }
.detail-content .content img { max-width: 100%; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.25); }
.detail-content .content code { background: rgba(0,0,0,0.3); padding: 0.1rem 0.35rem; border-radius: 6px; }

.comments-card { background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; box-shadow: 0 8px 28px rgba(0,0,0,0.15); backdrop-filter: blur(10px); padding: 1rem 1.25rem 1.25rem; }
.comments-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem; }
.comments-title { display: flex; align-items: center; gap: 0.5rem; margin: 0; color: var(--color1); font-family: var(--sub-font); font-size: 1.25rem; font-weight: 700; }
.comments-title .title-icon { color: var(--color6); }
.badge { background: linear-gradient(135deg, var(--color6), #2a7a7f); border: 1px solid rgba(255,255,255,0.15); color: #fff; border-radius: 999px; padding: 0.1rem 0.5rem; font-size: 0.8rem; }

.comment-form { padding: 0.5rem 0 1rem; }
.top-form { padding-bottom: 0.75rem; border-bottom: 1px solid rgba(255,255,255,0.08); }
.form-row { display: flex; gap: 0.5rem; }
.comment-nickname{ width: 9rem; height: 2.25rem; padding: 0 0.6rem; border: none; background-color: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 10px; color: var(--color1); }
.comment-nickname:focus{ outline: none; border-color: var(--color6); background-color: rgba(255, 255, 255, 0.12); }
.comment-textarea { flex: 1; min-height: 90px; padding: 0.6rem 0.8rem; border: none; background-color: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 10px; color: var(--color1); resize: vertical; }
.comment-textarea:focus{ outline: none; border-color: var(--color6); background-color: rgba(255, 255, 255, 0.12); }
.form-actions { display: flex; justify-content: flex-end; margin-top: 0.5rem; }
.comment-submit { border: none; padding: 0.55rem 1rem; cursor: pointer; border-radius: 10px; background: linear-gradient(135deg, var(--color6), #2a7a7f); color: white; font-size: 0.95rem; font-family: var(--sub-font); font-weight: 600; box-shadow: 0 8px 24px rgba(0,0,0,0.2); transition: all 0.2s ease; }
.comment-submit:hover { transform: translateY(-1px); filter: brightness(1.05); }
.comment-submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; filter: none; }

/* Input aesthetics */
.input-wrap,
.textarea-wrap {
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  transition: all 0.2s ease;
}

.input-wrap { max-width: 240px; }

.input-wrap:focus-within,
.textarea-wrap:focus-within {
  border-color: var(--color6);
  box-shadow: 0 0 0 2px rgba(255, 160, 0, 0.15);
  background: rgba(255, 255, 255, 0.12);
}

.input-icon {
  position: absolute;
  left: 10px;
  color: rgba(255, 244, 204, 0.7);
  font-size: 0.9rem;
  pointer-events: none;
}

.input-wrap .comment-nickname {
  width: 100%;
  height: 2.4rem;
  padding: 0 0.75rem 0 2rem;
  border: none;
  background: transparent;
  color: var(--color1);
}

.textarea-wrap .comment-textarea {
  width: 100%;
  min-height: 110px;
  padding: 0.7rem 0.9rem 0.7rem 2rem;
  background: transparent;
  border: none;
  color: var(--color1);
}

@media (max-width: 768px) {
  .input-wrap { max-width: 100%; }
}

.comments-list { margin-top: 0.5rem; }
.comment { display: grid; grid-template-columns: 40px 1fr; gap: 0.75rem; padding: 0.9rem 0; border-bottom: 1px solid rgba(255,255,255,0.08); }
.comment:last-child { border-bottom: none; }
.reply-comment { padding-left: 0.75rem; border-left: 2px solid rgba(255,255,255,0.08); }
.avatar { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.12); color: var(--color1); font-weight: 700; position: relative; }
.avatar::after { content: ''; position: absolute; inset: -2px; border-radius: 50%; background: conic-gradient(from 180deg, var(--color6), transparent 50%, var(--color6)); z-index: -1; filter: blur(0.3px); }
.comment-meta { display: flex; align-items: center; gap: 0.5rem; color: rgba(255,255,255,0.75); font-size: 0.9rem; }
.comment-writer { font-weight: 600; color: var(--color1); }
.comment-time { margin-left: auto; opacity: 0.7; font-size: 0.8rem; }
.comment-body { margin-top: 0.4rem; color: var(--color1); line-height: 1.7; font-size: 1rem; }
.mention { color: var(--color6); font-weight: 700; margin-right: 4px; }
.comment-actions { margin-top: 0.5rem; }
.reply-btn { background: transparent; border: 1px solid rgba(255,255,255,0.15); color: var(--color1); border-radius: 8px; padding: 0.35rem 0.7rem; cursor: pointer; transition: all 0.2s ease; }
.reply-btn:hover { border-color: var(--color6); transform: translateY(-1px); }

.fade-in-up { animation: fadeInUp 480ms ease both; }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

@media (max-width: 768px) { .detail-title { font-size: 1.4rem; } .detail-meta { font-size: 0.9rem; } .form-row { flex-direction: column; } .comment-nickname { width: 100%; height: 2.1rem; } }
</style>
