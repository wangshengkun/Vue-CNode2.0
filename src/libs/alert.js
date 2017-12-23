// 全局插件，用于向用户提供信息
import Vue from 'vue';

export default {
	// Vue.js的插件应当有一个公开方法 install
	install() {
		// 注意timer变量所在位置，理解闭包的概念
		let timer = null;
		Vue.prototype.$alert = (msg) => {
			// 若之前的提示节点还存在，则移除
			let previous = document.querySelector('#alertWeek');
			if(previous){
				previous.parentNode.removeChild(previous);				
			}

			// 创建提示节点
			let alert = document.createElement('div');
			alert.setAttribute('class', 'week-alert');
			alert.setAttribute('id', 'alertWeek');

			document.body.appendChild(alert);
			alert.innerHTML = msg;
			alert.classList.add('alert-show');

			clearTimeout(timer);
			timer = setTimeout(() => {
				document.body.removeChild(alert);
			},2000);
		}
	}
}