<template>
  <div class="subscriptions">
    <h1 class="headingTitle">Subscriptions</h1>
  	<m-product-card
	    v-for="(subscription, i) in subscriptions"
	    :key="i"
	    :item="subscription"
	    :cart="true"
	    itemType="subscription"
	    class="subscription"
	  />
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
  	  subscriptions: 'getSubscriptions'
  	})
  },
  methods: {
  	...mapActions({
  	  fetchSubscriptions: 'fetchSubscriptions'
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