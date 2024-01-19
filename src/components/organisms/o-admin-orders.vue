<template>
  <div class="o-admin-orders">
		<m-orders :orders="getOrders" />
  </div>	
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import MOrders from '../molecules/m-orders.vue'

export default {
	components: {
		MOrders
	},
	async mounted () {
		await this.fetchOrders()
	},
	computed: {
		...mapGetters({
			getOrders: 'getOrders'
		})
	},
	methods: {
		...mapActions({
			fetchOrders: 'fetchOrders'
		})
	}
}
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.o-admin-orders {
	@include for-mobile {
		padding: 0 var(--spacer-sm);
	}
	padding: 0 var(--spacer-xl);
}
</style>