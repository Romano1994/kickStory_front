<script>
import {QuillEditor} from "@vueup/vue-quill";
import '@vueup/vue-quill/dist/vue-quill.snow.css';

export default {
  name: "KcksHstryEditor",
  props: {
    hstryContent: String,
    currCard: String,
  },
  emits: ['update:hstryContent', 'closeEditor'],
  components: {
    QuillEditor,
  },
  mounted() {
    console.log(this.content);
  },
  data() {
    return {
      contents: "안녕\n나는 ddd",
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

            [{'color': ['white', 'red', 'green', 'yellow', 'blue', 'grey', 'black']}, {'background': []}],          // dropdown with defaults from theme
            [{'font': []}],
            [{'align': []}],

            ['clean']                                         // remove formatting button
          ]
        },//modules
      },//options
    }
  },
  methods: {
    updateContent(html) {
      console.log(html);
      this.$emit("update:hstryContent", html);
    },
    saveContent() {
      // this.postApi("/");
      this.$emit('closeEditor');
    },
  }
}
</script>

<template>
  <div class="editor-wrapper">
    <button type="button" class="close  ms-auto" aria-label="Close" @click="$emit('closeEditor')">
      <span aria-hidden="true">&times;</span>
    </button>
    <h1>JORDAN 1</h1>
    <br><br>
    <h2 class="slide-title">About</h2>
    <hr>
    <QuillEditor ref="quill" :content="content" content-type="html" :options="options" @update:content="updateContent">
    </QuillEditor>
    <hr>
    <div>
      <button class="btn btn-outline-secondary m-1" @click="$emit('closeEditor')">CANCEL</button>
      <button type="button" class="btn btn-light m-1" @click="saveContent">SAVE</button>
    </div>
  </div>
</template>

