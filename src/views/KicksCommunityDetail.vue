<template>
  <div class="post-detail">
    <div class="header">
      <h1 class="title">{{ post.pstTitl }}</h1>
    </div>

    <div class="meta">
      <div class="left-meta">
        <span class="writer">{{ post.id }}</span>
        <span class="divider">|</span>
        <span>(말풍선이모티콘) {{ post.commentCnt }}</span>
        <span class="divider">|</span>
        <span>(눈알모양이모티콘) {{ post.pstHit }}</span>
      </div>
      <div class="right-time">
        🕒 {{ formatDate(post.regDtt) }}
      </div>
    </div>

    <div class="content">{{ post.pstCntnt }}</div>

    <div class="actions">
      <button class="report">⛔ 신고</button>
    </div>
  </div>

  <!-- 댓글 목록 -->
  <div class="comments">
    <div v-for="comment in comments" :key="comment.id" class="comment">
      <div class="comment-meta">
        <span class="comment-writer">{{ comment.id }}</span>
        <span class="comment-time">🕒 {{ formatDate(comment.regDtt) }}</span>
      </div>
      <div class="comment-body">{{ comment.cmtCntnt }}</div>
      <div class="comment-actions">
        <span class="reply">답글</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const post = ref({})
const comments = ref([])

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
</script>

<style scoped>
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

.number-box {
  background: #bfae5c;
  color: black;
  font-weight: bold;
  border-radius: 6px;
  padding: 4px 10px;
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
  color: #aaa;
}

.content {
  white-space: pre-wrap;
  line-height: 1.7;
  margin-bottom: 32px;
  font-size: 1rem;
}

.actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.report, .share, .scrap {
  background: cornsilk;
  border: none;
  color: black;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
}

.recommend-box {
  margin-left: auto;
  background: #2e2e2e;
  border-radius: 8px;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.icon {
  width: 20px;
  height: 20px;
}

.spacer {
  flex-grow: 1;
}

.comments {
  border-top: 1px solid #444;
}

.comment {
  padding-bottom: 16px;
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
  color: #eee;
}

.comment-actions {
  margin-top: 6px;
  font-size: 0.8rem;
  color: #aaa;
  cursor: pointer;
}
</style>
