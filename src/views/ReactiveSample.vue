<template lang="">
    <div class="reactive-sample-container">
        sample container
    </div>
    <div>
        AI채팅 해보기
    </div>
    질문 : 
        <input type="text" v-model="message"/>
        <input type="button" value="보내기" @click="sendMessage"/>
    <div>응답 : {{answer}}</div>
</template>
<script>
export default {
    data(){
        return{
            message:'',
            answer:''
        }
    },
    mounted(){
        this.getApi('/test',{test:"test"}, this.success, this.fail);
        this.postApi('/posttest', {test:"test"}, this.success, this.fail);
        this.putApi('/puttest', {test:"test"}, this.success, this.fail);
        this.deleteApi('/deletetest', {test:"test"}, this.success, this.fail);
    },
    methods:{
        success(data) {
            console.log(data);
        },
        fail(err) {
            console.log(err.message);
        },
        setAnswer(res){
            console.log(res.data.genertation);
            this.answer=res.data.genertation;
        },
        async sendMessage(){
            
            // this.getApi('/ai/generate',{message:this.message}, this.setAnswer, this.fail);
            try{
                let res = await this.$axios.get('/ai/generate?message='+this.message);
                this.answer=res?.data?.generation;
            }catch(err){
                console.log("에러남 ", err);
                
            }
        }

    }
}
</script>
<style>
    .reactive-sample-container{
        background-color: var(--color3);
        height:100px;
        font-size: 1rem;
        color: var(--color1);
    }

    @media screen and (max-width:var(--max-width)) {
        .reactive-sample-container{
            background-color: var(--color3);
            height:300px;
        }
    }
</style>