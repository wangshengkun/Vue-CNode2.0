<template>
	<div class="user-info">
		<!-- 未登录 -->
		<ul class="login-no" v-if="!userInfo.loginname">
			<li class="login" @click="goEnter">
				<a>登录</a>
			</li>
		</ul>
		<!-- 已登录 -->
		<div class="login-yes" v-if="userInfo.loginname" @click="goUser">
			<div class="avertar">
				<img :src="userInfo.avatar_url" v-if="userInfo.avatar_url">
			</div>
			<div class="info">
				<p v-if="userInfo.loginname" v-text="userInfo.loginname"></p>
			</div>
		</div>
	</div>
</template>
<script>
	import {mapGetters} from 'vuex';
	export default{
		replace: true,
		computed:{
			...mapGetters({
				userInfo: 'getUserInfo'
			})
		},
		methods:{
			goEnter(){
				this.$router.push({
					name: 'login',
					query:{
						redirect: encodeURIComponent(this.$route.path)
					}
				})
			},
			goUser(){
				this.$router.push({
					name: 'user',
					params:{
						loginname: this.userInfo.loginname
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.user-info{
		padding: 15px;
		font-size: 15px;
		color: #313131;
		.login-no{
			overflow: hidden;
			margin: 8px 9px;
			&>li{
				float: right;
				height: 24px;
				line-height: 24px;
				padding-left: 34px;
				position: relative;
				&:before{
					width: 24px;
					height: 24px;
					content: '';
					position: absolute;
					left: 0;
					top: 0;
				}
			}
			.login{
				float: left;
				&:before{
					background: url("../assets/images/components/login_icon.png") no-repeat left center;
					background-size: 24px 24px;
				}
			}
		}
		.login-yes{
			height: 100%;
			background: url("../assets/images/components/go_next_icon.png") no-repeat right center;
			background-size: 6px 10px;
			overflow: hidden;
			position: relative;
			.avertar{
				width: 40px;
				height: 40px;
				background: url("../assets/images/components/user.png") no-repeat center center;
				background-size: 40px 40px;
				border-radius: 20px;
				overflow: hidden;
				float: left;
				&>img{
					width: 40px;
					height: 40px;
					display: block;
				}
			}
			.info{
				margin-left: 10px;
				overflow: hidden;
				float: left;
			}
			p{
				width: 85px;
				overflow: hidden;
				white-space: nowrap;
				text-ovarflow: ellipsis;
				font-size: 12px;
				line-height: 40px;
				&.lh20{
					line-height: 20px;
				}
			}
			&:after{
				display: block;
				background: url("../assets/images/components/go_icon.png") no-repeat center right;
				background-size: 7px 7px;
			}
		}
	}
</style>