<template>
	<div>
		<nv-header :page-type="getTitleStr(searchKey.tab)"
		:add-switch="true" :need-add="true" ref="head"></nv-header>
		<section id="page">
			<ul class="posts-list">
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
									<time>{{topic.create_at | getTime()}}</time>
									<time>{{topic.last_reply_at | getTime()}}</time>
								</p>
							</div>
						</div>
					</router-link>
				</li>
			</ul>
		</section>
        <nv-top></nv-top>
	</div>
</template>

<script>
	import * as utils from '../libs/utils.js';
	import nvHeader from '../components/header.vue';
	import nvTop from '../components/backToTop.vue';

	console.log(nvTop);
	export default {
		filters:{
			getTime(time){
				return utils.getTime(time);
			}
		},
		data(){
			return {
				scroll: true,
				topics: [],
				index: {},
				searchKey:{
					page: 1,
					limit: 10,
					tab: 'all',
					mdrender: true
				},
				searchDataStr: ''
			};
		},
		mounted(){
			if(this.$route.query.tab){
				this.searchKey.tab = this.$route.query.tab;
			}
            // 如果从详情返回并且之前存有对应的查询条件和参数
            // 则直接渲染之前的数据
			if(window.window.sessionStorage.searchKey && window.window.sessionStorage.tab === this.searchKey.tab){
				this.topics = JSON.parse(window.window.sessionStorage.topics);
				this.searchKey = JSON.parse(window.window.sessionStorage.searchKey);
				this.$nextTick(() => {
					return window.scrollTop = window.window.sessionStorage.scrollTop;
				})
			}else{
				this.getTopics();
			}
			document.addEventListener('scroll', utils.throttle(this.getScrollData, 500, 1000), false);
		},
		beforeRouteLeave(to, from, next){
			// 若用户点击列表中某项，路由会导航到具体的界面，此刻记录下信息
			// 用户再次返回该页面时便可继续加载之前的位置
			if(to.name === 'topic'){
				// 记录当前滚动条位置
				window.winow.sessionStorage.scrollTop = window.scrollTop;
				// 记录当前页面主题
				window.window.sessionStorage.topics = JSON.stringify(this.topics);
				// 记录当前查询参数
				window.window.sessionStorage.searchKey = JSON.stringify(this.searchKey);
				// 记录当前tab
				window.window.sessionStorage.tab = from.query.tab || 'all';
			}
			document.removeEventListener('scroll');
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
				this.axios.get('https://cnodejs.org/api/v1/topics',{
					params:this.searchKey
				}).then((res) => {
					this.scroll = true;
					res.data.data.forEach(this.mergeTopics);
				}).catch((err) => {
					console.log(err);
				})
			},
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
                    if(this.scroll === true){  
                        this.scroll = false;
                        this.searchKey.page += 1;
                       	this.getTopics();
                    }  
                }
			},
			watch:{
				// 切换页面
				'$route'(to, from){
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
			}
		},
		components:{
			nvHeader,
			nvTop
		}
	}
</script>