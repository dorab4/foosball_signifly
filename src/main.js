import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import VueMoment from 'vue-moment';
Vue.use(VueMoment);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app')
