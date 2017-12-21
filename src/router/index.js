const Home = resolve => {
    require.ensure(['../views/index.vue'], () => {
        resolve(require('../views/index.vue'));
    });
};

const List = resolve => {
    require.ensure(['../views/list.vue'], () => {
        resolve(require('../views/list.vue'));
    });
};

const routers = [{
    path: '/',
    name: 'home',
    component: Home
},{
    path: '/list',
    name: 'list',
    component: List
}];
export default routers;