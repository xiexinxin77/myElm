import App from '../App'

const home = r => require.ensure([], () => r(require('../page/home/home')), 'home')
const city = r => require.ensure([], () => r(require('../page/city/city')), 'city')
const msite = r => require.ensure([], () => r(require('../page/msite/msite.vue')), 'msite')

export default [{
    path: '/',
    component: App, //顶层路由
    children: [
        {
            path: '',
            redirect: '/home'
        },
        {
            path: '/home',
            component: home
        },
        {
            path: '/city/:cityId',
            component: city
        }, 
        {
            path: '/msite',
            component: msite,
            meta: {keepAlive: true}
        }
    ]
}]