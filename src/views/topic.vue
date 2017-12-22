<template>
	<div>
		<nv-header page-type="主题" :show-menu="showMenu" :need-add="true" :add-switch="true"></nv-header>
		<div id="page" :class="{'show-menu':showMenu}" v-if="topic.title">
			<h2 class="topic-title" v-text="topic.title"></h2>
			<section class="author-info">
				<img class="avatar" :src="topic.author.avatar_url">
				<div class="col">
					<span>{{topic.author.loginname}}</span>
					<time>
						发布于:{{topic.create_at | getTime()}}
					</time>
				</div>
				<div class="right">
					<span class="tag" 
							:class="getTabInfo(topic.tab, topic.good, topic.top, true)"
							v-text="getTabInfo(topic.tab, topic.good, topic.top, false)">
					</span>
					<span class="name">{{topic.visit_count}}次浏览</span>
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
										发布于:{{item.create_at | getTime()}}
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
						<div class="reply_content" v-html="item.content"></div>
						<!-- 回复组件尚未使用 -->
						
					</li>
				</ul>
			</section>
			<nv-top></nv-top>
			<!-- 回复组件使用的另一个地方 -->
		</div>
		<div class="no-data" v-if="noData">
			<i class="iconfont icon-empty">&#xe60a;</i>
			该话题不存在！
		</div>
	</div>
</template>

<script>
	import * as utils from '../libs/utils.js';
	import nvHeader from '../components/header.vue';
	import nvTop from '../components/backToTop.vue';
	// 还需引入回复组件
	import {mapGetters} from 'vuex';

	export default{
		data(){
			return{
				showMenu: false, // 是否张开左侧菜单
				topic: {},
				noData: false,
				topicId: '',
				curReplyId: ''
			}
		},
		computed:{
			...mapGetters({
				userInfo: 'getUserInfo'
			})
		},
		filters:{
			getTime(time){
				return utils.getTime(time);
			}
		},
		mounted(){
			// 隐藏左侧展开菜单
			this.showMenu = false;
			// 获取url传的tab参数
			this.topicId = this.$route.params.id;
			// 加载主题
			this.axios.get('https://cnodejs.org/api/v1/topic/'+this.topicId)
			.then((res) =>{
				this.topic = res.data.data;
			}).catch((err) =>{
				this.noData = true;
			})
		},
		methods:{
			getTabInfo(tab, good = false, top, isClass){
				return utils.getTabInfo(tab, good, top, isClass);
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
					// 需修改
					this.axios.post('https://cnodejs.org/api/v1/reply/'+item.id+'/ups',{
						accesstoken: this.userInfo.token
					}).then((res) => {
						if(res.action === 'down'){
							let index = item.ups.indexOf(this.userInfo.userId);
							item.ups.splice(index, 1);
						}else{
							item.ups.push(this.userInfo.userId);
						}
					}).catch((err) =>{
                        let error = JSON.parse(err);
                        this.$alert(error.error_msg);
                        return false;
					})
				}
			}
		},
		components:{
			nvHeader,
			nvTop
		}
	}
</script>