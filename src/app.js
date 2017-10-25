import Vue from 'vue'
import App from './App.vue'
import { createStore } from './store'
import { createRouter } from './router'
import { sync } from 'vuex-router-sync'
import VueLazyload  from 'vue-lazyload'
import titleMixin from './util/title'
import * as filters from './util/filters'
import Device from './util/device.js'

import Element from 'element-ui'
import Vheader from 'components/Vheader.vue'
import Vfooter from 'components/Vfooter.vue'
import Feedback from 'components/Feedback.vue'

Vue.use(VueLazyload, {
  preLoad: 1.33333,
  attempt: 1,
  filter: {
    progressive (listener, options) {
      const f = options.supportWebp ? '/format/webp' : ''
      const w = listener.el.getAttribute("w") || 0
      const h = listener.el.getAttribute("h") || 0
      listener.el.setAttribute('srcset', `${listener.src}?imageView2/1/w/${w * 2}/h/${h * 2}${f}/ignore-error/1/ 2x`)
      listener.src += `?imageView2/2/w/${w}/h/${h}${f}/ignore-error/1`
    }
  }
})

Vue.use(Element)
Vue.use(Device)
Vue.component(Vheader.name, Vheader)
Vue.component(Vfooter.name, Vfooter)
Vue.component(Feedback.name, Feedback)

Vue.mixin(titleMixin)

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

export function createApp (ssrContext) {
  // 创建 router 和 store 实例
  const store = createStore()
  const router = createRouter()
  // 同步路由状态(route state)到 store
  sync(store, router)
  // 创建应用程序实例，将 router 和 store 注入
  const app = new Vue({
    router,
    store,
    render: h => h(App)
  })
  // 暴露 app, router 和 store。
  return { app, router, store }
}