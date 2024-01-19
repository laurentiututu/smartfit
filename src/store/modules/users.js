import config from '../resources/endpoints/users.json'
import axios from 'axios'

const state = {
  user_details: {},
  access_status: {},
  users: [],
  user: {},
  code_in: '',
  code_out: '',
  gym_history: []
}
const getters = {
  getUserDetails: state => state.user_details,
  getAccessStatus: state => state.access_status,
  getUsers: state => state.users,
  getUser: state => state.user,
  getCodeIn: state => state.code_in,
  getCodeOut: state => state.code_out,
  getGymHistory: state => state.gym_history
}
const actions = {
  async fetchUserDetails({ commit, dispatch }, token) {
  	const response = await axios
    .get(config.me)

  	commit('setUserDetails', response.data.data.user)
  },
  async fetchAccessStatus({ commit }, token) {
    const response = await axios
    .get(config.access);
    commit('setAccessStatus', response.data.data)
  },
  async fetchUsers({ commit }, token) {
    const response = await axios
    .get(config.users);

    commit('setUsers', response.data.data.users)
  },
  async fetchUser({ commit }, {id, token}) {
    const response = await axios
    .get(config.user.replace('{{id}}', id));

    commit('setUser', response.data.data.user)
  },
  async updateUserDetails({ commit, dispatch }, data) {
    await axios
    .patch(config.me, data)
    .then(response => {
      commit('setUserDetails', response.data.data.user)
      dispatch('spawnNotification', {
        type: 'success',
        message: 'Details updated successfully.',
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
  async updateUserPassword({ commit, dispatch }, data) {
    await axios
    .patch(config.pass_update, data)
    .then(response => {
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('refresh_token', response.data.refreshToken)
      localStorage.setItem('user_role', response.data.data.user.role)
      dispatch('spawnNotification', {
        type: 'success',
        message: 'Password updated successfully.',
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
  async updateUserImage({ commit, dispatch }, image) {
    await axios
    .put(config.picture, image)
    .then(response => {
      commit('setUserDetails', response.data.data.user)
      dispatch('spawnNotification', {
        type: 'success',
        message: 'Profile picture updated successfully',
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
  async deleteUserImage({ commit }) {
    const response = await axios
    .delete(config.picture)
  },
  async deleteUser({ commit, dispatch }, id) {
    await axios
    .delete(config.user.replace('{{id}}', id))
    .then(() => {
      dispatch('fetchUsers')
      dispatch('spawnNotification', {
        type: 'success',
        message: 'User deleted successfully',
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
  async editUser({ dispatch }, {id, data}) {
    await axios
    .patch(config.user.replace('{{id}}', id), data)
    .then(() => {
      dispatch('fetchUsers')
      dispatch('spawnNotification', {
        type: 'success',
        message: 'User updated successfully',
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
  async fetchCodeIn({ commit, dispatch }) {
    await axios
    .get(config.gym_in)
    .then(response => {
      commit('setCodeIn', response.data.data.qr)
    })
  },
  async fetchCodeOut({ commit, dispatch }) {
    await axios
    .get(config.gym_out)
    .then(response => {
      commit('setCodeOut', response.data.data.qr)
    })
  },
  async fetchGymHistory({ commit, dispatch }) {
    await axios
    .get(config.gym_history)
    .then(response => {
      commit('setGymHistory', response.data.data.inoutlogs)
    })
  }
}
const mutations = {
  setUserDetails: (state, details) => state.user_details = details,
  setAccessStatus: (state, status) => state.access_status = status,
  setUsers: (state, users) => state.users = users,
  setUser: (state, user) => state.user = user,
  setCodeIn: (state, code) => state.code_in = code,
  setCodeOut: (state, code) => state.code_out = code,
  setGymHistory: (state, history) => state.gym_history = history
  // addDiscipline: (state, discipline) => state.new_discipline = discipline
}

export default {
  state, getters, actions, mutations
}