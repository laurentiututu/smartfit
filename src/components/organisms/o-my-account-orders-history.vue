<template>
  <div class="o-my-account-orders-history">
    <div v-if="!orders.length" class="message">
      You have no orders.
    </div>
    <template v-else>
  	  <MOrderDetails v-for="(order, i) in orders" :key="i" :order="order" />
    </template>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import MOrderDetails from '@/components/molecules/m-order-details.vue'

export default {
  components: {
  	MOrderDetails
  },
  async mounted () {
  	await this.fetchUserOrders()
  },
  computed: {
  	...mapGetters({
  	  orders: 'getUserOrders'
  	})
  },
  methods: {
  	...mapActions({
  	  fetchUserOrders: 'fetchUserOrders'
  	})
  }
}
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.message {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: calc(100% - 29rem);
  font-weight: var(--font-bold);
  font-size: var(--font-lg);
  @include for-mobile {
    width: 100%;
    height: calc(100% - 110px - 52px);
  }
}
</style>