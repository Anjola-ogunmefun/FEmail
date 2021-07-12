import { createStore } from 'vuex';

import authModule from './modules/auth/index.js';
import userModule from './modules/user/index.js'
import mailModule from './modules/mail/index.js'

const store = createStore({
  modules: {
    auth: authModule,
    user: userModule,
    mail: mailModule,
  }
});

export default store;