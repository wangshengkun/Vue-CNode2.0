<template>
	<div class="iconfont icon-top" v-show="show" @click="goTop">&#xe611;</div>
</template>
<script>
	export default{
		replace: true,
		data(){
			return {
				show: false
			}
		},
		mounted(){
			document.addEventListener('scroll', () =>{
				if(document.documentElement.scrollTop > 100){
					this.show = true;
				}else{
					this.show = false;
				}
			}, false)
		},
		beforeDestory(){
			document.removeEventListener('scroll');
		},
		methods:{
			goTop(){
				document.documentElement.scrollTop = 0;
				this.show = false;
			}
		}
	}
</script>

<style lang="scss">
	.icon-top{
		position: fixed;
		right: 10px;
		bottom: 80px;
		color: #42b983;
		font-size: 50px;
		z-index: 10000;
	}
</style>