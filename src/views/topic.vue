<template>
	<!-- 我想说什么你应该知道了吧：） -->
	<div>
		<nv-header page-type="主题" :need-add="true" :add-switch="true"></nv-header>
		<div id="page" v-if="topic.title">
			<h2 class="topic-title" v-text="topic.title"></h2>
			<!-- 作者信息 -->
			<section class="author-info">
				<router-link :to="{name:'user',params:{loginname:topic.author.loginname}}">
					<img class="avatar" :src="topic.author.avatar_url">
				</router-link>
				<div class="left">
					<span>{{topic.author.loginname}}</span>
					<time>
						发布于:{{ getTime(topic.create_at) }}
					</time>
				</div>
				<div class="right">
					<span class="tag" 
							:class="getTabInfo(topic.tab, topic.good, topic.top, true)"
							v-text="getTabInfo(topic.tab, topic.good, topic.top, false)">
					</span>
					<span>{{topic.visit_count}}次浏览</span>
				</div>
			</section>
			<!-- 文章内容 -->
			<section class="markdown-body topic-content" v-html="topic.content"></section>
			<h3 class="topic-reply">
				<strong>{{topic.reply_count}}</strong>回复
			</h3>
			<!-- 回复列表 -->
			<section class="reply-list">
				<ul>
					<li v-for="item in topic.replies">
						<section class="user">
							<router-link :to="{name:'user',params:{loginname:item.author.loginname}}">
								<img class="head" :src="item.author.avatar_url">
							</router-link>
							<div class="info">
								<span class="cl">
									<span class="name" v-text="item.author.loginname"></span>
									<span class="name mt10">
										<span></span>
										发布于:{{ getTime(item.create_at) }}
									</span>
								</span>
								<span class="cr">
									<!-- 点赞 -->
									<span class="iconfont icon"
									:class="{'uped':isUps(item.ups)}"
									@click="upReply(item)">&#xe608;</span>
									{{item.ups.length}}
									<!-- 回复 -->
									<span class="iconfont icon" @click="addReply(item.id)">&#xe609;</span>
								</span>
							</div>
						</section>
						<div class="reply-content" v-html="item.content"></div>
						<!-- 针对用户的回复框 -->
						<!-- 弄懂为什么使用.sync修饰符 -->
						<!-- 以及父子组件的事件触发机制 -->
						<!-- 结合reply组件阅读 -->
						<nv-reply :topic.sync="topic"
								:topic-id="topicId"
								:reply-id="item.id" 
								:reply-to="item.author.loginname"
								:showReply.sync="curReplyId"
                                @close="hideItemReply"
								v-if="userInfo.userId && curReplyId === item.id">
						</nv-reply>	
					</li>
				</ul>
			</section>
			<nv-top></nv-top>
			<!-- 针对话题的回复框 -->
			<nv-reply v-if="userInfo.userId" :topic="topic" :topic-id="topicId"></nv-reply>
		</div>
		<!-- loading组件 -->
		<nvLoad v-else></nvLoad>
		<div class="no-data" v-show="show">
			该话题不存在！
		</div>
	</div>
</template>

<script>
	import * as utils from '../libs/utils.js';
	import nvHeader from '../components/header.vue';
	import nvReply from '../components/reply.vue';
	import nvTop from '../components/backToTop.vue';
	import nvLoad from '../components/loading.vue';
	import {mapGetters} from 'vuex';

	export default{
		data(){
			return{
				topic: {}, // 存储话题数据
				topicId: '', // 当前话题ID
				curReplyId: '', // 控制针对用户的回复框
				show: false // 控制no-data显示
			}
		},
		computed:{
			...mapGetters({
				userInfo: 'getUserInfo'
			})
		},
		mounted(){
			// 获取url传的tab参数
			this.topicId = this.$route.params.id;
			// 加载主题
			this.axios.get('https://cnodejs.org/api/v1/topic/'+this.topicId)
			.then((res) =>{
				this.topic = res.data.data;
				this.judgeData();
			}).catch((err) =>{
				this.$alert(err);
			})
		},
		methods:{
			getTabInfo(tab, good, top, isClass){
				return utils.getTabInfo(tab, good, top, isClass);
			},
			getTime(time){
				return utils.getTime(time);
			},
			// 以话题标题为决策点，判断是否有内容
			judgeData(){
				if(!this.topic.title){
					// 若不存在话题标题，则显示no-data框
					this.show = true;
				}
			},
			// 控制点赞样式
			isUps(ups){
				// 若用户ID存在于ups数组中，则点赞过
				return ups.indexOf(this.userInfo.userId) !== -1 ? true : false;
			},
			// 点赞某回复
			upReply(item){
				// 如未登录，则跳转到登录界面
				if(!this.$store.state.userInfo.userId){
					this.$router.push({
						name: 'login',
						params:{
							redirect: encodeURIComponent(this.$route.path)
						}
					})
				}else{
					// 注意axios的参数写法
					this.axios.post('https://cnodejs.org/api/v1/reply/'+item.id+'/ups',{
						accesstoken: this.$store.state.userInfo.accessToken
					}).then((res) => {
						// 若接口表示动作为取消
						if(res.data.action === 'down'){
							// 则从点赞数组中删除该登录用户id
							let index = item.ups.indexOf(this.userInfo.userId);
							item.ups.splice(index, 1);
						}else{
							// 反之则添加
							item.ups.push(this.userInfo.userId);
						}
					}).catch((err) =>{
                        this.$alert(err);
					})
				}
			},
			// 添加回复
			addReply(id){
				// 与showReply属性绑定
				this.curReplyId = id;
				// 若在未登录情况下点击回复按钮则返回到‘登录’路由
				if(!this.userInfo.userId){
					this.$router.push({
						name:'login',
						params:{
							redirect: encodeURIComponent(this.$route.path)
						}
					})
				}
			},
			// 隐藏回复框
			// 若子组件触发了close自定义事件，则调用
			hideItemReply() {
				// 将curReplyId重置为空
				// 使之与item.id不全等
				// v-if指令不满足，从而隐藏
                this.curReplyId = '';
            }
		},
		components:{
			nvHeader,
			nvReply,
			nvTop,
			nvLoad
		}
	}
</script>