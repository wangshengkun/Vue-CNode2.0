// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import axios from 'axios'
import Alert from './libs/alert.js'
import routes from './router/index.js'
import store from './store/index'

Vue.use(VueRouter);
Vue.use(Vuex);
Vue.use(Alert);
Vue.config.productionTip = false;
Vue.prototype.axios = axios;

const router = new VueRouter({
    mode: 'history',
    routes
});

// 登录中间验证，页面需要登录而没有登录的情况直接跳转登录
router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (store.state.userInfo.userId) {
            next();
        } else {
            next({
                path: '/login',
                query: { redirect: to.fullPath }
            });
        }
    } else {
        next();
    }
});

/* eslint-disable no-new */
new Vue({
  router,
  store
}).$mount('#app');
