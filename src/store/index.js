import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

const store = new Vuex.store({
	state:{
		userInfo:{}
	},
	getters:{
		getUserInfo(state){
			return state.userInfo;
		}
	},
	mutations:{
		setUserInfo(state, payload){
			state.userInfo = payload;
		}
	},
	actions:{
		setUserInfo({ commit }, payload){
			commit('setUserInfo', payload);
		}
	}
});
export default store;