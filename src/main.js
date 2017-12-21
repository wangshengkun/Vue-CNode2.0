// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router';
import axios from 'axios'
import routes from './router/index.js'

Vue.use(VueRouter);
Vue.config.productionTip = false
Vue.prototype.axios = axios;

const router = new VueRouter({
    mode: 'history',
    routes
});

/* eslint-disable no-new */
new Vue({
  router
}).$mount('#app');
