import config from '../resources/endpoints/discounts.json'
import axios from 'axios'

const state = {
  discounts: [],
}
const getters = {
  getDiscounts: state => state.discounts,
}
const actions = {
  async fetchDiscounts({ commit, dispatch }, token) {
  	const response = await axios
    .get(config.all)

  	commit('setDiscounts', response.data.data.discounts)
  },
  async editDiscount({ dispatch }, {id, data}) {
    const response = await axios
    .patch(config.id.replace('{{id}}', id), data)
    .then(() => {
      dispatch('fetchDiscounts')
      dispatch('spawnNotification', {
        type: 'success',
        message: 'Discount edited successfully',
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
  async addDiscount({ dispatch },  data) {
    const response = await axios
    .post(config.new, data)
    .then(() => {
      dispatch('fetchDiscounts')
      dispatch('spawnNotification', {
        type: 'success',
        message: 'Discount added successfully',
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
  async deleteDiscount({ dispatch }, id) {
    let data = { active: false }
    const response = await axios
    .patch(config.id.replace('{{id}}', id), data)
    .then(() => {
      dispatch('fetchDiscounts')
      dispatch('spawnNotification', {
        type: 'success',
        message: 'Discount deleted successfully',
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
  setDiscounts: (state, discounts) => state.discounts = discounts,
}

export default {
  state, getters, actions, mutations
}