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
      <div class="form-actions">
        <div class="form-actions" style="gap : 0.3rem;">
          <button @click="goToList" class="back-button">목록으로</button>
          <button @click="passwordModal('updatePst')" class="comment-modify">수정</button>
          <button @click="passwordModal('deletePst')" class="comment-modify">삭제</button>
        </div>
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
          <div class="comment-header">
            <input class="comment-nickname" placeholder="닉네임" v-model="nickname"/>
            <input class="comment-nickname" type="password" placeholder="비밀번호" v-model="password"/>
          </div>
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
          <template v-if="comment.cmtUseYn === 'N'">
            <div class="comment-left">
            </div>
            <div class="comment-right">
              <div class="comment-body deleted">
                삭제된 댓글입니다.
              </div>
            </div>
          </template>
          <template v-else-if="comment.isEditing">
            <div class="comment-left">
              <!-- 아바타는 비워두거나 회색 처리 -->
              <div class="avatar">{{ (comment.id || '?').toString().charAt(0).toUpperCase() }}</div>
            </div>
            <div class="comment-right">
              <div class="reply-form">
                <div class="form-row">
                  <div class="comment-header">
                    <input class="comment-nickname" v-model="comment.editNickname" />
                    <input class="comment-nickname" type="password" placeholder="비밀번호" disabled v-model="comment.editPassword" />
                  </div>
                  <textarea
                      class="comment-textarea"
                      v-model="comment.editContent"
                      placeholder="댓글을 수정하세요"
                  ></textarea>
                </div>
                <div class="form-actions" style="display: flex; gap:0.4rem;">
                  <button
                      @click="saveEdit(comment)"
                      class="comment-submit"
                      :disabled="!comment.editContent || !comment.editContent.trim()  || !comment.editNickname || !comment.editNickname.trim()"
                  >
                    저장
                  </button>
                </div>
              </div>
            </div>
          </template>
          <template v-else>
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
                <button class="reply-btn" @click="passwordModal('updateCmt', comment)">수정</button>
                <button class="reply-btn" @click="passwordModal('deleteCmt', comment.cmtNo)">삭제</button>
              </div>
              <div v-if="activeReplyToId === comment.cmtNo" class="reply-form">
                <div class="form-row">
                  <div class="comment-header">
                    <input class="comment-nickname" placeholder="닉네임" v-model="nickname"/>
                    <input class="comment-nickname" type="password" placeholder="비밀번호" v-model="password"/>
                  </div>
                  <textarea class="comment-textarea" v-model="newComment" placeholder="사이좋게 지내요. 서로를 배려하는 댓글을 남겨주세요."></textarea>
                </div>
                <div class="form-actions">
                  <button @click="submitReply(comment.cmtNo)" class="comment-submit" :disabled="!nickname || !nickname.trim() || !newComment || !newComment.trim() || !password || !password.trim()">등록</button>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <CommonModal :show="showConfirmModal" :content="alertMsg" type="alert" @confirm="handleConfirm" />
    <CommonModal :show="showPasswordModal"
                 :useInput="true"
                 v-model="passwordInput"
                 content="비밀번호를 입력하세요"
                 type="confirm"
                 @confirm="handlePasswordConfirm"
                 @close="closePasswordModal"
    />
  </div>
</template>

<script setup>
import { onMounted, ref, watch, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import CommonModal from "@/components/CommonModal.vue";
import DOMPurify from "dompurify";

const route = useRoute()
const router = useRouter()
const post = ref({})
const nickname = ref("")
const password = ref("")
const comments = ref([])
const newComment = ref("")
const activeReplyToId = ref(null)
const alertMsg = ref("")
const modifyFlag = ref(null);
const modifyCmt = ref(null);
const redirectAfterConfirm = ref(null);

const showConfirmModal = ref(false)
const showPasswordModal = ref(false)
const passwordInput = ref("")

// function closeConfirmModal() {
//   showConfirmModal.value = false;
// }

function handleConfirm(){
  showConfirmModal.value = false;

  if (redirectAfterConfirm.value) {
    router.push(redirectAfterConfirm.value)
    redirectAfterConfirm.value = null
  }
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

function passwordModal(flag, cmt = null){
  modifyFlag.value = flag;
  console.log(cmt);
  modifyCmt.value = cmt;
  showPasswordModal.value = true;
}

function closePasswordModal(){
  modifyFlag.value = null;
  modifyCmt.value = null;
  showPasswordModal.value = false;
}

function handlePasswordConfirm(password){
  if (!password || !password.trim()) {
    handleAlert("비밀번호를 입력하세요");
    return;
  }

  if (modifyFlag.value === 'updatePst') {
    updatePst(password);
  } else if (modifyFlag.value === 'deletePst') {
    deletePst(password);
  } else if (modifyFlag.value === 'updateCmt') {
    verifyCmtPassword(password);
  } else if (modifyFlag.value === 'deleteCmt') {
    deleteCmt(password);
  }
}

async function verifyCmtPassword(password) {
  try {
    const { id } = route.params
    const cmt = modifyCmt.value
    // 서버에 비밀번호 검증 API 호출
    const res = await axios.post(`/psts/${id}/cmts/${cmt.cmtNo}/checkPassword`, { password })
    if (res.data?.valid) {
      // 편집모드 진입
      cmt.isEditing = true
      cmt.editContent = cmt.cmtCntnt
      cmt.editPassword = password
      cmt.editNickname = cmt.id
    } else {
      handleAlert("비밀번호가 일치하지 않습니다.")
    }
  } catch (e) {
    console.error(e)
    if(e.response?.status === 401){
      handleAlert("비밀번호가 일치하지 않습니다.")
    }else{
      handleAlert("비밀번호 확인 중 오류가 발생했습니다.")
    }
  } finally {
    passwordInput.value = ""
    closePasswordModal();
  }
}
async function updatePst(password) {
  try {
    const { id } = route.params
    // 서버에 비밀번호 검증 API 호출
    const res = await axios.post(`/psts/${id}/checkPassword`, { password })
    if (res.data?.valid) {
      router.push({
        name: 'KicksCommunityEdit',  // 라우터에서 edit 화면 name
        params: { id },
        state: { verifiedPassword: password }
      })
    }
  } catch (e) {
    console.error(e)
    if(e.response?.status === 401){
      handleAlert("비밀번호가 일치하지 않습니다.")
    }else{
      handleAlert("비밀번호 확인 중 오류가 발생했습니다.")
    }
  } finally {
    passwordInput.value = ""
    closePasswordModal();
  }
}
async function deletePst(password) {
  try {
    const { id } = route.params
    await axios.delete(`/psts/${id}`, {
      data: { password }
    })

    handleAlert("게시글이 삭제되었습니다.","/kc");
  } catch (e) {
    console.error(e)
    if (e.response?.status === 401) {
      handleAlert("비밀번호가 일치하지 않습니다.");
    } else {
      handleAlert("삭제 중 오류가 발생했습니다.");
    }
  } finally {
    passwordInput.value = "";
    closePasswordModal();
  }
}
async function saveEdit(comment) {
  try {
    await axios.patch(`/psts/${route.params.id}/comments/${comment.cmtNo}`, {
      cmtCntnt: comment.editContent,
      regNm: comment.editNickname,     // ← 닉네임도 업데이트
      password: comment.editPassword
    })
    handleAlert("댓글이 수정되었습니다.");
    await fetchComments();
  } catch (e) {
    handleAlert("수정 중 오류가 발생했습니다.")
  } finally {
    passwordInput.value = "";
    closePasswordModal();
  }
}
async function deleteCmt(password) {
  try {
    const { id } = route.params
    await axios.delete(`/psts/${id}/comments/`+modifyCmt.value, {
      data: { password }
    })

    handleAlert("댓글이 삭제되었습니다");
    await fetchComments();
  } catch (e) {
    console.error(e)
    if (e.response?.status === 401) {
      handleAlert("비밀번호가 일치하지 않습니다.");
    } else {
      handleAlert("삭제 중 오류가 발생했습니다.");
    }
  } finally {
    passwordInput.value = "";
    closePasswordModal();
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
    if (!password.value.trim()) {
      handleAlert("비밀번호를 입력하세요");
      return;
    }

    await axios.post(`/psts/${route.params.id}/cmts`, {
      prtCmtNo: cmtNo,
      cmtCntnt: newComment.value,
      cmtPwd: password.value,
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

function handleAlert(msg, redirectPath = null) {
  alertMsg.value = msg;
  redirectAfterConfirm.value = redirectPath;
  showConfirmModal.value = true;
}

function goToList() {
  router.push('/kc');
}

const fetchPost = async () => {
  const { id } = route.params
  const res = await axios.get(`/psts/${id}`)
  post.value = res.data
}

const fetchComments = async () => {
  const { id } = route.params
  const res = await axios.get(`/psts/${id}/comments`)
  comments.value = res.data.map(c => ({
    ...c,
    isEditing: false,
    editContent: "",
    editPassword: "",
    editNickname: c.id
  }))
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
@import '../css/kicksCommunityDetail.css';
</style>
