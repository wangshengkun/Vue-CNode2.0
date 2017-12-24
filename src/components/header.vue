<template>
	<!-- 组件模板需有且仅有一个根元素，所以用div包裹 -->
	<div>
		<header class="fix-header">
			<div class="nv-toolbar">
				<!-- 主题切换选项(控制menu组件)，默认不显示 -->
				<div class="switch-bar" @click="openMenu" v-if="addSwitch"></div>
				<span v-text="pageType"></span>
				<!-- 新建主题选项，默认不显示 -->
				<router-link to="/add" v-if="needAdd">
					<i class="iconfont add-icon">&#xe60f;</i>
				</router-link>
			</div>
		</header>
		<!-- menu组件，默认隐藏 -->		
		<nv-menu :show-menu="show"></nv-menu>
		<!-- 遮罩层 -->
		<div class="page-cover" v-if="show" @click="showMenu"></div>		
	</div>
</template>

<script>
	import Menu from './menu';
	export default {
		replace:true,
		// 接收来自父组件的数据
		props:{
			// 主题类别
			pageType: String,
			// 主题切换
			addSwitch: {
				type: Boolean,
				default: false
			},
			// 新建主题
			needAdd:{
				type: Boolean,
				default: false
			}
		},
		data(){
			return {
				show: false
			};
		},
		methods:{
			openMenu(){
				this.show = !this.show;
			},
			showMenu(){
				this.show = !this.show;
			}
		},
		 components:{
		 	'nvMenu': Menu
		 }
	}
</script>