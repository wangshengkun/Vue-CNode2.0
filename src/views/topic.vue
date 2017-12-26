<template>
	<!-- 我想说什么你应该知道了吧：） -->
	<div>
		<nv-header page-type="主题" :need-add="true" :add-switch="true"></nv-header>
		<div id="page" v-if="topic.title">
			<h2 class="topic-title" v-text="topic.title"></h2>
			<section class="author-info">
				<img class="avatar" :src="topic.author.avatar_url">
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
			<section class="markdown-body topic-content" v-html="topic.content"></section>
			<h3 class="topic-reply">
				<strong>{{topic.reply_count}}</strong>回复
			</h3>
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
									<span class="iconfont icon"
									:class="{'uped':isUps(item.ups)}"
									@click="upReply(item)">&#xe608;</span>
									{{item.ups.length}}
									<span class="iconfont icon" @click="addReply(item.id)">&#xe609;</span>
								</span>
							</div>
						</section>
						<div class="reply-content" v-html="item.content"></div>
						<nv-reply :topic.sync="topic" 
								:topic-id="topicId"
								:reply-id="item.id" 
								:reply-to="item.author.loginname"
								v-show="replyShow"
								@click="hideItemReply"
								v-if="userInfo.userId && curReplyId === item.id">
						</nv-reply>	
					</li>
				</ul>
			</section>
			<nv-top></nv-top>
			<nv-reply v-if="userInfo.userId" :topic="topic" :topic-id="topicId"></nv-reply>
		</div>
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
				topic: {},
				topicId: '',
				curReplyId: '',
				show: false,
				replyShow: false
			}
		},
		computed:{
			...mapGetters({
				userInfo: 'getUserInfo'
			}),
			key(){
				return this.showKey % 2 !== 0 ? true : false
			}
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
				console.log(err);
			})
		},
		methods:{
			getTabInfo(tab, good, top, isClass){
				return utils.getTabInfo(tab, good, top, isClass);
			},
			getTime(time){
				return utils.getTime(time);
			},
			judgeData(){
				if(!this.topic.title){
					this.show = true;
				}
			},
			// 是否点过赞，ups为数组
			isUps(ups){
				return ups.indexOf(this.userInfo.userId) !== -1 ? true : false;
			},
			// 添加回复
			addReply(id){
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
				this.replyShow = !this.replyShow;
			},
			hideItemReply(){
				this.curReplyId = '';
			},
			// 点赞该回复
			upReply(item){
				// 如未登录，则跳转
				if(!this.userInfo.userId){
					this.$router.push({
						name: 'login',
						params:{
							redirect: encodeURIComponent(this.$route.path)
						}
					})
				}else{
					this.axios.post('https://cnodejs.org/api/v1/reply/'+item.id+'/ups',{
						accesstoken: this.$store.state.userInfo.accessToken
					}).then((res) => {
						if(res.data.action === 'down'){
							let index = item.ups.indexOf(this.userInfo.userId);
							item.ups.splice(index, 1);
						}else{
							item.ups.push(this.userInfo.userId);
						}
					}).catch((err) =>{
                        this.$alert(err);
					})
				}
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