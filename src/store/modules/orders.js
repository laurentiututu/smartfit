import config from '../resources/endpoints/orders.json'
import axios from 'axios'

const state = {
  orders: [],
  user_orders: []
}
const getters = {
  getOrders: state => state.orders,
  getUserOrders: state => state.user_orders
}
const actions = {
  async fetchOrders({ commit, dispatch }, token) {
  	const response = await axios
    .get(config.all)

  	commit('setOrders', response.data.data.orders)
  },
  async fetchUserOrders({ commit, dispatch }, token) {
    const response = await axios
    .get(config.me)

    commit('setUserOrders', response.data.data.orders)
  },
  async updateOrder({ dispatch }, { id, action }) {
    await axios
    .patch(config.manage.replace('{{id}}', id).replace('{{action}}', action), {})
    .then(response => {
      dispatch('fetchOrders')
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
  }
}
const mutations = {
  setOrders: (state, orders) => state.orders = orders,
  setUserOrders: (state, orders) => state.user_orders = orders
}

export default {
  state, getters, actions, mutations
}