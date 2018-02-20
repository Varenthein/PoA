/* IMPORT DEPEDENCIES */
import Vue from 'vue'
import router from './config/router.config'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import MultiLanguage from 'vue-multilanguage'

/* IMPORT LANGUAGES */
import { polish } from './lang/pl.lang.js'
import { english } from './lang/en.lang.js'

/* IMPORT MAIN APP */
import App from './App'

Vue.config.productionTip = false

/* INCLUDE EXTERNAL PACKAGE */
Vue.use(ElementUI)
Vue.use(MultiLanguage, {
    default: 'pl',
    pl: polish,
    en: english
})

/* CREATE APP */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
