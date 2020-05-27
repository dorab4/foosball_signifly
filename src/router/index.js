import Vue from 'vue'
import VueRouter from 'vue-router'
import WelcomeComponent from '../views/WelcomeComponent.vue'
import CreateTournament from '../views/CreateTournament.vue'
import TrackTournament from '../views/TrackTournament.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: WelcomeComponent
  },
  {
    path: '/create-tournament',
    name: 'CreateTournament',
    component: CreateTournament
  },
  {
    path: '/track-tournament',
    name: 'TrackTournament',
    component: TrackTournament
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
