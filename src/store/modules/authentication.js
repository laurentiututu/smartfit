import config from '../resources/endpoints/authentication.json'
import axios from 'axios'
import { vm } from '@/main'

const state = {
  userData: {},
}
const getters = {
  getUserData: state => state.userData
}
const actions = {
  async fetchRegister({ dispatch }, credentials) {
    await axios
    .post(config.signup, credentials)
    .then(response => {
      dispatch('spawnNotification', {
        type: 'success',
        message: response.data.message,
        action1: { label: 'OK' }
      });
    })
    .catch(error => {
      dispatch('spawnNotification', {
        type: 'danger',
        message: error.response.data.message,
        action1: { label: 'OK' }
      });
    })
  },
  async fetchForgotPassword({ commit, dispatch }, credentials) {
    await axios
    .post(config.pass_forgot, credentials)
    .then(response => {
      dispatch('spawnNotification', {
        type: 'success',
        message: response.data.message,
        action1: { label: 'OK' }
      });
    })
    .catch(error => {
      dispatch('spawnNotification', {
        type: 'danger',
        message: error.response.data.message,
        action1: { label: 'OK' }
      });
    })
  },
  async fetchResetPassword({ commit, dispatch }, credentials) {
    await axios
    .patch(config.pass_reset, credentials)
    .then(response => {
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('refresh_token', response.data.refreshToken)
      localStorage.setItem('user_role', response.data.data.user.role)
      vm.$router.push('/')
      commit('setUserData', response.data.data.user)

      dispatch('spawnNotification', {
        type: 'success',
        message: 'Password changed successfully.',
        action1: { label: 'OK' }
      });
    })
    .catch(error => {
      dispatch('spawnNotification', {
        type: 'danger',
        message: error.response.data.message,
        action1: { label: 'OK' }
      });
    })
  },
  async fetchLogin({ commit, dispatch }, credentials) {
  	await axios
    .post(config.login, credentials)
    .then(response => {
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('refresh_token', response.data.refreshToken)
      localStorage.setItem('user_role', response.data.data.user.role)
  	  commit('setUserData', response.data.data.user)
      dispatch('spawnNotification', {
        type: 'success',
        message: 'You\'ve logged in successfully.',
        action1: { label: 'OK' }
      });
      vm.$router.push('/')
    })
    .catch(error => {
      dispatch('spawnNotification', {
        type: 'danger',
        message: error.response.data.message,
        action1: { label: 'OK' }
      });
    })
  },
  async fetchLogout({ commit }) {
    localStorage.removeItem('token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user_role')
    vm.$router.go()
  }
}
const mutations = {
  setUserData: (state, userData) => state.userData = userData,
}

export default {
  state, getters, actions, mutations
}