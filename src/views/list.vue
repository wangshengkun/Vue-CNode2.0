<template>
	<!-- 现在你知道这个div干嘛用了吧：） -->
	<div>
		<!-- 注意父子组件是如何传值的，结合header组件思考 -->
		<nv-header :page-type="getTitleStr(searchKey.tab)"
		:add-switch="true" :need-add="true" ref="head"></nv-header>
		<!-- 真正意义上的list组件 -->
		<section id="page">
			<ul class="topics-list">
				<!-- 思考key属性的作用，详见Vue官方文档 -->
				<li v-for="topic in topics" :key="topic.id">
					<router-link :to="{name:'topic', params:{id:topic.id}}">
						<h3 v-text="topic.title" 
						:class="getTabInfo(topic.tab, topic.good, topic.top, true)"
						:title="getTabInfo(topic.tab, topic.good, topic.top, false)">
						</h3>
						<div class="content">
							<img class="avatar" :src="topic.author.avatar_url">
							<div class="info">
								<p>
									<span class="name">
										{{topic.author.loginname}}
									</span>
									<span class="status" v-if="topic.reply_count > 0">
										<b>{{topic.reply_count}}</b>
										/{{topic.visit_count}}
									</span>
								</p>
								<p>
									<time>{{ getTime(topic.create_at) }}</time>
									<time>{{ getTime(topic.last_reply_at) }}</time>
								</p>
							</div>
						</div>
					</router-link>
				</li>
			</ul>
		</section>
		<!-- 返回头部组件 -->
        <nv-top></nv-top>
        <nv-load v-if="loading"></nv-load>
	</div>
</template>

<script>
	import * as utils from '../libs/utils.js';
	import nvHeader from '../components/header.vue';
	import nvTop from '../components/backToTop.vue';
	import nvLoad from '../components/loading.vue';

	export default {
		data(){
			return {
				topics: [], // 存储接受到的主题数据
				index: {},
				searchKey:{ // 发起get请求的必要参数
					page: 1,
					limit: 10,
					tab: 'all',
					mdrender: true
				},
				loading: true
			};
		},
		// 理解Vue组件生命周期，详见官方文档
		mounted(){
			if(this.$route.query && this.$route.query.tab){
				this.searchKey.tab = this.$route.query.tab;
            }
            // 如果从详情页面利用menu选项返回
            // 并且之前存有对应的查询条件和参数
            // 则直接渲染之前的数据
			if(window.window.sessionStorage.searchKey && window.window.sessionStorage.tab === this.searchKey.tab){
				this.topics = JSON.parse(window.window.sessionStorage.topics);
				this.searchKey = JSON.parse(window.window.sessionStorage.searchKey);
				// 在DOM更新之前将scrollTop定位
				this.$nextTick(() => {
					return document.documentElement.scrollTop = window.window.sessionStorage.scrollTop;
				})
			}else{
				this.getTopics();
			}
			document.addEventListener('scroll', utils.throttle(this.getScrollData, 500, 1000), false);
		},
		// 导航守卫（组件内的），导航离开该组件的对应路由时调用
		beforeRouteLeave(to, from, next){
			// 若用户点击列表中某项，此刻记录下跳转之前的信息
			// 用户再次返回该页面时便可继续加载之前的位置
			if(to.name === 'topic'){
				// 记录当前滚动条位置
				window.window.sessionStorage.scrollTop = document.documentElement.scrollTop;
				// 记录当前页面主题
				window.window.sessionStorage.topics = JSON.stringify(this.topics);
				// 记录当前查询参数
				window.window.sessionStorage.searchKey = JSON.stringify(this.searchKey);
				// 记录当前tab
				window.window.sessionStorage.tab = from.query.tab || 'all';
			}
			document.removeEventListener('scroll', utils.throttle(this.getScrollData, 500, 2000), false);
			// 每个导航守卫都需调用next方法！
			next();
		},
		beforRouteEnter(to, from, next){
			if(from.name !== 'topic'){
				// 路由导航后移除之前记录的数据
				if(window.window.sessionStorage.tab){
					window.window.sessionStorage.removeItem('topics');
					window.window.sessionStorgae.removeItem('searchKey');
					window.window.sessionStorage.removeItem('tab');
				}
			}
			next();
		},
		methods:{
			// 获取title文字
            getTitleStr(tab) {
            	return utils.getTabInfo(tab);
            },
            // 获取不同tab的样式或者标题
            getTabInfo(tab, good, top, isClass) {
                return utils.getTabInfo(tab, good, top, isClass);
            },
			// 获取主题数据
			getTopics(){
				// 注意axios API的参数写法，与JQuery区分开来
				// 我上次弄混淆了，找了整整三天的Bug :(
				this.axios.get('https://cnodejs.org/api/v1/topics',{
					params:this.searchKey
				}).then((res) => {
					res.data.data.forEach(this.mergeTopics);
					this.loading = false;
				}).catch((err) => {
					console.log(err);
				})
			},
			// 合并接受的主题数据,着重理解这段代码，建议画图理解
			mergeTopics(topic) {
                if (typeof this.index[topic.id] === 'number') {
                    let topicsIndex = this.index[topic.id];
                    this.topics[topicsIndex] = topic;
                } else {
                    this.index[topic.id] = this.topics.length;
                    this.topics.push(topic);
                }
            },
			// 滚动加载数据
			getScrollData(){
				if(document.body.scrollTop + window.innerHeight>= document.body.clientHeight){
                    this.searchKey.page += 1;
                    this.getTopics();
                }
			},
			// 规格化时间
			getTime(time){
				return utils.getTime(time);
			}
		},
		watch:{
			// 切换页面,监听menu组件的选项点击
			'$route'(to, from){
				this.loading = true;
				if(to.query && to.query.tab){
					this.searchKey.tab = to.query.tab;
					this.topics = [];
					this.index = {};
				}
				this.searchKey.page = 1;
				this.getTopics();
				// 隐藏导航栏
				this.$refs.head.show = false;
			}
		},
		components:{
			nvHeader,
			nvTop,
			nvLoad
		}
	}
</script>