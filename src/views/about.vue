<template>
	<div style="height: 100%">
		<nv-header page-type="关于" :add-switch="true" :need-add="true"></nv-header>
		<dl class="about-info">
			<dt>关于项目</dt>
			<dd>基于<a href="https://github.com/shinygang">唐岗</a>大大的<a href="https://github.com/shinygang/Vue-cnodejs">项目</a>进行编写，参考了其源码，并在其基础上进行删减更改，使得其更适合Vue初学者，是<a href="https://github.com/wangshengkun/Vue-CNode">Vue-CNode项目</a>的进阶版。</dd>
			<dt>源码地址</dt>
			<dd>
				<a href="https://github.com/wangshengkun/Vue-CNode2.0">
					https://github.com/wangshengkun/Vue-CNode2.0
				</a>
			</dd>
			<dt>意见反馈</dt>
			<dd>
				<a href="https://github.com/wangshengkun/Vue-CNode2.0/issues">
					发表意见或提出需求
				</a>
			</dd>
		</dl>
	</div>
</template>
<script>
	import nvHeader from '../components/header.vue';

	export default{
		components:{
			nvHeader
		}
	}
</script>