<script>
export default {
  name: "KcksHstrySlide",
  props: ["content", "aiContent"],
  methods:{

  }
}
</script>

<template>
  <div class="slide" ref="slideContainer">
    <button type="button" class="close  ms-auto" aria-label="Close" @click="$emit('closeSlide')">
      <span aria-hidden="true">&times;</span>
    </button>
    <h1>JORDAN 1</h1>
    <br><br>
    <div v-if="content!==''&&content!==null">
      <h2>About</h2>
      <hr>
      <div>
        {{ content }}
      </div>
      <br><br>

      <h2>Release</h2>
      <hr>
      <div>
        발매정보를 보여줍니다.
      </div>
      <br><br>

      <h2>Community</h2>
      <hr>
      <div>
        커뮤니티 관련 글들을 보여줍니다.
      </div>
      <br><br>

      <h2>About</h2><span>ai가 작성한 내용입니다.</span>
      <hr>
      <div>
        여기는 조던1에 대한 설명글을 작성한 부분입니다.
      </div>
    </div>
    <div v-else>

      <h2>About</h2>
      <span>ai가 작성한 내용입니다.</span>
      <hr>
      <div>
        여기는 조던1에 대한 설명글을 작성한 부분입니다.
      </div>
      <br><br>

      <h2>Release</h2>
      <hr>
      <div>
        발매정보를 보여줍니다.
      </div>
      <br><br>

      <h2>Community</h2>
      <hr>
      <div>
        커뮤니티 관련 글들을 보여줍니다.
      </div>
      <br><br>

      <h2>About</h2>
      <hr>
      <div>
        작성된 내용이 없습니다. 내용을 추가해주세요.
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>