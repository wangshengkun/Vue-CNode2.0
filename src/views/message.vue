<template>
	<div style="height: 100%">
		<nv-header page-type="消息" :add-switch="true":need-add="true">
		</nv-header>
		<div class="page">
			<ul class="tabs">
				<li class="item br" :class="{'selected': selectTab === 'read'}" @click="changeTab('read')">已读消息</li>
				<li class="item" :class="{'selected': selectTab === 'unread'}" @click="changeTab('unread')">
					未读消息
					<i class="iconfont read" v-show="no_read_len > 0" @click="markall">&#xe60c;</i>
				</li>
			</ul>
			<div class="message markdown-body" v-for="(item, tab) in currentData">
				<section class="user">
					<img class="head" :src="item.author.avatar_url">
					<div class="info">
						<span class="cl">
							<span class="name">{{item.author.loginname}}</span>
							<span class="name" v-if="item.type==='at'">
								在回复中@了你
							</span>
							<span class="name" v-if="item.type==='reply'">
								回复了你的话题
							</span>
						</span>
						<span class="cr">
							<span class="name" v-text="getTime(item.reply.create_at)"></span>
						</span>
					</div>
				</section>
				<div class="reply_content" v-html="item.reply.content"></div>
				<router-link :to="{name:'topic', params:{id:item.topic.id}}">
					<div class="topic-title">
						话题:{{item.topic.title}}
					</div>
				</router-link>
			</div>
			<div class="no-data" v-show="noData">
				<i class="iconfont icon-empty">&#xe60a;</i>
				暂无数据!
			</div>
		</div>
	</div>
</template>
<script>
	import * as utils from '../libs/utils.js';
	import nvHeader from '../components/header.vue';
	import { mapGetters } from 'vuex';

	export default{
		data(){
			return{
				selectTab: 'unread', // 出于用户体验，优先展示未读消息
				messages: {}, // 存储消息数据
				currentData: [], // 用户所选定的数据
				no_read_len: 0,
				noData: false
			}
		},
		computed:{
			...mapGetters({
				userInfo: 'getUserInfo'
			})
		},
		mounted(){
			// 注意区分axios中get、post中参数的区别
			this.axios.get('https://cnodejs.org/api/v1/messages',{
				params:{
					accesstoken: this.$store.state.userInfo.accessToken
				}
			}).then((res) => {
				this.messages = res.data.data;
				this.no_read_len = this.messages.hasnot_read_messages.length;
				// 优先显示未读消息
				if(this.no_read_len > 0){
					this.currentData = this.messages.hasnot_read_messages;
				}else{
					this.currentData = this.messages.has_read_messages;
					this.selectTab = 'read';
				}
				// this.noData = true;
			}).catch((res) => {
				this.$alert(res);
			})
		},
		methods:{
			getTime(time){
				return utils.getTime(time);
			},
			// 切换tab
			changeTab(tab){
				this.selectTab = tab;
				this.currentData = tab === 'unread' ? this.messages.hasnot_read_messages : this.messages.has_read_messages;
				this.noData = this.currentData.length === 0;
			},
			// 标记所有为已读
			markall(){
				this.axios.post('https://cnodejs.org/api/v1/message/mark_all',{
					accesstoken: this.$store.state.userInfo.accessToken
				}).then((res) => {
					if(res.data.success === true){
						window.location.reload();
					}else{
						this.$alert("对不起，操作失败");
					}
				}).catch((err) => {
					this.$alert(err);
				})
			}
		},
		components:{
			nvHeader
		}
	}
</script>