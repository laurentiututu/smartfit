<template>
  <div class="o-my-account-subscriptions">
    <div v-if="!subscriptions.length" class="message">
      You have no subscriptions.
    </div>
    <template v-else>
    	<m-product-card
    	  v-for="(subscription, i) in subscriptions"
    	  :key="i"
    	  :item="subscription"
    	  :status="true"
    	  itemType="subscription"
    	  class="subscription"
    	/>
    </template>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import MProductCard from '@/components/molecules/m-product-card'

export default {
  components: {
  	MProductCard
  },
  async mounted () {
  	await this.fetchSubscriptions()
  },
  computed: {
  	...mapGetters({
  	  subscriptions: 'getUserSubscriptions'
  	})
  },
  methods: {
  	...mapActions({
  	  fetchSubscriptions: 'fetchUserSubscriptions'
  	})
  }
}
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.o-my-account-subscriptions {
  
}
.subscription {
  &:not(:first-child) {
  	margin: var(--spacer-xs) 0;
  }
}
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
