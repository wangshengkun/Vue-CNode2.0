<template>
	<div id="wxAlert" class="wx_loading" v-show="show">
		<div class="week-alert" id="week-alert" v-text="content"></div>
	</div>
</template>

<script>
	export default{
		replace: true,
		props:['content', 'show']
	}
</script>
<style lang="scss">
	.wx_loading{
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		background-color: rgba(0,0,0,0);
		text-align: center;
		z-index: 10;
		.wx_alert_inner{
			display: inline-block;
			margin: 0 auto;
			text-align: center;
			background-color: rgba(49,49,49,0.8);
			color: #fff;
			border-radius: 3px;
			font-size: 14px;
			padding: 18px 25px;
			line-height: 27px;
			vertical-align: middle;
			margin-top: 50%;
		}
	}
</style>