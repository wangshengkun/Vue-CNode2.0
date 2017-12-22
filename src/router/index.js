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
},{
    path: '/topic/:id',
    name: 'topic',
    component(resolve){
        require.ensure(['../views/topic.vue'], () =>{
            resolve(require('../views/topic.vue'));
        });
    }
}];
export default routers;