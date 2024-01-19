import config from '../resources/endpoints/subscriptions.json'
import axios from 'axios'
const picture_header = {headers: {"Authorization" : `Bearer ${localStorage.getItem('token')}`,"Content-Type": "multipart/form-data"} }

const state = {
  subscriptions: [],
  subscriptions_favourite: [],
  user_subscriptions: [],
  subscription: {}
}
const getters = {
  getSubscriptions: state => state.subscriptions,
  getSubscriptionsFavourite: state => state.subscriptions_favourite,
  getUserSubscriptions: state => state.user_subscriptions
}
const actions = {
  async fetchSubscriptions({ commit }) {
  	const response = await axios.get(config.all);
  	commit('setSubscriptions', response.data.data.subscriptions)
  },
  async fetchSubscriptionsFavourite({ commit }) {
    const response = await axios.get(config.all + '?favorite=true');
    commit('setSubscriptionsFavourite', response.data.data.subscriptions)
  },
  async fetchUserSubscriptions({ commit }) {
    const response = await axios.get(config.me);
    commit('setUserSubscriptions', response.data.data.subscriptions)
  },
  async addSubscription({ commit, dispatch }, {subscription, picture}) {
    await axios
    .post(config.new, subscription)
    .then(response => {
      let api_response = response.data.data.subscription
      axios
      .put(config.pictures.replace('{{id}}', api_response.id), picture, picture_header)
      .then(res => {
        let subscription_received = res.data.data.subscription
        commit('newSubscription', subscription_received)
        dispatch('fetchSubscriptions')
        dispatch('spawnNotification', {
          type: 'success',
          message: 'Subscription added successfully',
          action1: { label: 'OK' }
        });
      })
    })
    .catch(error => {
      dispatch('spawnNotification', {
        type: 'danger',
        message: error.response.data.message,
        action1: { label: 'OK' }
      });
    })
  },
  async editSubscription({ dispatch }, {id, data, picture}) {
    await axios
    .patch(config.id.replace('{{id}}', id), data)
    .then(response => {
      if (picture) {
        let pictureId = response.data.data.subscription.pictures[0].id
        dispatch('addSubscriptionPicture', {id: id, picture_id: pictureId,  picture: picture})
      } else {
        dispatch('fetchSubscriptions')
      }
      dispatch('spawnNotification', {
        type: 'success',
        message: 'Subscription edited successfully',
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
  async addSubscriptionPicture({ dispatch }, {id, picture_id, picture}) {
    if (picture_id) {
      await axios
      .delete(config.pictures.replace('{{id}}', id) + `/${picture_id}`, picture_header)
      .then(() => {
        axios
        .put(config.pictures.replace('{{id}}', id), picture, picture_header)
        .then(() => { dispatch('fetchSubscriptions') })
      })
    } else {
      await axios
      .put(config.pictures.replace('{{id}}', id), picture, picture_header)
    }
  },
  async deleteSubscription({ dispatch }, id) {
    await axios
    .delete(config.id.replace('{{id}}', id))
    .then(() => {
      dispatch('fetchSubscriptions')
      dispatch('spawnNotification', {
        type: 'success',
        message: 'Subscription deleted successfully',
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
  async addFavouriteSubscription({ commit, dispatch }, id) {
    await axios
    .post(config.favorite.replace('{{id}}', id), {})
    .then(response => {
      dispatch('fetchUserDetails')
      dispatch('fetchSubscriptions')
      dispatch('fetchSubscriptionsFavourite')
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
  async deleteFavouriteSubscription({ commit, dispatch }, id) {
    await axios
    .delete(config.favorite.replace('{{id}}', id))
    .then(() => {
      dispatch('fetchUserDetails')
      dispatch('fetchSubscriptions')
      dispatch('fetchSubscriptionsFavourite')
      dispatch('spawnNotification', {
        type: 'success',
        message: 'Subscription removed from favorites',
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
  setSubscriptions: (state, subscriptions) => state.subscriptions = subscriptions,
  setSubscriptionsFavourite: (state, subscriptions) => state.subscriptions_favourite = subscriptions,
  setUserSubscriptions: (state, subscriptions) => state.user_subscriptions = subscriptions,
  newSubscription: (state, subscription) => state.subscription = subscription
}

export default {
  state, getters, actions, mutations
}