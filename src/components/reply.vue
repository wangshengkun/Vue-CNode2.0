<template>
	<section class="reply">
		<textarea id="content" rows="8" class="text"
		:class="{'err':hasErr}" v-model="content"
		placeholder="支持Markdown语法，请注意标记代码">
		</textarea>
		<a class="button" @click="addReply">确定</a>
	</section>
</template>

<script>
	import * as utils from '../libs/utils.js';
	import { mapGetters } from 'vuex';

	/* 
	*  如果你是需要搭建一个以我源码为基础的WebApp
	*  在这里你需要事先加载一个npm包，指令如下
	*  npm install markdown
	*/

	const markdown = require('markdown').markdown;

	export default{
		replace: true,
		/*
		* topic: 回复的话题
		* topicId: 回复的话题ID
		* replyId: 回复的用户ID
		* replyTo: 回复的用户名
		*/
		props:['topic', 'topicId', 'replyId', 'replyTo'],
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
			// 如果是针对某用户进行的回复
			if(this.replyTo){
				// 则出现@
				this.content = `@${this.replyTo} `;
			}
		},
		methods:{
			addReply(){
				if(this.content === ''){
					this.hasErr = true;
					return false;
				}else{
					let time = Date.now();
					let linkUsers = utils.linkUsers(this.content);
					let htmlText = markdown.toHTML(linkUsers);

					let data = {
						accesstoken: this.$store.state.userInfo.accessToken,
						content: htmlText
					};
					if(this.replyId){
						data.reply_id = this.replyId;
					}
					this.axios.post('https://cnodejs.org/api/v1/topic/'+this.topicId+'/replies',{
						// 对象解构
						...data
					}).then((res) => {
						// 如果回复成功
          				if (res.data.success) {
          					// 在当前话题的回复数组中添加内容，
          					// 从而变相实现路由刷新
          					// 由子组件改变父组件状态
          					// 懂为什么使用.sync了吧 ：）
							this.topic.replies.push({
								id: res.data.reply_id,
								author:{
									loginname: this.$store.state.userInfo.loginname,
									avatar_url: this.$store.state.userInfo.avatar_url
								},
								content: htmlText,
								ups: [],
								create_at: time
							});
							this.content = '';
          				} else {
            				this.$alert('发布失败')
          				}
					}).catch((err) => {
						this.$alert(err);
					})
				}
			}
		}
	}
</script>