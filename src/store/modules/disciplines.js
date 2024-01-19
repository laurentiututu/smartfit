import config from '../resources/endpoints/disciplines.json'
import axios from 'axios'
const picture_header = {headers: {"Authorization" : `Bearer ${localStorage.getItem('token')}`,"Content-Type": "multipart/form-data"} }

const state = {
  disciplines: [],
  new_discipline: {}
}
const getters = {
  getDisciplines: state => state.disciplines,
  getNewDiscipline: state => state.new_discipline
}
const actions = {
  async fetchDisciplines({ commit }) {
  	const response = await axios.get(config.all);
  	commit('setDisciplines', response.data.data.disciplines)
  },
  async addDiscipline({ commit, dispatch }, {discipline, picture}) {
    await axios
    .post(config.new, discipline)
    .then(response => {
      let api_response = response.data.data.discipline
      axios
      .put(config.pictures.replace('{{id}}', api_response.id), picture, picture_header)
      .then(res => {
        let discipline_received = res.data.data.discipline
        commit('addDiscipline', response.data.data.discipline)
        dispatch('fetchDisciplines')
        dispatch('spawnNotification', {
          type: 'success',
          message: 'Discipline added successfully',
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
  async editDiscipline({ dispatch }, {id, data, picture}) {
    await axios
    .patch(config.id.replace('{{id}}', id), data)
    .then(response => {
      if (picture) {
        let pictureId = response.data.data.discipline.pictures[0].id
        dispatch('addDisciplinePicture', {id: id, picture_id: pictureId,  picture: picture})
      }
      else {
        dispatch('fetchDisciplines')
      }
      dispatch('spawnNotification', {
        type: 'success',
        message: 'Discipline edited successfully',
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
  async addDisciplinePicture({ dispatch }, {id, picture_id, picture}) {
    if (picture_id) {
      await axios
      .delete(config.pictures.replace('{{id}}', id) + `/${picture_id}`, picture_header)
      .then(() => {
        axios
        .put(config.pictures.replace('{{id}}', id), picture, picture_header)
        .then(() => { dispatch('fetchDisciplines') })
      })
    } else {
      await axios
      .put(config.pictures.replace('{{id}}', id), picture, picture_header)
    }
  },
  async deleteDiscipline({ dispatch }, id) {
    await axios
    .delete(config.id.replace('{{id}}', id))
    .then(() => {
      dispatch('fetchDisciplines')
      dispatch('spawnNotification', {
        type: 'success',
        message: 'Discipline deleted successfully',
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
  setDisciplines: (state, disciplines) => state.disciplines = disciplines,
  addDiscipline: (state, discipline) => state.new_discipline = discipline
}

export default {
  state, getters, actions, mutations
}