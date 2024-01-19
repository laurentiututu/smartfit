import config from '../resources/endpoints/cart.json'
import axios from 'axios'
import { vm } from '@/main'

const state = {
  cart: {},
  cart_products: [],
  cart_discounts: [],
  cart_prices: {}
}
const getters = {
  getCart: state => state.cart,
  getCartProducts: state => state.cart_products,
  getCartDiscounts: state => state.cart_discounts,
  getCartPrices: state => state.cart_prices,
}
const actions = {
  async fetchCart({ commit, dispatch }, token) {
  	const response = await axios
    .get(config.cart)

    // commit('setCart', response.data.data.cart)
    commit('setCartProducts', response.data.data.cart.products)
    commit('setCartDiscounts', response.data.data.cart.discounts)
  	commit('setCartPrices', response.data.data.cart.prices)
  },
  async addProduct({ dispatch }, id) {
    const response = await axios
    .post(config.id.replace('{{id}}', id), {})
    .then(response => {
      dispatch('fetchCart')
      dispatch('spawnNotification', {
        type: 'success',
        message: response.data.data.message,
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
  async updateProduct({ dispatch }, {id, qty}) {
    const response = await axios
    .patch(config.id.replace('{{id}}', id), qty)
  },
  async deleteProduct({ commit, dispatch }, id) {
    await axios
    .delete(config.id.replace('{{id}}', id))
    .then(response => {
      commit('setCartProducts', response.data.data.cart.products)
      commit('setCartDiscounts', response.data.data.cart.discounts)
      commit('setCartPrices', response.data.data.cart.prices)
      dispatch('spawnNotification', {
        type: 'success',
        message: 'Subscription removed from cart.',
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
  async addCartDiscount({ commit, dispatch }, code) {
    await axios
    .post(config.discount_add.replace('{{code}}', code), {})
    .then(response => {
      commit('setCartProducts', response.data.data.cart.products)
      commit('setCartDiscounts', response.data.data.cart.discounts)
      commit('setCartPrices', response.data.data.cart.prices)
      dispatch('spawnNotification', {
        type: 'success',
        message: 'Discount added successfully.',
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
  async deleteCartDiscount({ commit, dispatch }, id) {
    await axios
    .delete(config.discount_remove.replace('{{id}}', id))
    .then(response => {
      commit('setCartProducts', response.data.data.cart.products)
      commit('setCartDiscounts', response.data.data.cart.discounts)
      commit('setCartPrices', response.data.data.cart.prices)
      dispatch('spawnNotification', {
        type: 'success',
        message: 'Discount deleted successfully.',
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
  async placeOrder({ dispatch }, method) {
    await axios
    .get(config.order.replace('{{method}}', method))
    .then(response => {
      if (response.data.data.payment_url) {
        window.location.assign(response.data.data.payment_url)
      } else {
        vm.$router.push('/')
        dispatch('spawnNotification', {
          type: 'success',
          message: response.data.data.message,
          action1: { label: 'OK' }
        });
      }
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
  setCart: (state, cart) => state.cart = cart,
  setCartProducts: (state, products) => state.cart_products = products,
  setCartDiscounts: (state, discounts) => state.cart_discounts = discounts,
  setCartPrices: (state, prices) => state.cart_prices = prices,
}

export default {
  state, getters, actions, mutations
}