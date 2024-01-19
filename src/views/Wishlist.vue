<template>
  <div class="subscriptions">
    <div v-if="!subscriptions.length" class="message">
      You have no subscriptions marked as favorites.
    </div>
    <template v-else>
      <h1 class="headingTitle">Wishlist</h1>
    	<m-product-card
    	  v-for="(subscription, i) in subscriptions"
    	  :key="i"
    	  :item="subscription"
    	  :cart="true"
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
  	await this.fetchSubscriptionsFavourite()
  },
  computed: {
  	...mapGetters({
  	  subscriptions: 'getSubscriptionsFavourite'
  	})
  },
  methods: {
  	...mapActions({
  	  fetchSubscriptionsFavourite: 'fetchSubscriptionsFavourite'
  	})
  }
}
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.subscriptions {
  margin: var(--spacer-lg) var(--spacer-2xl);
  @include for-mobile {
    margin: var(--spacer-sm) var(--spacer-sm) 6rem;
  }
}
.subscription {
  margin: var(--spacer-xs);
}
.message {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: calc(100% - 10rem);
  height: calc(100% - 4rem - 80px);
  font-weight: var(--font-bold);
  font-size: var(--font-lg);
  @include for-mobile {
    width: calc(100% - 2rem);
    height: calc(100% - 2rem - 52px);
  }
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
</style>