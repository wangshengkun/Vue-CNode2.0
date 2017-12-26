<template>
	<div class="login-page">
		<nv-header page-type="登录" :add-switch="true"></nv-header>
		<section class="page-body">
			<div class="label">
				<input type="text" class="txt" placeholder="Access Token" 
				v-model="accessToken" maxlength="36">
			</div>
			<div class="label">
				<a class="button" @click="login">登录</a>
			</div>
		</section>
	</div>
</template>

<script>
	import nvHeader from '../components/header.vue';

	export default{
		data(){
			return {
				accessToken: ''
			}
		},
		methods:{
			login(){
				if(this.accessToken === ''){
					this.$alert('令牌格式错误，应为36位UUID字符串');
					return false;
				}
				this.axios.post('https://cnodejs.org/api/v1/accesstoken', {
          			accesstoken: this.accessToken
        		}).then((res) => {
					let user = {
						loginname: res.data.loginname,
						avatar_url: res.data.avatar_url,
						userId: res.data.id,
						accessToken: this.accessToken
					};
					// window.window.sessionStorage.user = user;
					// 建议使用方法而非属性来操作数据
					window.window.sessionStorage.setItem('user', user);
					// 利用状态管理模式（Vuex）来操作信息
					this.$store.dispatch('setUserInfo', user);
					let redirect = decodeURIComponent(this.$route.query.redirect || '');
					this.$router.push({
						path: redirect
					})
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

<style lang='scss'>
	.page-body {
        padding: 50px 15px;
        min-height: 400px;
        background-color: #fff;
        .label {
            display: inline-block;
            width: 100%;
            margin-top: 15px;
            position: relative;
            left: 0;
            top: 0;
            .txt {
                padding: 12px 0;
                border: none;
                border-bottom: 1px solid #4fc08d;
                background-color: transparent;
                width: 100%;
                font-size: 14px;
                color: #313131;
            }
            .button {
                display: inline-block;
                width: 99%;
                height: 42px;
                line-height: 42px;
                border-radius: 3px;
                color: #fff;
                font-size: 16px;
                background-color: #4fc08d;
                border: none;
                border-bottom: 2px solid #3aa373;
                text-align: center;
                vertical-align: middle;
            }
            .file {
                position: absolute;
                top: 0;
                left: 0;
                height: 42px;
                width: 48%;
                outline: medium none;
                opacity: 0;
            }
        }
    }
</style>