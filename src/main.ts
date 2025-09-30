import { createApp } from 'vue';
import { createPinia } from 'pinia';
import CKEditor from '@ckeditor/ckeditor5-vue';

import { createSecurePersistedState } from './plugins/pinia-secure-persist';

import './assets/scss/main.scss';

import App from './App.vue';
import router from './router';

const app = createApp(App);

const pinia = createPinia();

// Use custom get and set to LS which work with secureLS package to persist Pinia
pinia.use(createSecurePersistedState());

app.use(pinia);
app.use(router);
app.use(CKEditor);

app.mount('#app');
