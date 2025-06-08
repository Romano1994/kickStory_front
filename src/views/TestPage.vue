<script>
import CommonModal from '../components/CommonModal.vue'
import CommonInput from '../components/CommonInput.vue'

export default {
  name: 'TestPage',
  components: {
    CommonModal,
    CommonInput
  },
  data() {
    return {
      // 모달 표시 상태
      showConfirmModal: false,
      showAlertModal: false,
      showDeleteModal: false,
      showWarningModal: false,
      showRegistrationModal: false,
      
      // 모달 제목
      confirmTitle: '확인',
      alertTitle: '알림',
      deleteTitle: '삭제',
      warningTitle: '경고',
      registrationTitle: '등록',
      
      // 모달 내용
      confirmContent: '정말 진행하시겠습니까?',
      alertContent: '처리가 완료되었습니다.',
      deleteContent: '정말 삭제하시겠습니까?',
      warningContent: '이 작업은 되돌릴 수 없습니다.',
      registrationContent: '입력하신 내용을 등록하시겠습니까?',
      
      // 입력 관련
      inputValue: '',
      inputLabel: '테스트 입력',
      inputPlaceholder: '입력해주세요',
    }
  },
  methods: {
    // 모달 열기
    openConfirmModal() {
      this.showConfirmModal = true
    },
    openAlertModal() {
      this.showAlertModal = true
    },
    openDeleteModal() {
      this.showDeleteModal = true
    },
    openWarningModal() {
      this.showWarningModal = true
    },
    openRegistrationModal() {
      this.showRegistrationModal = true
    },
    
    // 모달 닫기
    closeConfirmModal() {
      this.showConfirmModal = false
    },
    closeAlertModal() {
      this.showAlertModal = false
    },
    closeDeleteModal() {
      this.showDeleteModal = false
    },
    closeWarningModal() {
      this.showWarningModal = false
    },
    closeRegistrationModal() {
      this.showRegistrationModal = false
    },
    
    // 확인 처리
    handleConfirm() {
      console.log('Confirm modal confirmed')
      this.closeConfirmModal()
    },
    handleAlert() {
      console.log('Alert modal confirmed')
      this.closeAlertModal()
    },
    handleDelete() {
      console.log('Delete modal confirmed')
      this.closeDeleteModal()
    },
    handleWarning() {
      console.log('Warning modal confirmed')
      this.closeWarningModal()
    },
    handleRegistration() {
      console.log('Registration modal confirmed')
      this.closeRegistrationModal()
    },
    
    handleInput(value) {
      this.inputValue = value
      console.log('Input value:', value)
    }
  }
}
</script>

<template>
  <div class="test-page">
    <h1>컴포넌트 테스트 페이지</h1>
    
    <div class="test-table">
      <div class="table-header">
        <div class="col-title">제목</div>
        <div class="col-function">기능</div>
        <div class="col-description">설명</div>
      </div>

      <!-- Confirm Modal Row -->
      <div class="table-row">
        <div class="col-title">
          <h3>확인 모달</h3>
          <button @click="openConfirmModal" class="modal-button confirm">테스트</button>
        </div>
        <div class="col-function">
          <code>type="confirm"</code>
        </div>
        <div class="col-description">
          <p>사용자에게 작업을 확인받는 기본 모달입니다.</p>
          <div class="props-section">
            <h4>Props</h4>
            <ul>
              <li><code>show</code>: 모달 표시 여부 (Boolean)</li>
              <li><code>title</code>: 모달 제목 (String)</li>
              <li><code>content</code>: 모달 내용 (String)</li>
              <li><code>type</code>: 모달 타입 (String, default: "confirm")</li>
            </ul>
          </div>
          <div class="slots-section">
            <h4>Slots</h4>
            <ul>
              <li><code>default</code>: 모달 내용 (content prop 대신 사용 가능)</li>
              <li><code>footer</code>: 하단 버튼 영역 커스터마이징</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Alert Modal Row -->
      <div class="table-row">
        <div class="col-title">
          <h3>알림 모달</h3>
          <button @click="openAlertModal" class="modal-button alert">테스트</button>
        </div>
        <div class="col-function">
          <code>type="alert"</code>
        </div>
        <div class="col-description">
          <p>사용자에게 알림을 전달하는 모달입니다.</p>
          <div class="props-section">
            <h4>Props</h4>
            <ul>
              <li><code>show</code>: 모달 표시 여부 (Boolean)</li>
              <li><code>title</code>: 모달 제목 (String)</li>
              <li><code>content</code>: 모달 내용 (String)</li>
              <li><code>type</code>: "alert" (확인 버튼만 표시)</li>
            </ul>
          </div>
          <div class="slots-section">
            <h4>Slots</h4>
            <ul>
              <li><code>default</code>: 모달 내용 (content prop 대신 사용 가능)</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Delete Modal Row -->
      <div class="table-row">
        <div class="col-title">
          <h3>삭제 모달</h3>
          <button @click="openDeleteModal" class="modal-button delete">테스트</button>
        </div>
        <div class="col-function">
          <code>type="delete"</code>
        </div>
        <div class="col-description">
          <p>삭제 작업을 확인받는 모달입니다.</p>
          <div class="props-section">
            <h4>Props</h4>
            <ul>
              <li><code>show</code>: 모달 표시 여부 (Boolean)</li>
              <li><code>title</code>: 모달 제목 (String)</li>
              <li><code>content</code>: 모달 내용 (String)</li>
              <li><code>type</code>: "delete" (삭제 버튼 강조)</li>
            </ul>
          </div>
          <div class="slots-section">
            <h4>Slots</h4>
            <ul>
              <li><code>default</code>: 모달 내용 (content prop 대신 사용 가능)</li>
              <li><code>footer</code>: 하단 버튼 영역 커스터마이징</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Warning Modal Row -->
      <div class="table-row">
        <div class="col-title">
          <h3>경고 모달</h3>
          <button @click="openWarningModal" class="modal-button warning">테스트</button>
        </div>
        <div class="col-function">
          <code>type="warning"</code>
        </div>
        <div class="col-description">
          <p>위험한 작업을 경고하는 모달입니다.</p>
          <div class="props-section">
            <h4>Props</h4>
            <ul>
              <li><code>show</code>: 모달 표시 여부 (Boolean)</li>
              <li><code>title</code>: 모달 제목 (String)</li>
              <li><code>content</code>: 모달 내용 (String)</li>
              <li><code>type</code>: "warning" (경고 버튼 강조)</li>
            </ul>
          </div>
          <div class="slots-section">
            <h4>Slots</h4>
            <ul>
              <li><code>default</code>: 모달 내용 (content prop 대신 사용 가능)</li>
              <li><code>footer</code>: 하단 버튼 영역 커스터마이징</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Registration Modal Row -->
      <div class="table-row">
        <div class="col-title">
          <h3>등록 모달</h3>
          <button @click="openRegistrationModal" class="modal-button registration">테스트</button>
        </div>
        <div class="col-function">
          <code>type="registration"</code>
        </div>
        <div class="col-description">
          <p>데이터 등록을 위한 모달입니다.</p>
          <div class="props-section">
            <h4>Props</h4>
            <ul>
              <li><code>show</code>: 모달 표시 여부 (Boolean)</li>
              <li><code>title</code>: 모달 제목 (String)</li>
              <li><code>content</code>: 모달 내용 (String)</li>
              <li><code>type</code>: "registration" (등록 버튼 강조)</li>
            </ul>
          </div>
          <div class="slots-section">
            <h4>Slots</h4>
            <ul>
              <li><code>default</code>: 모달 내용 (content prop 대신 사용 가능)</li>
              <li><code>footer</code>: 하단 버튼 영역 커스터마이징</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- CommonInput Row -->
      <div class="table-row">
        <div class="col-title">
          <h3>공통 입력 필드</h3>
          <div class="input-preview">
            <CommonInput
              :label="inputLabel"
              :value="inputValue"
              :placeholder="inputPlaceholder"
              @input="handleInput"
            />
          </div>
        </div>
        <div class="col-function">
          <code>CommonInput</code>
        </div>
        <div class="col-description">
          <p>재사용 가능한 입력 필드 컴포넌트입니다.</p>
          <div class="props-section">
            <h4>Props</h4>
            <ul>
              <li><code>label</code>: 입력 필드 라벨 (String)</li>
              <li><code>value</code>: 입력값 (String)</li>
              <li><code>placeholder</code>: 플레이스홀더 텍스트 (String)</li>
              <li><code>type</code>: 입력 필드 타입 (String, default: "text")</li>
              <li><code>disabled</code>: 비활성화 여부 (Boolean, default: false)</li>
              <li><code>required</code>: 필수 입력 여부 (Boolean, default: false)</li>
              <li><code>error</code>: 에러 메시지 (String)</li>
            </ul>
          </div>
          <div class="slots-section">
            <h4>Slots</h4>
            <ul>
              <li><code>prefix</code>: 입력 필드 앞에 추가할 내용</li>
              <li><code>suffix</code>: 입력 필드 뒤에 추가할 내용</li>
            </ul>
          </div>
          <div class="events-section">
            <h4>Events</h4>
            <ul>
              <li><code>@input</code>: 입력값 변경 시 발생 (value: String)</li>
              <li><code>@focus</code>: 포커스 시 발생</li>
              <li><code>@blur</code>: 포커스 해제 시 발생</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <CommonModal
      :show="showConfirmModal"
      :title="confirmTitle"
      :content="confirmContent"
      type="confirm"
      @close="closeConfirmModal"
      @confirm="handleConfirm"
    />

    <CommonModal
      :show="showAlertModal"
      :title="alertTitle"
      :content="alertContent"
      type="alert"
      @close="closeAlertModal"
      @confirm="handleAlert"
    />

    <CommonModal
      :show="showDeleteModal"
      :title="deleteTitle"
      :content="deleteContent"
      type="delete"
      @close="closeDeleteModal"
      @confirm="handleDelete"
    />

    <CommonModal
      :show="showWarningModal"
      :title="warningTitle"
      :content="warningContent"
      type="warning"
      @close="closeWarningModal"
      @confirm="handleWarning"
    />

    <CommonModal
      :show="showRegistrationModal"
      :title="registrationTitle"
      :content="registrationContent"
      type="registration"
      @close="closeRegistrationModal"
      @confirm="handleRegistration"
    >
      <CommonInput
        :label="inputLabel"
        :value="inputValue"
        :placeholder="inputPlaceholder"
        @input="handleInput"
      />
    </CommonModal>
  </div>
</template>

<style scoped>
.test-page {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  color: var(--color1);
  font-family: var(--main-font);
  margin-bottom: 2rem;
  text-align: center;
}

.test-table {
  background-color: var(--color2);
  border-radius: 8px;
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 1fr 1fr 2fr;
  padding: 1rem;
  background-color: var(--color3);
  font-weight: bold;
  color: var(--color1);
  font-family: var(--main-font);
}

.table-row {
  display: grid;
  grid-template-columns: 1fr 1fr 2fr;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.table-row:last-child {
  border-bottom: none;
}

.col-title {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-start;
}

.col-title h3 {
  color: var(--color1);
  font-family: var(--main-font);
  margin: 0;
  font-size: 1.1rem;
}

.col-function {
  display: flex;
  align-items: center;
}

.col-function code {
  background-color: rgba(255, 255, 255, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  color: var(--color1);
  font-family: monospace;
}

.col-description {
  color: var(--color1);
  font-family: var(--main-font);
}

.col-description p {
  margin: 0 0 0.5rem 0;
}

.col-description ul {
  margin: 0;
  padding-left: 1.5rem;
}

.col-description li {
  margin-bottom: 0.25rem;
}

.modal-button {
  padding: 8px 16px;
  color: white;
  border: none;
  border-radius: 4px;
  font-family: var(--sub-font);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 80px;
}

.modal-button.confirm {
  background-color: var(--color6);
}

.modal-button.confirm:hover {
  background-color: #2a7a7f;
}

.modal-button.alert {
  background-color: #2196F3;
}

.modal-button.alert:hover {
  background-color: #1976D2;
}

.modal-button.delete {
  background-color: #f44336;
}

.modal-button.delete:hover {
  background-color: #d32f2f;
}

.modal-button.warning {
  background-color: #ff9800;
}

.modal-button.warning:hover {
  background-color: #f57c00;
}

.modal-button.registration {
  background-color: #4CAF50;
}

.modal-button.registration:hover {
  background-color: #388E3C;
}

@media screen and (max-width: 768px) {
  .table-header,
  .table-row {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .col-title {
    align-items: center;
    text-align: center;
  }

  .col-function {
    justify-content: center;
  }

  .col-description {
    text-align: center;
  }

  .col-description ul {
    list-style-position: inside;
    padding-left: 0;
  }
}

.props-section,
.slots-section {
  margin-top: 1rem;
}

.props-section h4,
.slots-section h4 {
  color: var(--color1);
  font-family: var(--main-font);
  font-size: 0.9rem;
  margin: 0 0 0.5rem 0;
}

.props-section ul,
.slots-section ul {
  margin: 0;
  padding-left: 1.5rem;
}

.props-section li,
.slots-section li {
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
}

.props-section code,
.slots-section code {
  background-color: rgba(255, 255, 255, 0.1);
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  color: var(--color1);
  font-family: monospace;
  font-size: 0.85rem;
}

@media screen and (max-width: 768px) {
  .props-section,
  .slots-section {
    text-align: left;
  }
}

.input-preview {
  width: 100%;
  max-width: 300px;
  margin-top: 1rem;
}

.events-section {
  margin-top: 1rem;
}

.events-section h4 {
  color: var(--color1);
  font-family: var(--main-font);
  font-size: 0.9rem;
  margin: 0 0 0.5rem 0;
}

.events-section ul {
  margin: 0;
  padding-left: 1.5rem;
}

.events-section li {
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
}

.events-section code {
  background-color: rgba(255, 255, 255, 0.1);
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  color: var(--color1);
  font-family: monospace;
  font-size: 0.85rem;
}

@media screen and (max-width: 768px) {
  .input-preview {
    max-width: 100%;
  }
  
  .events-section {
    text-align: left;
  }
}
</style> 