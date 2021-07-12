import { createRouter, createWebHistory } from "vue-router";

import RegisterPage from "./components/pages/auth/RegisterPage";
import LoginPage from "./components/pages/auth/LoginPage";
import HomePage from "./components/pages/Dashboard/HomePage";
import ComposePage from "./components/pages/Dashboard/ComposePage";
import InboxPage from './components/pages/Dashboard/InboxPage';
import DraftPage from './components/pages/Dashboard/DraftPage'
import SentPage from './components/pages/Dashboard/SentPage'
import BinPage from './components/pages/Dashboard/BinPage'
import ResetPswd from './components/pages/auth/ResetPswd'
import TestPage from "./components/pages/Dashboard/TestPage";
import NotFound from "./components/pages/NotFound.vue";

import store from "./components/store/index.js";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/home", meta: { requiresAuth: true } },
    {
      path: "/register",
      component: RegisterPage,
      meta: { requiresUnauth: true }
    },
    { path: "/login", component: LoginPage, meta: { requiresUnauth: true } },
    { path: "/home", component: HomePage, meta: { requiresAuth: true } },
    { path: "/compose", component: ComposePage, meta:{ requiresAuth: true }},
    { path: "/inbox", component:InboxPage, meta:{ requiresAuth: true }},
    { path: "/draft", component:DraftPage, meta:{ requiresAuth: true }},
    { path: "/sent", component:SentPage, meta:{ requiresAuth: true }},
    { path: "/bin", component:BinPage, meta:{ requiresAuth: true }},

    {path:"/reset_pswd", component:ResetPswd, meta: { requiresUnauth: true }},

    { path: "/test", component: TestPage },
    { path: "/:notFound(.*)", component: NotFound },
  ],
});

router.beforeEach(function(to, _, next) {
  if (to.meta.requiresAuth && !store.getters.isAuthenticated) {
    next("/login");
  } else if (to.meta.requiresUnauth && store.getters.isAuthenticated) {
    next("/home");
  } else {
    next();
  }
});
export default router;
