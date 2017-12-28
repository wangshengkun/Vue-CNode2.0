<template>
	<section class="reply">
		<textarea rows="8" 
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
	*  如果你正在搭建一个以我源码为基础的WebApp
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
		* showReply: 是否展现回复框
		*/
		props:['topic', 'topicId', 'replyId', 'replyTo', 'showReply'],
		data(){
			return {
				hasErr: false,
				content: '',
				link: '  [来自Vue-CNode2](https://github.com/wangshengkun/Vue-CNode2.0)'
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
				this.content = `@${this.replyTo}  `;
			}
		},
		methods:{
			addReply(){
				if(this.content === ''){
					this.hasErr = true;
					this.$alert("内容不能为空");
					return false;
				}else{
					// 伪造回复内容，变相刷新
					let time = Date.now();
					// 将文本规范化，并在其末尾添加小尾巴
					let linkUsers = utils.linkUsers(this.content) + this.link;
					// 利用markdown来解析最终的回复内容
					let htmlText = markdown.toHTML(linkUsers);
					// 依据CNodeAPI接口返回的数据格式进行伪造回复内容，是变相刷新的最重要一步
					let replyContent = document.createElement("div");
					replyContent.setAttribute("class", "markdown-text");
					replyContent.innerHTML = htmlText;
					replyContent = replyContent.outerHTML;

					let data = {
						accesstoken: this.$store.state.userInfo.accessToken,
						// 真正发送的数据是符合CNode社区markdown语法的数据
						// 而非自身加工的数据replyContent
						content: this.content + this.link
					};
					// 若存在回复ID则添加
					if(this.replyId){
						data.reply_id = this.replyId;
					}
					this.axios.post('https://cnodejs.org/api/v1/topic/'+this.topicId+'/replies',{
						// 对象解构
						...data
					}).then((res) => {
						// 如果回复成功
          				if (res.data.success){
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
								content: replyContent,
								ups: [],
								create_at: time
							});
							this.content = '';
							// 如果存在回复框
							if (this.showReply) {
								// 由子组件触发父组件的close事件
                                this.$emit('close');
                            }
          				}else{
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