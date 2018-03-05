import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/pages/Home/Home'
import Opinions from '@/components/pages/Opinions/Opinions'
import Products from '@/components/pages/Products/Products'
import ProductsAdd from '@/components/pages/Products/ProductsAdd'
import ProductsEdit from '@/components/pages/Products/ProductsEdit'
import Categories from '@/components/pages/Categories/Categories'
import CategoriesAdd from '@/components/pages/Categories/CategoriesAdd'
import CategoriesEdit from '@/components/pages/Categories/CategoriesEdit'
import Orders from '@/components/pages/Orders/Orders'
import OrdersShow from '@/components/pages/Orders/OrdersShow'
import Users from '@/components/pages/Users/Users'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Home
    },
    {
      path: '/home',
      name: 'Home',
      component: Home
    },
    {
      path: '/products',
      name: 'Products',
      component: Products
    },
    {
      path: '/products/add',
      name: 'ProductsAdd',
      component: ProductsAdd
    },
    {
      path: '/products/edit/:id',
      name: 'ProductsEdit',
      component: ProductsEdit
    },
    {
      path: '/categories',
      name: 'Categories',
      component: Categories
    },
    {
      path: '/categories/add',
      name: 'CategoriesAdd',
      component: CategoriesAdd
    },
    {
      path: '/categories/edit/:id',
      name: 'CategoriesEdit',
      component: CategoriesEdit
    },
    {
      path: '/orders',
      name: 'Orders',
      component: Orders
    },
    {
      path: '/orders/:id',
      name: 'OrdersShow',
      component: OrdersShow
    },
    {
      path: '/users',
      name: 'Users',
      component: Users
    },
    {
      path: '/opinions',
      name: 'Opinions',
      component: Opinions
    }
  ]
})
