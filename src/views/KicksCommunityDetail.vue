<template>
  <div class="post-detail">
    <div class="header">
      <h1 class="title">{{ post.pstTitl }}</h1>
    </div>

    <div class="meta">
      <div class="left-meta">
        <span class="writer">{{ post.id }}</span>
        <span class="divider">|</span>
        <span><font-awesome-icon :icon="['fas', 'comment']" /> {{ post.cmtCnt }}</span>
        <span class="divider">|</span>
        <span><font-awesome-icon :icon="['fas', 'eye']" /> {{ post.pstHit }}</span>
      </div>
      <div class="right-time">
        <font-awesome-icon :icon="['fas', 'clock']" /> {{ formatDate(post.regDtt) }}
      </div>
    </div>

    <div class="content">{{ post.pstCntnt }}</div>

    <div class="actions">
      <button class="report"><font-awesome-icon :icon="['fas', 'flag']" /> 신고</button>
    </div>
  </div>

  <!-- 댓글 목록 -->
  <div class="comments">
    <div v-for="comment in comments" :key="comment.id" class="comment">
      <div class="comment-meta">
        <span class="comment-writer">{{ comment.id }}</span>
        <span class="comment-time"><font-awesome-icon :icon="['fas', 'clock']" /> {{ formatDate(comment.regDtt) }}</span>
      </div>
      <div class="comment-body">{{ comment.cmtCntnt }}</div>
      <div class="comment-actions">
        <span class="reply" @click="toggleReply(comment.cmtNo)">
          {{ activeReplyToId === comment.cmtNo ? '답글 숨기기' : '답글' }}
        </span>
      </div>
      <div v-if="activeReplyToId === comment.cmtNo" class="reply-form">
        <textarea class="comment-textarea" v-model="newComment" placeholder="사이좋게 지내요. 서로를 배려하는 댓글을 남겨주세요."></textarea>
        <div style="display: flex; justify-content: flex-end;">
          <button @click="submitReply(comment.cmtNo)" class="comment-submit">등록</button>
        </div>
      </div>
    </div>
  </div>

  <!-- 댓글 작성 -->
  <div class="comment-form" v-if="activeReplyToId === null">
    <textarea class="comment-textarea" v-model="newComment" placeholder="사이좋게 지내요. 서로를 배려하는 댓글을 남겨주세요."></textarea>
    <div style="display: flex; justify-content: flex-end;">
      <button class="comment-submit" @click="submitReply()">등록</button>
    </div>
  </div>

  <CommonModal
      :show="showConfirmModal"
      content="로그인 후 등록 가능합니다. 로그인 하시겠습니까?"
      type="confirm"
      @close="closeConfirmModal"
      @confirm="handleConfirm"
  />
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import CommonModal from "@/components/CommonModal.vue";
import router from "@/js/router";
import auth from "@/js/auth";

const route = useRoute()
const post = ref({})
const comments = ref([])
const newComment = ref(null)
const activeReplyToId = ref(null)

const showConfirmModal = ref(false);

function closeConfirmModal() {
  showConfirmModal.value = false;
}

function handleConfirm(){
  router.push(`/login`);
}

function openConfirmModal(){
  showConfirmModal.value = true;
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

    let isLogin = await auth.getLoginStatus();

    console.log(isLogin);

    if(!isLogin){
      openConfirmModal();
      return;
    }

    await axios.post(`/psts/${route.params.id}/cmts`, {
      prtCmtNo: cmtNo,
      cmtCntnt: newComment.value,
    })
    newComment.value = ''
    activeReplyToId.value = null
    await fetchComments() // 새로고침
  } catch (e) {
    console.error(e)
  }
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

.reply-form {
  margin-top: 10px;
  margin-left: 30px; /* 들여쓰기 */
}
.reply-form textarea {
  width: 100%;
  min-height: 60px;
}

.post-detail {
  color: #eee;
  padding: 24px;
}

.header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.title {
  font-size: 1.5rem;
  flex: 1;
  color: #fff;
}

.meta {
  font-size: 0.85rem;
  color: #aaa;
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.divider {
  margin: 0 8px;
  color: #aaa;
}

.content {
  white-space: pre-wrap;
  line-height: 1.7;
  margin-bottom: 32px;
  font-size: 1.1rem;
}

.actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.report {
  background: darkred;
  border: none;
  color: wheat;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
}

.comments {
  border-top: 1px solid #444;
}

.comment {
  border-bottom: 1px solid #333;
  padding: 10px 24px 10px 24px;
}

.comment-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.85rem;
  color: #ccc;
}

.comment-time {
  margin-left: auto;
  color: #888;
  font-size: 10px;
}

.comment-body {
  margin-top: 8px;
  line-height: 1.6;
  font-size: 1.1rem;
  color: #eee;
}

.comment-actions {
  margin-top: 6px;
  font-size: 0.8rem;
  color: #aaa;
  cursor: pointer;
}

.comment-form {
  padding: 10px 24px 10px 24px;
}
.comment-textarea {
  width: 100%;
  min-height: 80px;
  padding: 8px;
  margin-bottom: 1px;
  border: none;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  color: var(--color1);
}

.comment-textarea:focus{
  outline: none;
  border-color: var(--color6);
  background-color: rgba(255, 255, 255, 0.15);
}

.comment-submit {
  border: none;
  padding: 6px 12px;
  cursor: pointer;
  border-radius: 4px;
  background-color: var(--color6);
  color: white;
  font-size: 1rem;
  font-family: var(--main-font);
}
</style>
