<template>
	<div id="loading">
		<img src="../assets/images/loading.gif">
	</div>
</template>

<style lang="scss">
	#loading{
		// 利用定位来铺满整个屏幕
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background-color: #fff;
		// 再利用flex布局来居中子元素
		display:flex;
		align-items: center;
		justify-content: center;
	}
</style>