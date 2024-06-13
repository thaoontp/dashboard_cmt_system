import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { Menu, Switch } from 'ant-design-vue';
import Antd from 'ant-design-vue'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css';
import { library, dom } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";

library.add(fas, far, fab);
dom.watch();

const app = createApp(App) 
app.component("font-awesome-icon", FontAwesomeIcon);
app.use(store)
app.use(router)
app.mount('#app')
app.use(Antd)
app.use(Menu);
app.use(Switch);
