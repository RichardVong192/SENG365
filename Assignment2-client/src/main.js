import Vue from 'vue'
import App from './App.vue'
import Home from './Home.vue';
import Petitions from "./Petitions.vue";
import Test from "./Test.vue"
import Petition from "./Petition";
import Profile from "./Profile";
import ProfileEditPage from "./ProfileEditPage";
import Login from "./Login";


import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
Vue.use(Buefy)

import axios from 'axios';
import VueAxios from "vue-axios";
Vue.use(VueAxios, axios);

import VueRouter from "vue-router";
import PetitionCreate from "./PetitionCreate";
import MyPetitions from "./MyPetitions";
import PetitionEditPage from "./PetitionEditPage";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: Home
  },
  {
    path: "/petitions",
    component: Petitions
  },
  {
    path: "/test",
    component: Test
  },
  {
    path: "/petitions/:petitionId",
    name: "petition",
    component: Petition
  },
  {
    path: "/profile/:userId",
    component: Profile
  },
  {
    path: "/profile/:userId/edit",
    component: ProfileEditPage
  },
  {
    path: "/login",
    component: Login
  },
  {
    path: "/petitionCreate",
    component: PetitionCreate
  },
  {
    path: "/myPetitions",
    component: MyPetitions,
  },
  {
    path: "/petitions/:petitionId/edit",
    component: PetitionEditPage,
  }
];

const router = new VueRouter({
  routes: routes,
  mode: 'history'
});


new Vue({
  el: '#app',
  router: router,
  render: h => h(App)
})
