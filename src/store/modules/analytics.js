import config from '../resources/endpoints/analytics.json'
import axios from 'axios'

const state = {
  analytics_public: [],
  analytics_admin: [],
  total_people: [],
  avg_time: [],
  dates: [],
  gym_population: '',
  employees: '',
  orders: '',
  weather: ''
}
const getters = {
  getAnalyticsPublic: state => state.analytics_public,
  getAnalyticsAdmin: state => state.analytics_admin,
  getTotalPeople: state => state.total_people,
  getAvgTime: state => state.avg_time,
  getDates: state => state.dates,
  getGymPopulation: state => state.gym_population,
  getEmployeesCounter: state => state.employees,
  getOrdersCounter: state => state.orders,
  getWeather: state => state.weather
}
const actions = {
  async fetchAnalyticsPublic({ commit, dispatch }) {
  	await axios
    .get(config.public)
    .then(response => {
      commit('setGymPopulation', response.data.data.currentPeople)
      commit('setAnalyticsPublic', response.data.data)
    })
  },
  async fetchAnalyticsAdmin({ commit, dispatch }) {
    await axios
    .get(config.admin + '?sort=date')
    .then(response => {
      let totalPeople = []
      let averageTime = []
      let dates = []
      response.data.data.analytics.forEach(item => {
        totalPeople.push(item.total_people)
        averageTime.push(Math.round(item.average_time_spent).toFixed(2))
        dates.push(item.date)
      })
      commit('updateTotalPeople', totalPeople)
      commit('updateAvgTime', averageTime)
      commit('updateDates', dates)
      commit('setAnalyticsAdmin', response.data.data.analytics)
    })
  },
  async fetchDashboard({ commit, dispatch }) {
    await axios
    .get(config.dashboard)
    .then(response => {
      commit('setEmployeesCounter', response.data.data.administrators)
      commit('setOrdersCounter', response.data.data.pendingOrders)
    })
  },
  async fetchWeather({ commit, dispatch }) {
    await axios
    .get(config.weather)
    .then(response => {
      commit('setWeather', response.data.data)
    })
  }
}
const mutations = {
  setAnalyticsPublic: (state, analytics) => state.analytics_public = analytics,
  setAnalyticsAdmin: (state, analytics) => state.analytics_admin = analytics,
  updateTotalPeople: (state, people) => state.total_people = people,
  updateAvgTime: (state, time) => state.avg_time = time,
  updateDates: (state, date) => state.dates = date,
  setGymPopulation: (state, population) => state.gym_population = population,
  setEmployeesCounter: (state, employees) => state.employees = employees,
  setOrdersCounter: (state, orders) => state.orders = orders,
  setWeather: (state, weather) => state.weather = weather
}

export default {
  state, getters, actions, mutations
}