<template>
	<section class="reply">
		<textarea id="content" rows="8" class="text"
		:class="{'err':hasErr}" v-model="content"
		placeholder="回复支持Markdown语法，请注意标记代码">
		</textarea>
		<a class="button" @click="addReply">确定</a>
	</section>
</template>

<script>
	import * as utils from '../libs/utils.js';
	const markdown = require('markdown').markdown;
	import { mapGetters } from 'vuex';

	export default{
		replace: true,
		props:['topic', 'replyId', 'topicId', 'replyTo', 'show'],
		data(){
			return {
				hasErr: false,
				content: ''
			}
		},
		computed:{
			...mapGetters({
				userInfo:'getUserInfo'
			})
		},
		mounted(){
			if(this.replyTo){
				this.content = `@${this.replyTo}`;
			}
		},
		methods:{
			addReply(){
				if(!this.content){
					this.hasErr = true;
				}else{
					let time = Date.now();
					// let linkUsers = utils.linkUsers(this.content);
					// let htmlText = markdown.toHTML(linkUsers);
					let postData = {
						accesstoken: this.$store.state.userInfo.accessToken,
						content: this.content
					};
					if(this.replyId){
						postData.reply_id = this.replyId;
					}
					this.axios.post('https://cnodejs.org/api/v1/topic/'+this.topicId+'/replies',{
						...postData
					}).then((res) => {
						if(res.data.success){
							window.location.reload();
						}
					}).catch((err) => {
						this.$alert(err);
					})
				}
			}
		}
	}
</script>