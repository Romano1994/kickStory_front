<script>
export default {
  name: "KcksHstryEditor"
}
</script>

<template>
  <div class="editor-wrapper">
    <button type="button" class="close  ms-auto" aria-label="Close" @click="$emit('closeSlide')">
      <span aria-hidden="true">&times;</span>
    </button>
    <h1>JORDAN 1</h1>
    <br><br>
    <h2 class="slide-title">About</h2>
    <hr>
    <div>
      에디터 위치
      {{ content }}
    </div>
    <hr>
    <div>
      <button class="btn btn-outline-secondary m-1">CANCEL</button>
      <button type="button" class="btn btn-light m-1">SAVE</button>
    </div>


  </div>
</template>

