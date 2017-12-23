<template>
	<div style="height: 100%">
		<nv-header page-type="消息" :add-switch="true":need-add="true">
		</nv-header>
		<div class="page">
			<ul class="tabs">
				<li class="item br" :class="{'selected': selectItem === 2}" @click="changeItem(2)">已读消息</li>
				<li class="item" :class="{'selected': selectItem ===1}" @click="changeItem(1)">
					未读消息
					<i class="iconfont read" v-show="no_read_len > 0" @click="markall">&#xe60c;</i>
				</li>
			</ul>
			<div class="message markdown-body" v-for="(item, idx) in currentData">
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
				selectItem: 2,
				message: {},
				noData: false,
				currentData: [],
				no_read_len: 0
			}
		},
		computed:{
			...mapGetters({
				userInfo: 'getUserInfo'
			})
		},
		mounted(){
			this.axios.get('https://cnodejs.org/api/v1/messages',{
				params:{
					accesstoken:this.userInfo.token
				}
			}).then((res) => {
				this.message = res.data.data;
				this.no_read_len = res.data.data.hasnot_read_messages.length;
				if(this.no_read_len > 0){
					this.currentData = res.data.data.hasnot_read_messages;
				}else{
					this.currentData = res.data.data.has_read_messages;
					this.selectItem = 2;
				}
				this.noData = this.currentData.length === 0;
			}).catch((res) => {
				this.noData = true;
			})
		},
		methods:{
			// 切换tab
			changeItem(idx){
				this.selectItem = idx;
				this.currentData = idx === 1 ? this.message.hasnot_read_messages : this.message.has_read_messages;
				this.noData = this.currentData.length === 0;
			},
			// 标记所有为已读
			markall(){
				this.axios.post('https://cnodejs.org/api/v1/message/mark_all',{
					accesstoken: this.userInfo.token
				}).then((res) => {
					window.location.reload();
				}).catch((err) => {
					console.log(err);
				})
			},
			getTime(time){
				return utils.getTime(time);
			}
		},
		components:{
			nvHeader
		}
	}
</script>