<template>
  <div class="home">
    <h1 class="headingTitle">Dashboard</h1>
    <template v-if="activeSubscription">
      <QrCodeVue class="qrcode mobile-only" :key="qrCode" :value="qrCode" size="300" level="H" render-as="svg" />
    </template>
    <div class="data__basic">
      <div class="data__minimal">
        <div class="data__minimal--text">
          <p>{{ `${athletes} athletes` }}</p>
          <span>Activity</span>
        </div>
        <div class="data__minimal--icon">
          <img src="@/assets/icons/gym.png">
        </div>
      </div>
      <div class="data__minimal">
        <div class="data__minimal--text">
          <p>{{ `${gymTime} hours` }}</p>
          <span>Gym Time</span>
        </div>
        <div class="data__minimal--icon">
          <img src="@/assets/icons/time.png">
        </div>
      </div>
      <div class="data__minimal">
        <div class="data__minimal--text">
          <p>{{ `${checkIns} times` }}</p>
          <span>Check Ins</span>
        </div>
        <div class="data__minimal--icon">
          <img src="@/assets/icons/enter.png">
        </div>
      </div>
    </div>
    <div class="data__basic">
      <div class="data__basic--container">
        <apexchart
          :key="chartReloader"
          type="area"
          height="250"
          :options="chartActivity"
          :series="timeInGym"
        />
      </div>
      <div class="data__basic--container">
        <div class="weather__header">
          <div class="weather__container">
            <h4>Weather</h4>
            <div class="location">
              <div class="location__icon">
                <img src="@/assets/icons/pin.png">
              </div>
              <p>Galati</p>
            </div>
          </div>
          <div class="weather__container">
            <div class="location__symbol">
              <img src="@/assets/icons/cloudy.png">
            </div>
          </div>
        </div>
        <div class="weather__header">
          <div class="weather__item">
            <div class="weather__icon">
              <img src="@/assets/icons/thermometer.png">
            </div>
            <div class="weather__info-text">
              <p>{{ currentTemp(getWeather) }}</p>
              <span>Temp</span>
            </div>
          </div>
          <div class="weather__item">
            <div class="weather__icon">
              <img src="@/assets/icons/umbrella.png">
            </div>
            <div class="weather__info-text">
              <p>{{ currentRain(getWeather) }}</p>
              <span>Rain</span>
            </div>
          </div>
          <div class="weather__item">
            <div class="weather__icon">
              <img src="@/assets/icons/wind-energy.png">
            </div>
            <div class="weather__info-text">
              <p>{{ currentWind(getWeather) }}</p>
              <span>Wind</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="logs">
      <div v-for="(log, i) in gymHistory" :key="i" class="logs__item">
        <div class="logs__item--in">
          <div class="logs__item--in-image">
            <img src="@/assets/icons/check_in.png">
          </div>
          <p>{{ `${currentDate(log.date_in)} @${formatTime(log.date_in)}` }}</p>
        </div>
        <div class="logs__item--out">
          <div class="logs__item--out-image">
            <img src="@/assets/icons/check_out.png">
          </div>
          <p>{{ log.date_out ? `${currentDate(log.date_out)} @${formatTime(log.date_out)}` : '--:--' }}</p>
        </div>
      </div>
    </div>
    <button v-if="isAdmin" class="adminButton mobile-only" @click="$router.push('/admin')">Administrate</button>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import apexchart from 'vue-apexcharts'
import QrCodeVue from 'qrcode.vue'

export default {
  name: 'Home',
  sockets: {
    generateQR (data) {
      this.fetchAccessStatus()
      if (data == 'in') {
        this.$store.dispatch('spawnNotification', {
          type: 'success',
          message: 'QR code is OK. You may enter Gym now.',
          action1: { label: 'OK' }
        });
      }
      if (data == 'out') {
        this.$store.dispatch('spawnNotification', {
          type: 'success',
          message: 'QR code is OK. Have a nice day! :)',
          action1: { label: 'OK' }
        });
      }
      
    }
  },
  components: {
    apexchart,
    QrCodeVue
  },
  data () {
    return {
      activeSubscription: false,
      chartReloader: 0,
      qrCode: '',
      gymTime: '',
      checkIns: '',
      timeInGym: [{
        name: "Minutes",
        data: []
      }],
      chartActivity: {
        chart: {
          type: 'area',
          height: 250,
          fontFamily: 'Raleway, sans-serif',
          zoom: {
            enabled: false
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'straight'
        },
        
        title: {
          text: 'Time spent in Gym',
          align: 'left'
        },
        labels: [],
        xaxis: {
          type: 'string',
        },
        yaxis: {
          opposite: false
        },
        legend: {
          horizontalAlign: 'left'
        },
        colors: ['#FA735A']
      },
    }
  },
  async mounted () {
    await this.fetchUserDetails()
    await this.fetchAnalytics()
    await this.fetchGymHistory()
    await this.fetchWeather()
    await this.fetchAccessStatus()
    await this.openSocketSession()
  },
  watch: {
    async accessStatus () {
      if (this.accessStatus.enter && !this.accessStatus.exit) {
        await this.fetchCodeIn()
        this.activeSubscription = true
        this.qrCode = this.codeIn
      } else if (!this.accessStatus.enter && this.accessStatus.exit) {
        await this.fetchCodeOut()
        this.activeSubscription = true
        this.qrCode = this.codeOut
      } else {
        this.activeSubscription = false
      }
    }
  },
  computed: {
    ...mapGetters({
      userDetails: 'getUserDetails',
      accessStatus: 'getAccessStatus',
      codeIn: 'getCodeIn',
      codeOut: 'getCodeOut',
      athletes: 'getGymPopulation',
      analytics: 'getAnalyticsPublic',
      gymHistory: 'getGymHistory',
      getWeather: 'getWeather'
    }),
    isAdmin () {
      return localStorage.getItem('user_role') !== 'user'
    }
  },
  methods: {
    ...mapActions({
      fetchUserDetails: 'fetchUserDetails',
      fetchAccessStatus: 'fetchAccessStatus',
      fetchCodeIn: 'fetchCodeIn',
      fetchCodeOut: 'fetchCodeOut',
      fetchAnalyticsPublic: 'fetchAnalyticsPublic',
      fetchGymHistory: 'fetchGymHistory',
      fetchWeather: 'fetchWeather'
    }),
    openSocketSession () {
      this.$socket.auth = { token: localStorage.getItem('token') }
      this.$socket.open()
    },
    async fetchAnalytics () {
      await this.fetchAnalyticsPublic()
      const response = this.analytics

      this.gymTime = response.myGymTime.hours.toFixed(2)
      this.checkIns = response.myCheckInCount
      response.myActivity.forEach(day => {
        this.timeInGym[0].data.push(day.timeSpent)
        this.chartActivity.labels.push(day.date_name)
        this.chartReloader++
      })
    },
    currentTemp (weather) {
      const currentDate = new Date().getDate()
      const currentHour = new Date().getHours()

      let index = weather?.hourly?.time.findIndex(item => {
        return item = currentDate == new Date(item).getDate() && currentHour == new Date(item).getHours()
      })
      return weather?.hourly?.temperature_2m[index]
    },
    currentRain (weather) {
      const currentDate = new Date().getDate()
      const currentHour = new Date().getHours()

      let index = weather?.hourly?.time.findIndex(item => {
        return item = currentDate == new Date(item).getDate() && currentHour == new Date(item).getHours()
      })
      return weather?.hourly?.rain[index]
    },
    currentWind (weather) {
      const currentDate = new Date().getDate()
      const currentHour = new Date().getHours()

      let index = weather?.hourly?.time.findIndex(item => {
        return item = currentDate == new Date(item).getDate() && currentHour == new Date(item).getHours()
      })
      return weather?.hourly?.windspeed_120m[index]
    },
    currentDate (item) {
      let date = new Date(item)
      let month = date.toLocaleString('ro-ro', { day: 'numeric', month: 'long', year: 'numeric' })
      return month
    },
    formatTime (date) {
      let ms = Date.parse(date)

      let hours = new Date(ms).getHours();
      let minutes = new Date(ms).getMinutes();
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
    },
  }
}
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.home {
  padding: var(--spacer-lg) var(--spacer-2xl);
  @include for-mobile {
    padding: var(--spacer-sm) var(--spacer-sm) 6rem;
  }
}
.data {
  &__basic {
    @include for-desktop {
      display: flex;
      justify-content: space-between;
      margin-bottom: var(--spacer-base);
    }

    &--container {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      border-radius: 20px;
      box-shadow: 1px 3px 10px 0px rgba(0,0,0,.1);
      padding: var(--spacer-sm);
      background: var(--c-white);
      @include for-desktop {
        flex: 1 1 calc(49% - var(--spacer-lg));
        width: calc(49% - var(--spacer-lg));
        &:first-child {
          margin-right: var(--spacer-sm);
        }
        &:last-child {
          margin-left: var(--spacer-sm);
        }
      }
      @include for-mobile {
        margin: var(--spacer-xs) 0;
        width: calc(100% - 2rem);
      }
      &-full-width {
        @include for-desktop {
          margin: 0 !important;
          width: inherit !important;
        }
        @include for-mobile {
          margin: 0 0 var(--spacer-sm);
          width: calc(100% - 2rem) !important;
        }
        // min-height: 15.55rem;
      }
    }
  }
  &__minimal {
    display: flex;
    justify-content: space-between;
    background: var(--c-primary);
    padding: var(--spacer-sm);
    border-radius: 16px;
    width: 25%;
    height: 5rem;
    @include for-mobile {
      width: calc(100% - 2rem);
      margin-bottom: var(--spacer-2xs);
      height: 3rem;
    }

    &--text {
      color: var(--c-white);
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      padding-left: var(--spacer-xs);
      p {
        margin: 0;
        font-size: 1.35rem;
        text-transform: capitalize;
      }
      span {
        font-size: var(--font-sm);
        font-weight: var(--font-semibold);
      }
    }
    &--icon {
      position: relative;
      width: 2.5rem;
      height: 2.5rem;
      margin: var(--spacer-2xs);
      background: rgba(0,0,0,.5);
      border-radius: 12px;
      img {
        position: absolute;
        width: 60%;
        height: 60%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        filter: invert(1);
        object-fit: cover;
      }
    }
  }
}
.qrcode {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: auto;
  padding: var(--spacer-sm) var(--spacer-sm) var(--spacer-sm) 0;
}
.weather {
  &__header {
    display: flex;
    width: 100%;
    justify-content: space-between;
  }
  &__container {
    padding: 0 var(--spacer-2xs);
    h4 {
      margin: var(--spacer-2xs) var(--spacer-xs) var(--spacer-base);
      font-size: var(--font-sm);
      font-weight: var(--font-bold);
      font-family: var(--font-family-secondary);
      @include for-mobile {
        margin: var(--spacer-2xs) var(--spacer-xs) var(--spacer-xs);
      }
    }
  }
  &__info-text {
    margin-left: var(--spacer-sm);
  }
  &__icon {
    @include for-mobile {
      width: 1.5rem;
      height: 1.5rem;
    }
    width: 2.5rem;
    height: 2.5rem;
    position: relative;
    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      filter: invert(63%) sepia(12%) saturate(5000%) hue-rotate(321deg) brightness(97%) contrast(103%);
    }
  }
  &__item {
    @include for-mobile {
      margin: var(--spacer-lg) 0 var(--spacer-2xs);
    }
    display: flex;
    align-items: center;
    padding: 0 var(--spacer-2xs);
    margin: var(--spacer-xl) 0 var(--spacer-sm);
    &:last-child {
      padding: 0 0.75rem;
    }
    p {
      margin: 0;
      font-size: var(--font-xl);
      font-weight: var(--font-semibold);
      @include for-mobile {
        font-size: var(--font-lg);
      }
    }
    span {
      @include for-desktop {
        margin: var(--spacer-2xs) 2px 0;
      }
      display: block;
      color: var(--c-gray-lighten);
      font-family: var(--font-family-secondary);
      font-size: var(--font-base);
      @include for-mobile {
        font-size: var(--font-xs)
      }
    }
  }
}
.location {
  display: flex;
  align-items: center;
  &__icon {
    @include for-mobile {
      width: 1.75rem;
      height: 1.75rem
    }
    width: 2.5rem;
    height: 2.5rem;
    position: relative;
    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      filter: invert(63%) sepia(12%) saturate(5000%) hue-rotate(321deg) brightness(97%) contrast(103%);
    }
  }
  p {
    @include for-mobile {
      font-size: 1.5rem;
    }
    font-size: 2rem;
    font-weight: var(--font-semibold);
    margin: 0 0 0 var(--spacer-xs);
    color: var(--c-primary);
  }
  &__symbol {
    @include for-mobile {
      width: 4rem;
      height: 4rem;
    }
    position: relative;
    width: 5.5rem;
    height: 5.5rem;
    background: var(--c-primary);
    border-radius: 16px;
    margin: var(--spacer-2xs) var(--spacer-xs) 0;
    img {
      position: absolute;
      width: 60%;
      height: 60%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      filter: invert(1);
    }
  }
}
.logs {
  &__item {
    @include for-mobile {
      padding: .65rem var(--spacer-sm);
      width: calc(100% - 2rem);
    }
    display: flex;
    align-items: center;
    width: calc(100% - 10rem);
    justify-content: space-between;
    padding: 0.65rem var(--spacer-2xl);
    background: rgba(0,0,0,.05);
    margin: var(--spacer-2xs) 0;
    border-radius: 6px;
    p {
      margin: 0;
    }
    &--in {
      display: flex;
      width: 10rem;
      align-items: center;
      &-image {
        width: 1rem;
        height: 1rem;
        padding: var(--spacer-2xs);
        background: #376e37;
        border-radius: 50%;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: invert(1);
        }
      }
      p {
        width: 7rem;
        text-align: right;
      }
    }
    &--out {
      display: flex;
      width: 10rem;
      align-items: center;
      justify-content: flex-end;
      &-image {
        width: 1rem;
        height: 1rem;
        padding: var(--spacer-2xs);
        background: #82322f;
        border-radius: 50%;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: invert(1);
        }
      }
      p {
        width: 7rem;
        text-align: right;
      }
    }
  }
}
.qrMessage {
  text-align: center;
  margin: var(--spacer-sm) 0 0;
}
.headingTitle {
  text-align: center;
  background: var(--c-primary);
  color: var(--c-white);
  padding: var(--spacer-sm);
  font-size: var(--font-xl);
  margin-top: 0;
  border-radius: 16px;
}
.adminButton {
  width: 100%;
  height: 3rem;
  background: var(--c-text);
  color: var(--c-white);
  outline: none;
  border: none;
  border-radius: 8px;
  margin: var(--spacer-sm) 0 0;
  text-transform: uppercase;
  font-weight: var(--font-semibold);
  font-size: var(--font-sm);
  font-family: var(--font-family-secondary);
}
</style>
