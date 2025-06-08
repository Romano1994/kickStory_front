<template>
  <div>
    <table style="width: 100%; table-layout: fixed; font-size: 1.2rem;">
      <colgroup>
        <col style="width: auto;" />
        <col style="width: 120px;" />
        <col style="width: 70px;" />
        <col style="width: 120px;" />
      </colgroup>
      <thead>
      <tr style="color: cornsilk; text-align: center; border-bottom: 1px solid white;">
        <th>제목</th>
        <th>작성자</th>
        <th>조회수</th>
        <th>날짜</th>
      </tr>
      </thead>
      <tbody style="color: white;">
      <tr v-for="item in items" :key="item.id" style="border-bottom: 1px solid white; padding: 5px 0 5px 0;">
        <td style="padding-left: 10px; cursor: pointer;" class="postTitle"
            @click="goToDetail(item.pstNo)"
        >{{ item.pstTitl }}&nbsp;&nbsp;<span v-if="item.cmtCnt > 0" style="color:grey"><font-awesome-icon :icon="['fas', 'comment']" size="xs" />{{ item.cmtCnt }}</span></td>
        <td style="text-align: center">{{ item.id }}</td>
        <td style="text-align: center">{{ item.pstHit }}</td>
        <td style="text-align: center">{{ formatDate(item.regDtt) }}</td>
      </tr>
      </tbody>
    </table>

    <!-- paging -->
    <div style="display: flex; justify-content: center;">
      <vue-awesome-paginate
          v-model="currentPage"
          :total-items="totalItems"
          :items-per-page="itemsPerPage"
          :max-pages-shown="5"
          :show-breakpoint-buttons="false"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import axios from 'axios'
import { VueAwesomePaginate } from 'vue-awesome-paginate'
import { useRouter } from 'vue-router'
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

const router = useRouter()
const currentPage = ref(1)
const itemsPerPage = 40
const items = ref([])
const totalItems = ref(0)

function goToDetail(id) {
  router.push(`/kc/${id}`)
}

const fetchData = async () => {
  try {
    const response = await axios.get('/psts', {
      params: {
        page: currentPage.value,
        pageSize: itemsPerPage,
      },
    })
    items.value = response.data.list
    totalItems.value = response.data.total
  } catch (err) {
    console.error('데이터 로딩 실패:', err)
  }
}

watch(currentPage, fetchData)
onMounted(fetchData)

const formatDate = (utcString) => {
  const utcDate = new Date(utcString)
  const kstOffsetMs = 9 * 60 * 60 * 1000
  const kstDate = new Date(utcDate.getTime() + kstOffsetMs)
  const now = new Date()

  const diffMs = now - kstDate
  const diffDay = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDay < 1) {
    const hh = String(kstDate.getHours()).padStart(2, '0')
    const mm = String(kstDate.getMinutes()).padStart(2, '0')
    return `${hh}:${mm}`
  } else if (diffDay < 7) {
    return `${diffDay}일 전`
  } else {
    const yyyy = kstDate.getFullYear()
    const mm = String(kstDate.getMonth() + 1).padStart(2, '0')
    const dd = String(kstDate.getDate()).padStart(2, '0')
    return `${yyyy}.${mm}.${dd}`
  }
}
</script>

<style>
.pagination-container {
  display: flex;
  column-gap: 10px;
}

.paginate-buttons {
  height: 40px;
  width: 40px;
  border-radius: 20px;
  cursor: pointer;
  background-color: rgb(242, 242, 242);
  border: 1px solid rgb(217, 217, 217);
  color: black;
}

.paginate-buttons:hover {
  background-color: #d8d8d8;
}

.active-page {
  background-color: #3498db;
  border: 1px solid #3498db;
  color: white;
}

.active-page:hover {
  background-color: #2988c8;
}

.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  gap: 10px;
}

.paginate-buttons {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #222;
  border: 1px solid #555;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.paginate-buttons:hover {
  background-color: #444;
}

.active-page {
  background-color: cornsilk;
  border-color: #3498db;
  color: black;
}

.active-page:hover {
  background-color: #2988c8;
}

.postTitle:hover {
  color: cornsilk;
}
</style>
