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
    mergeCntnt: String,
    commCdDtl: String,
    kcksHstryMdfctnVer: Number,
    kcksHstryMdfctnNo: Number,
    isMerge: Boolean,
    kcksHstryMdfctnYn: String,
    diffCntnt: String,
  },
  emits: ['update:mdfctnCntnt', 'closeEditor'],
  components: {
    QuillEditor,
  },
  mounted() {
  },
  watch: {
    orgMdfctnCntnt(newVal) {
      if (this.isMerge) {
        this.updateContent(newVal);
      }
    }
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

      let diff = this.getDiff(this.orgMdfctnCntnt, this.mdfctnCntnt);
      let idx = 0;
      let operations = [];
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

      this.postApi('/kcksHstryMdfctn', {
        mbrNo: 1,
        commCdDtl: this.commCdDtl,
        mdfctnCntnt: JSON.stringify(operations),
        kcksHstryMdfctnVer: this.kcksHstryMdfctnVer,
        kcksHstryMdfctnNo: this.kcksHstryMdfctnNo === "" ? null : this.kcksHstryMdfctnNo,
        kcksHstryMdfctnYn: this.kcksHstryMdfctnYn
      }, this.insertSuccess, this.insertFail);

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
  <div class="merge-editor-wrapper">
    <button type="button" class="close  ms-auto" aria-label="Close" @click="$emit('closeEditor')">
      <span aria-hidden="true">&times;</span>
    </button>
    <h1>JORDAN 1</h1>
    <br><br>

    <div>
      <h2 class="slide-title">충돌 부분</h2>
      <hr>
      <div v-html="diffCntnt" style="background-color: darkgrey;height:25rem; overflow-y:auto"></div>
    </div>
    <br><br>

    <!--    <div v-if="isMerge">-->
    <div style="display: grid; grid-template-columns: repeat(2, 1fr); width: 100%; column-gap: 20px; ">
      <div style="  word-break: break-word;">
        <h2 class="slide-title">작성중인 내용</h2>
        <hr>
        <div>
            <div  style="background-color:darkgrey;height:25rem; overflow-y:auto;" v-html="mergeCntnt"></div>
        </div>
      </div>
      <div style="  word-break: break-word;">
        <h2 class="slide-title">현재 내용</h2>
        <hr>
        <div style="background-color:darkgrey;height:25rem; overflow-y:auto;" v-html="orgMdfctnCntnt"></div>
      </div>
    </div>
    <br><br>
    <h2 class="slide-title">충돌 내용 편집</h2>
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

