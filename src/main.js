// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
/* eslint-disable */
import Vue from 'vue'
import router from './config/router.config'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import MultiLanguage from 'vue-multilanguage'
import { polish } from './lang/pl.lang.js'

import App from './App'

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(MultiLanguage, {
    default: 'pl',
    pl: polish
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
