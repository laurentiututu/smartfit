<template>
  <div class="o-admin-dashboard">
  	<div class="data__basic">
  		<div class="data__minimal">
  			<div class="data__minimal--text">
	  			<p>{{ `${getGymPopulation} athletes` }}</p>
	  			<span>Activity</span>
	  		</div>
	  		<div class="data__minimal--icon">
	  			<img src="@/assets/icons/gym.png">
	  		</div>
  		</div>
  		<div class="data__minimal">
  			<div class="data__minimal--text">
	  			<p>{{ `${getOrdersCounter} pending` }}</p>
	  			<span>Orders</span>
	  		</div>
	  		<div class="data__minimal--icon">
	  			<img src="@/assets/icons/file.png">
	  		</div>
  		</div>
  		<div class="data__minimal">
  			<div class="data__minimal--text">
	  			<p>{{ `${getEmployeesCounter} employees` }}</p>
	  			<span>Staff</span>
	  		</div>
	  		<div class="data__minimal--icon">
	  			<img src="@/assets/icons/group.png">
	  		</div>
  		</div>
  	</div>
  	<div class="data__basic">
  		<div class="data__basic--container">
				<apexchart
					:key="dataLoader"
					type="area"
					height="250"
					:options="chart1Options"
					:series="athletesAmount"
				/>
  		</div>
  		<div class="data__basic--container">
  			<apexchart
					:key="dataLoader"
					type="area"
					height="250"
					:options="chart2Options"
					:series="averageTime"
				/>
  		</div>
  	</div>
  	<div class="data__basic--container data__basic--container-full-width">
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
</template>
<script>
import VueApexCharts from 'vue-apexcharts'
import { mapGetters, mapActions } from 'vuex'

export default {
	components: {
    apexchart: VueApexCharts,
  },
  data () {
	  return {
	  	dataLoader: 0,
	    athletesAmount: [{
	      name: "Athletes",
	      data: []
	    }],
	    averageTime: [{
	      name: "Hours",
	      data: []
	    }],
	    chart1Options: {
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
	        text: 'Athletes in Gym last week',
	        align: 'left'
	      },
	      labels: [],
	      xaxis: {
	        type: 'datetime',
	      },
	      yaxis: {
	        opposite: false
	      },
	      legend: {
	        horizontalAlign: 'left'
	      },
	      colors: ['#FA735A']
	    },
	    chart2Options: {
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
	        text: 'Time in Gym last week',
	        align: 'left'
	      },
	      labels: [],
	      xaxis: {
	        type: 'datetime',
	      },
	      yaxis: {
	        opposite: false
	      },
	      legend: {
	        horizontalAlign: 'left'
	      },
	      colors: ['#FA735A']
	    }
	  }
	},
	async mounted () {
		await this.fetchAnalyticsAdmin()
		await this.fetchAnalyticsPublic()
		await this.fetchDashboard()
		await this.fetchWeather()
	},
	watch: {
		getTotalPeople () {
			this.athletesAmount[0].data = this.getTotalPeople
			this.averageTime[0].data = this.getAvgTime
			this.chart1Options.labels = this.getDates
			this.chart2Options.labels = this.getDates
			this.dataLoader++
		}
	},
	computed: {
		...mapGetters({
			getAnalytics: 'getAnalyticsAdmin',
			getTotalPeople: 'getTotalPeople',
			getAvgTime: 'getAvgTime',
			getDates: 'getDates',
			getGymPopulation: 'getGymPopulation',
			getEmployeesCounter: 'getEmployeesCounter',
			getOrdersCounter: 'getOrdersCounter',
			getWeather: 'getWeather'
		})
	},
	methods: {
		...mapActions({
			fetchAnalyticsAdmin: 'fetchAnalyticsAdmin',
			fetchAnalyticsPublic: 'fetchAnalyticsPublic',
			fetchDashboard: 'fetchDashboard',
			fetchWeather: 'fetchWeather'
		}),
		formatDate (date) {
      let ms = Date.parse(date)

      return new Date(ms).toLocaleString('ro-ro', { day: 'numeric', month: 'numeric', year: 'numeric' })
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
    }
	}
}
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.o-admin-dashboard {
  padding: 0 var(--spacer-xl);
  @include for-mobile {
  	padding: 0 var(--spacer-sm);
  }

  .data {
  	&__basic {
  		@include for-desktop {
	  		display: flex;
	  		justify-content: space-between;
	  		margin-bottom: var(--spacer-base);
  		}

  		&--container {
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
</style>