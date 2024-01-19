import Vue from 'vue'
import VueRouter from 'vue-router'
const Home = () =>
  import(/* webpackChunkName: "vsf-home" */ '../views/Home.vue');
const Admin = () =>
  import(/* webpackChunkName: "vsf-admin" */ '../views/Admin.vue');
const Login = () =>
  import(/* webpackChunkName: "vsf-login" */ '../views/Login.vue');
const MyAccount = () =>
  import(/* webpackChunkName: "vsf-my-account" */ '../views/MyAccount.vue');
const Subscriptions = () =>
  import(/* webpackChunkName: "vsf-subscriptions" */ '../views/Subscriptions.vue');
const Disciplines = () =>
  import(/* webpackChunkName: "vsf-disciplines" */ '../views/Disciplines.vue');
const Equipment = () =>
  import(/* webpackChunkName: "vsf-equipment" */ '../views/Equipment.vue');
const Wishlist = () =>
  import(/* webpackChunkName: "vsf-wishlist" */ '../views/Wishlist.vue');
const Cart = () =>
  import(/* webpackChunkName: "vsf-cart" */ '../views/Cart.vue');

Vue.use(VueRouter)

const routes = [
  { name: 'Login', path: '/login', component: Login },
  { 
    name: 'Home',
    path: '/',
    component: Home,
    beforeEnter: (to, from, next) => {
      if (localStorage.getItem('token')) {
        next();
      } else {
        next('/login');
      }
    }
  },
  { 
    name: 'MyAccount',
    path: '/account',
    component: MyAccount,
    beforeEnter: (to, from, next) => {
      if (localStorage.getItem('token')) {
        next();
      } else {
        next('/login');
      }
    }
  },
  { 
    name: 'Cart',
    path: '/cart',
    component: Cart,
    beforeEnter: (to, from, next) => {
      if (localStorage.getItem('token')) {
        next();
      } else {
        next('/login');
      }
    }
  },
  { 
    name: 'Wishlist',
    path: '/wishlist',
    component: Wishlist,
    beforeEnter: (to, from, next) => {
      if (localStorage.getItem('token')) {
        next();
      } else {
        next('/login');
      }
    }
  },
  { 
    name: 'Equipment',
    path: '/equipment',
    component: Equipment,
    beforeEnter: (to, from, next) => {
      if (localStorage.getItem('token')) {
        next();
      } else {
        next('/login');
      }
    }
  },
  { 
    name: 'Disciplines',
    path: '/disciplines',
    component: Disciplines,
    beforeEnter: (to, from, next) => {
      if (localStorage.getItem('token')) {
        next();
      } else {
        next('/login');
      }
    }
  },
  { 
    name: 'Subscriptions',
    path: '/subscriptions',
    component: Subscriptions,
    beforeEnter: (to, from, next) => {
      if (localStorage.getItem('token')) {
        next();
      } else {
        next('/login');
      }
    }
  },
  {
    name: 'Admin',
    path: '/admin',
    component: Admin,
    beforeEnter: (to, from, next) => {
      if (localStorage.getItem('token')) {
        next();
      } else {
        next('/login');
      }
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
