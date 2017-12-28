<template>
	<!-- 该组件内容均被包含在section中，符合一个根元素要求 -->
	<section id="sideBar" class="nav-list" :class="{'show':showMenu}">
		<!-- 用户信息组件 -->
		<user-info></user-info>
		<!-- 真正的menu列表 -->
		<section class="list-ul">
			<router-link class="icon-all iconfont item" :to="{'name': 'list',query:{tab:'all'}}">
				全部
			</router-link>
			<router-link class="icon-good iconfont item" :to="{'name':'list',query:{tab:'good'}}">
				精华
			</router-link>
			<router-link class="icon-share iconfont item" :to="{'name':'list',query:{tab:'share'}}">
				分享
			</router-link>
			<router-link class="icon-ask iconfont item" :to="{'name':'list',query:{tab:'ask'}}">
				问答
			</router-link>
			<router-link class="icon-job iconfont item" :to="{'name':'list',query:{tab:'job'}}">
				招聘
			</router-link>
			<router-link class="icon-message iconfont item line" :to="{'name':'message'}">
				消息
			</router-link>
			<router-link class="icon-about iconfont item" :to="{'name':'about'}">
				关于
			</router-link>
			<div class="icon-config iconfont item" @click="loginOut" v-if="show">
				退出
			</div>
		</section>
	</section>
</template>

<script>
	import userInfo from './userInfo.vue';

	export default{
		replace: true,
		props:['showMenu'],
		data(){
			return{
				show: false // 退出按钮默认不出现
			}
		},
		mounted(){
			// 在挂载时验证是否登录
			this.checkLogon();
		},
		methods:{
			checkLogon(){
				// 若用户已登陆，则出现退出按钮
				if(window.window.sessionStorage.getItem('user') !== null){
					this.show = true;
				}else{
					this.show = false;
				}
			},
			loginOut(){
				// 清除sessionStorage中的用户数据
				window.window.sessionStorage.removeItem("user");
				// 重置Vuex中的数据
				this.$store.state.userInfo = {};
				// 跳转至新的页面
				this.$router.push({
					name:"list"			
				});
				// 隐藏退出按钮
				this.show = false;
			}
		},
		components:{
			userInfo
		}
	}
</script>

<style lang="scss">
	// 侧边栏
	.nav-list{
		width: 200px;
		position: fixed;
		top: 0;
		bottom: 0;
		// 依据width值，将其移出可视范围
		left: -200px;
		background-color: #fff;
		color: #313131;
		transition: all .3s ease;
		z-index: 3;
		// 效果上等价于left:0
		&.show{
			transform: translateX(200px);
		}
	}
	// 侧边栏列表
	.list-ul{
		margin: 0 24px;
		border-top: 1px solid #d4d4d4;
		padding-top: 10%;
		.item{
			display: block;
			font-size: 14px;
			padding: 10% 0;
			line-height: 14px;
			color: #313131;
			font-weight: 800;
		}
		.line{
			border-top: 1px solid #d4d4d4;
		}
	}
</style>