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
    commCdDtl:String,
    kcksHstryMdfctnVer:Number,
  },
  emits: ['update:mdfctnCntnt', 'closeEditor'],
  components: {
    QuillEditor,
  },
  mounted() {
    // this.mdfctnCntnt = this.orgMdfctnCntnt;
  },
  data() {
    return {
      // mdfctnCntnt:null,
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
    saveContent() {
      if (this.dmp === null) this.dmp = new diff_match_patch();

      let diff = this.orgMdfctnCntnt === null ? this.dmp.diff_main('', this.mdfctnCntnt.replaceAll('<br>','')) : this.dmp.diff_main(this.orgMdfctnCntnt, this.mdfctnCntnt.replaceAll('<br>',''));
      this.dmp.diff_cleanupSemantic(diff);
      console.log("this.mdctnCntnt",this.mdfctnCntnt);
      console.log("this.orgMdfctnCntnt",this.orgMdfctnCntnt);
      console.log("this.mdctnCntnt",this.mdfctnCntnt.replaceAll('<br>',''));
      console.log(diff)

      let idx = 0;
      let operations=[];
      for (let arr of diff) {

        let type = arr[0];
        let str = arr[1];
        let length = arr[1].length;
        let obj = {};

        if (type === 0) {
          idx += length;
        } else {
          if (type === 1) {
            obj.type = 'add';
            obj.position = idx;
            idx += length;
          } else if (type === -1) {
            obj.type = 'delete';
            obj.position = idx;
            // obj.oldStr = '';
            obj.length = str.length;
          }

          obj.str = str;
          operations.push(obj);
        }
      }//for

      this.postApi('/kcksHstryMdfctn',{mbrNo:1,commCdDtl:this.commCdDtl,mdfctnCntnt:JSON.stringify(operations),kcksHstryMdfctnVer:this.kcksHstryMdfctnVer,},this.insertSuccess,this.fail);
      this.$emit('closeEditor');

    },
    insertSuccess() {
      console.log("insertSuccess");
    },
    fail(err) {
      console.log(err);
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

