<script>
import {QuillEditor} from "@vueup/vue-quill";
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import {diff_match_patch} from "diff-match-patch";

export default {
  name: "KcksHstryEditor",
  props: {
    currCard: String,
    orgMdfctnCntnt: String,
    mdfctnCntnt: String,
    kcksHstryMdfctnNo: Number,
    itemCd: String,
    content: String,
    kcksHstryMdfctnYn: String,
    kcksHstryMdfctnVer: String
  },
  emits: ['update:mdfctnCntnt', 'closeEditor'],
  components: {
    QuillEditor,
  },
  mounted() {
  },
  watch: {
  },
  data() {
    return {
      options: {
        theme: 'snow',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
            ['blockquote', 'code-block'],
            ['link', 'image', 'video', 'formula'],
            [{'header': 1}, {'header': 2}],               // custom button values
            [{'list': 'ordered'}, {'list': 'bullet'}, {'list': 'check'}],
            [{'script': 'sub'}, {'script': 'super'}],
            [{'indent': '-1'}, {'indent': '+1'}],
            [{'direction': 'rtl'}],
            [{'size': ['small', false, 'large', 'huge']}],
            [{'header': [1, 2, 3, 4, 5, 6, false]}],
            [{'color': ['white', 'red', 'green', 'yellow', 'blue', 'grey', 'black']}, {'background': []}],
            [{'font': []}],
            [{'align': []}],
            ['clean']
          ]
        },//modules
      },//options
      dmp: null,
    }
  },
  methods: {
    updateContent(html) {
      this.$emit("update:mdfctnCntnt", html);
    },
    getDiff(orgMdfctnCntnt, mdfctnCntnt) {
      if (this.dmp === null) this.dmp = new diff_match_patch();

      let diff = orgMdfctnCntnt === null ? this.dmp.diff_main('', mdfctnCntnt.replaceAll('<br>', '')) : this.dmp.diff_main(orgMdfctnCntnt, mdfctnCntnt.replaceAll('<br>', ''));

      this.dmp.diff_cleanupSemantic(diff);
      return diff;
    },
    saveContent() {
      this.putApi('/kcks/hstry', {
        kcksHstryMdfctnNo: this.kcksHstryMdfctnNo,
        itemCd: this.itemCd,
        mdfctnCntnt: this.mdfctnCntnt,
        kcksHstryMdfctnYn: this.kcksHstryMdfctnYn,
        kcksHstryMdfctnVer: this.kcksHstryMdfctnVer
      }, this.succSave, this.fail);
    },
    insertSuccess() {
      // console.log("insertSuccess");

      this.$emit('closeEditor');

    },
    insertFail(err) {
      if (confirm(err.message)) {
        this.$emit("update:changeStatus", true);
        // let diff = this.getDiff(this.orgMdfctnCntnt, this.mergeCntnt);
        // this.temp = this.dmp.diff_prettyHtml(diff)
        // console.log("temp",this.temp);
      }
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
    <QuillEditor ref="quill" :content="mdfctnCntnt" content-type="html" :options="options"
                 @update:content="updateContent">
    </QuillEditor>
    <hr>
    <div>
      <button class="btn btn-outline-secondary m-1" @click="$emit('closeEditor')">CANCEL</button>
      <button type="button" class="btn btn-light m-1" @click="saveContent">SAVE</button>
    </div>
  </div>
</template>

