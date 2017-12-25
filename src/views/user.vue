<template>
	<div>
		<nv-header page-type="用户信息" :add-switch="true" :need-add="true">
		</nv-header>
		<section class="userInfo">
			<img class="u-img" :src="user.avatar_url"><br>
			<span class="u-name" v-text="user.loginname"></span>
			<div class="u-bottom">
				<span class="u-time" v-text="getTime(user.create_at)"></span>
				<span class="u-score">积分：{{user.score}}</span>
			</div>
		</section>
		<section class="topics">
			<ul class="user-tabs">
				<li class="item br" :class="{'selected': tab === 'reply'}" @click="changeTab('reply')">
					最近回复
				</li>
				<li class="item" :class="{'selected': tab === 'publish'}" @click="changeTab('publish')">
					最新发布
				</li>
			</ul>
			<div class="message" v-for="item in currentData">
				<section class="user">
					<router-link class="head" :to="{name:'user',params:{loginname:item.author.loginname}}">
						<img :src="item.author.avatar_url">
					</router-link>
					<router-link class="info" :to="{name:'topic',params:{id:item.id}}">
						<div class="t-title">{{item.title}}</div>
						<span class="cl mt12">
							<span class="name">{{item.author.loginname}}</span>
						</span>
						<span class="cr mt12">
							<span class="name" v-text="getTime(item.last_reply_at)"></span>
						</span>
					</router-link>
				</section>
			</div>
			<div class="no-data" v-show="show">
				暂无数据!
			</div>
		</section>
		<nvLoad v-if="loading"></nvLoad>
	</div>
</template>

<script>
	import * as utils from '../libs/utils.js';
	import nvHeader from '../components/header.vue';
	import nvLoad from '../components/loading.vue';

	export default{
		data(){
			return{
				// user对象用于存储整个对象的数据，所以下方有 user = d.data
				user:{},
				// currentData数组用于存储用户回复/发布的内容
				currentData:[],
				tab: 'reply',
				show: false,
				loading: true
			}
		},
		mounted(){
			this.getUser();
			// 将滚轮重定向至顶部
			document.documentElement.scrollTop = 0;
		},
		// 切换tab时DOM会进行更新，在此时重新调用judgeData函数
		updated(){
			this.judgeData();
		},
		methods:{
			//切换tab
			changeTab(tab){
				this.tab = tab;
				this.currentData = tab === 'reply' ? this.user.recent_replies : this.user.recent_topics;
			},
			getTime(time){
				return utils.getTime(time);
			},
			getUser(){
				let loginname = this.$route.params.loginname;
				if(!loginname){
					this.$alert("缺少用户名参数");
					this.$router.push({
						path:'/'
					});
					return false;
				}
				this.axios.get('https://cnodejs.org/api/v1/user/'+loginname)
				.then((res) =>{
                    let data = res.data.data;
                    	this.loading = false;
                       	this.user = data;
                       if (data.recent_replies.length > 0) {
                            this.currentData = data.recent_replies;
                            this.judgeData();
                        } else {
                            this.currentData = data.recent_topics;
                            this.tab = 'publish';
                            this.judgeData();
                        }
					}).catch((err) =>{
						console.log(err);
					})
				},
			// 判断当前tab选项是否有数据	
			judgeData(){
				if(this.currentData.length === 0){
					return this.show = true;
				}
			}
		},
		watch:{
			'$route' (to, from){
				this.getUser();
			}
		},
		components:{
			nvHeader,
			nvLoad
		}
	}	
</script>