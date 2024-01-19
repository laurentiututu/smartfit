<template>
  <div class="equipments">
    <h1 class="headingTitle">Equipment</h1>
    <m-product-card
      v-for="(equipment, i) in equipments"
      :key="i"
      :item="equipment"
      itemType="equipment"
      class="equipment"
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
    await this.fetchEquipments()
  },
  computed: {
    ...mapGetters({
      equipments: 'getEquipments'
    })
  },
  methods: {
    ...mapActions({
      fetchEquipments: 'fetchEquipments'
    })
  }
}
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.equipments {
  margin: var(--spacer-lg) var(--spacer-2xl);
  @include for-mobile {
    margin: var(--spacer-sm) var(--spacer-sm) 6rem;
  }
}
.equipment {
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