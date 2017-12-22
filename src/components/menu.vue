<template>
	<section id="sideBar" class="nav-list" :class="{'show':showMenu}">
		<user-info></user-info>
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
			<router-link class="icon-ask iconfont item" :to="{'name':'list',query:{tab:'jab'}}">
			问答
			</router-link>
			<router-link class="icon-job iconfont item" :to="{'name':'list',query:{tab:'job'}}">
				招聘
			</router-link>
			<router-link class="icon-message iconfont item line" :to="{'name':'message'}">
				消息
			</router-link>
			<router-link class="icon-about iconfont item" :to="{'name':'about'}">
			关于</router-link>
		</section>
	</section>
</template>
<script>
	import userInfo from './userInfo.vue'
	export default{
		replace: true,
		props:['showMenu'],
		components:{
			userInfo
		}
	}
</script>
<style lang="scss">
	// 侧边栏
	.nav-list{
		position: fixed;
		top: 0;
		bottom: 0;
		left: -200px;
		width: 200px;
		background-color: #fff;
		color: #313131;
		transition: all .3s ease;
		z-index: 3;
		&.show{
			transform: translateX(200px);
		}
	}
	// 侧边栏列表
	.list-ul{
		margin: 0 24px;
		border-top: 1px solid #d4d4d4;
		overflow: hidden;
		padding-top: 10%;
		.item{
			display: block;
			font-size: 14px;
			padding: 10% 0;
			line-height: 14px;
			color: #313131;
			font-weight: 800;
			&:last-child{
				margin-bottom: 50px;
			}
			&:before{
				color: #2c3e50;
			}
		}
		.line{
			border-top: 1px solid #d4d4d4;
		}
	}
</style>