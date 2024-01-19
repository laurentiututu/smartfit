import config from '../resources/endpoints/equipment.json'
import axios from 'axios'
const picture_header = {headers: {"Authorization" : `Bearer ${localStorage.getItem('token')}`,"Content-Type": "multipart/form-data"} }

const state = {
  equipments: [],
  new_equipment: {}
}
const getters = {
  getEquipments: state => state.equipments,
  getNewEquipment: state => state.new_equipment
}
const actions = {
  async fetchEquipments({ commit }) {
  	const response = await axios.get(config.all);
  	commit('setEquipments', response.data.data.equipment)
  },
  async addEquipment({ commit, dispatch }, {equipment, picture}) {
    await axios
    .post(config.new, equipment)
    .then(response => {
      let api_response = response.data.data.equipment
      axios
      .put(config.pictures.replace('{{id}}', api_response.id), picture, picture_header)
      .then(res => {
        let equipment_received = res.data.data.equipment
        commit('addEquipment', response.data.data.equipment)
        dispatch('fetchEquipments')
        dispatch('spawnNotification', {
          type: 'success',
          message: 'Equipment added successfully',
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
  async editEquipment({ dispatch }, {id, data, picture}) {
    await axios
    .patch(config.id.replace('{{id}}', id), data)
    .then(response => {
      if (picture) {
        let pictureId = response.data.data.equipment.pictures[0].id
        dispatch('addEquipmentPicture', {id: id, picture_id: pictureId,  picture: picture})
      }
      else {
        dispatch('fetchEquipments')
      }
      dispatch('spawnNotification', {
        type: 'success',
        message: 'Equipment edited successfully',
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
  async addEquipmentPicture({ dispatch }, {id, picture_id, picture}) {
    if (picture_id) {
      await axios
      .delete(config.pictures.replace('{{id}}', id) + `/${picture_id}`, picture_header)
      .then(() => {
        axios
        .put(config.pictures.replace('{{id}}', id), picture, picture_header)
        .then(() => { dispatch('fetchEquipments') })
      })
    } else {
      await axios
      .put(config.pictures.replace('{{id}}', id), picture, picture_header)
    }
  },
  async deleteEquipment({ dispatch }, id) {
    await axios
    .delete(config.id.replace('{{id}}', id))
    .then(() => {
      dispatch('fetchEquipments')
      dispatch('spawnNotification', {
        type: 'success',
        message: 'Equipment deleted successfully',
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
  setEquipments: (state, equipments) => state.equipments = equipments,
  addEquipment: (state, equipment) => state.new_equipment = equipment
}

export default {
  state, getters, actions, mutations
}