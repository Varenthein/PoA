import Vue from 'vue'
import Router from 'vue-router'

/* HOME */
import Home from '@/components/pages/Home/Home'

/* OPINIONS */
import Opinions from '@/components/pages/Opinions/Opinions'

/* PORDUCTS */
import Products from '@/components/pages/Products/Products'
import ProductsAdd from '@/components/pages/Products/ProductsAdd'
import ProductsEdit from '@/components/pages/Products/ProductsEdit'

/* CATEGORIES */
import Categories from '@/components/pages/Categories/Categories'
import CategoriesAdd from '@/components/pages/Categories/CategoriesAdd'
import CategoriesEdit from '@/components/pages/Categories/CategoriesEdit'

/* ORDERS */
import Orders from '@/components/pages/Orders/Orders'
import OrdersShow from '@/components/pages/Orders/OrdersShow'

/* USERS */
import Users from '@/components/pages/Users/Users'
import UsersAdd from '@/components/pages/Users/UsersAdd'
import UsersEdit from '@/components/pages/Users/UsersEdit'

/* USER GROUPS */
import UserGroups from '@/components/pages/UserGroups/UserGroups'
import UserGroupsAdd from '@/components/pages/UserGroups/UserGroupsAdd'

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
      path: '/users/add',
      name: 'UsersAdd',
      component: UsersAdd
    },
    {
      path: '/users/edit/:id',
      name: 'UsersEdit',
      component: UsersEdit
    },
    {
      path: '/users/groups',
      name: 'UserGroups',
      component: UserGroups
    },
    {
      path: '/users/groups/add',
      name: 'UserGroupsAdd',
      component: UserGroupsAdd
    },
    {
      path: '/opinions',
      name: 'Opinions',
      component: Opinions
    }
  ]
})
