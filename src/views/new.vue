<template>
	<div>
		<nv-header page-type="主题" :add-switch="true"></nv-header>
		<div class="add-container">
			<div class="line">
				选择分类
				<select class="add-tab" v-model="topic.tab">
					<option value="dev">测试</option>
					<option value="ask">问答</option>
					<option value="job">招聘</option>
					<option value="share">分享</option>
				</select>
				<a class="add-btn" @click="addTopic">发布</a>
			</div>
			<div class="line">
				<input type="text" class="add-title" v-model="topic.title"
					:class="{'err': err === 'title'}" max="25"
					placeholder="标题，字数5字以上">
			</div>
			<textarea v-model="topic.content" rows="20" class="add-content"
			:class="{'err': err === 'content'}" placeholder="回复支持Markdown语法，请注意标记代码">
			</textarea>
		</div>
	</div>
</template>

<script>
	import nvHeader from '../components/header.vue';
	import { mapGetters} from 'vuex';

	export default{
		data(){
			return{
				topic:{
					tab:'dev',
					title: '',
					content: ''
				},
				err:''
			}
		},
		computed:{
			...mapGetters({
				userInfo: 'getUserInfo'
			})
		},
		methods:{
			addTopic(){
				let title = this.topic.title.trim();
				let contents = this.topic.content.trim();
				if(!title || title.length < 5){
					this.err = 'title';
					return false;
				}
				if(!contents){
					this.err = 'content';
					return false;
				}
				let data = {
					...this.topic,
					accesstoken: this.$store.state.userInfo.accessToken
				};
				this.axios.post('https://cnodejs.org/api/v1/topics',{
					...data
				}).then((res) => {
					if(res.data.success){
						this.$router.push({
							name:'list'
						})
					}
				}).catch((err) => {
					this.$alert(error);
				})
			}
		},
		components:{
			nvHeader
		}
	}
</script>

<style lang="scss">
	.add-container{
		margin-top: 50px;
		background-color: #fff;
		.line{
			padding: 10px 15px;
			border-bottom: solid 1px #d4d4d4;
			.add-btn{
				color: #fff;
				background-color: #80bd01;
				padding: 5px 15px;
				border-radius: 5px;
			}
			.add-tab{
				display: inline-block;
				width: calc(100% - 140px);
				min-width: 50%;
				font-size: 16px;
				background: transparent;
				:after{
					content: 'xe60e';
				}
			}
			.add-title{
				font-size: 12px;
				border: none;
				width: 100%;
				background: transparent;
				height: 25px;
			}
			.err{
				border: solid 1px red;
			}
		}
		.add-content{
			margin: 15px 2%;
			width: 96%;
			border-color: #d4d4d4;
			color: #000;
		}
		.err{
			border: solid 1px red;
		}
	}
</style>