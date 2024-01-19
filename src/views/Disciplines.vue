<template>
  <div class="disciplines">
    <h1 class="headingTitle">Disciplines</h1>
  	<m-product-card
  	  v-for="(discipline, i) in disciplines"
  	  :key="i"
  	  :item="discipline"
  	  itemType="discipline"
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
  	await this.fetchDisciplines()
  },
  computed: {
  	...mapGetters({
  	  disciplines: 'getDisciplines'
  	})
  },
  methods: {
  	...mapActions({
  	  fetchDisciplines: 'fetchDisciplines'
  	})
  }
}
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.disciplines {
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