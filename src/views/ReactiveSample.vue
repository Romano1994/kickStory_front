<template>
  <span class="badge bg-warning">Warning</span>
  <div class="reactive-sample-container">
    sample container
  </div>
  <div>
    AI채팅 해보기
  </div>
  <div>
    질문 :
    <input type="text" v-model="message"/>
    <input type="button" value="보내기" @click="sendMessage"/>
  </div>
  <div>응답 : {{ answer }}</div>
  <div ref="content" v-html="content">

  </div>
<!--  <QuillEditor :options="options" @update:content="updateContent">-->
  <QuillEditor ref="quill" :options="options" @update:content="updateContent">

  </QuillEditor>

  <div class="reactive-sample-container" ref="diffTest">
    <div v-html="orgText">

    </div>
    <div v-html="newText">

    </div>
    <div ref="diff" v-html="diffHtml"></div>
  </div>

</template>
<script>
import {diff_match_patch} from "diff-match-patch";
import {QuillEditor} from "@vueup/vue-quill";
import '@vueup/vue-quill/dist/vue-quill.snow.css';


export default {
  components: {
    QuillEditor,
  },
  data() {
    return {
      message: '',
      answer: '',
      dmp: '',
      orgText: '   Hello world <br> I am 32 <br>  My Name is Heon',
      newText:' Hello welcome to my world<br>My Namae is Heonyy',
      options: {
        theme: 'snow',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
            ['blockquote', 'code-block'],
            ['link', 'image', 'video', 'formula'],

            [{'header': 1}, {'header': 2}],               // custom button values
            [{'list': 'ordered'}, {'list': 'bullet'}, {'list': 'check'}],
            [{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
            [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
            [{'direction': 'rtl'}],                         // text direction

            [{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
            [{'header': [1, 2, 3, 4, 5, 6, false]}],

            [{'color': ['white','red','green','yellow','blue','grey','black']}, {'background': []}],          // dropdown with defaults from theme
            [{'font': []}],
            [{'align': []}],

            ['clean']                                         // remove formatting button
          ]
        },//modules
      },//options
      content: null,
      diffHtml:null,
    }
  },
  mounted() {
    // this.getApi('/test', {test: "test"}, this.success, this.fail);
    // this.postApi('/posttest', {test: "test"}, this.success, this.fail);
    // this.putApi('/puttest', {test: "test"}, this.success, this.fail);
    // this.deleteApi('/deletetest', {test: "test"}, this.success, this.fail);
    const dmp = new diff_match_patch();

    let orgText = this.orgText;
    let newText = this.newText;
    let diff = dmp.diff_main(orgText, newText);
    dmp.diff_cleanupSemantic(diff)
    console.log(diff)
    this.diffHtml = dmp.diff_prettyHtml(diff)


  },
  methods: {
    success(data) {
      console.log(data);
    },
    fail(err) {
      console.log(err.message);
    },
    setAnswer(res) {
      console.log(res.data.genertation);
      this.answer = res.data.genertation;
    },
    async sendMessage() {

      // this.getApi('/ai/generate',{message:this.message}, this.setAnswer, this.fail);
      try {
        let res = await this.$axios.get('/ai/generate?message=' + this.message);
        this.answer = res?.data?.generation;
      } catch (err) {
        console.log("에러남 ", err);

      }
    },
    updateContent(delta) {
      console.log(delta);
      // this.$refs.content.innerHTML= delta.ops[0].insert.replace(/\n/g, '<br>');
      this.content=delta.ops[0].insert.replace(/\n/g, '<br>');
    }

  }
}
</script>
<style>

.reactive-sample-container {
  background-color: var(--color3);
  height: 500px;
  font-size: 1rem;
  color: var(--color1);
}

@media screen and (max-width: var(--max-width)) {
  .reactive-sample-container {
    background-color: var(--color3);
    height: 300px;
  }
}
</style>