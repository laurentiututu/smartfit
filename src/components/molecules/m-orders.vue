<template>
  <div class="m-order-card">
    <SfTable class="orders__table">
      <SfTableHeading>
        <SfTableHeader v-for="(header, i) in headers" :key="i">{{ header }}</SfTableHeader>
      </SfTableHeading>
      <SfTableRow v-for="(order, i) in orders" :key="i">
        <SfTableData>
          <p class="order__data">{{ order.reference }}</p>
        </SfTableData>
        <SfTableData>
          <p class="order__data">{{ formatDate(order.createdAt) }}</p>
          <!-- <span class="order__data--span">{{ formatTime(order.createdAt) }}</span> -->
        </SfTableData>
        <SfTableData>
          <p class="order__data order__data--customer">{{ order.user.name }}</p>
        </SfTableData>
        <SfTableData>
          <p class="order__data">
            {{ order.total + ' lei' }}
            <span
              v-if="order.total_discounts"
              class="order__data--discount"
            >
              {{ `-${order.total_discounts} lei`}}
            </span>
          </p>
        </SfTableData>
        <SfTableData>
          <SfSelect
            v-model="order.status"
            class="order__data--status"
            :class="{
              'order__data--status-paid': order.status == 'paid',
              'order__data--status-cancelled': order.status == 'cancelled',
              'order__data--status-pending': order.status == 'pending'
            }"
            name="countries"
            @change="updateStatus(order._id, order.status)"
          >
            <SfSelectOption class="pendingOption" value="pending">
              Pending
            </SfSelectOption>
            <SfSelectOption class="paidOption" value="paid">
              {{ `Paid (${order.payment_method})` }}
            </SfSelectOption>
            <SfSelectOption class="cancelledOption" value="cancelled">
              Cancelled
            </SfSelectOption>
          </SfSelect>
          <!-- <p class="order__data order__data--customer">{{ order.status }}</p> -->
        </SfTableData>
      </SfTableRow>
    </SfTable>
  </div>
</template>
<script>
import config from '../../store/resources/endpoints/subscriptions.json'
import { mapActions } from 'vuex'
import { SfTable, SfSelect } from '@storefront-ui/vue'

export default {
  components: {
    SfTable,
    SfSelect
  },
  props: {
  	orders: {
  	  type: Array,
  	  default: () => ({})
  	}
  },
  data () {
    return {
      headers: ['Reference', 'Created', 'Customer', 'Total', 'Status']
    }
  },
  methods: {
    ...mapActions({
      updateOrder: 'updateOrder'
    }),
  	getUrl (name) {
  		return config.api + name
  	},
    formatDate (date) {
      let ms = Date.parse(date)

      return new Date(ms).toLocaleString('ro-ro', { day: 'numeric', month: 'numeric', year: 'numeric' })
    },
    formatTime (date) {
      let ms = Date.parse(date)

      let hours = new Date(ms).getHours();
      let minutes = new Date(ms).getMinutes();
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
    },
    updateStatus (id, status) {
      console.log(id, status)
      let data = {id: id, action: status}
      this.updateOrder(data)
    }
  }
}
</script>
<style lang="scss" scoped>
.m-order-card {
  .orders {
    &__table {
      --table-border-width: 0 0 2px 0;
      --table-heading-padding: var(--spacer-2xs) 0;
      --table-header-font-size: var(--font-xs);
      --table-row-padding: var(--spacer-sm) 0;
      --table-data-color: var(--c-text);
    }
  }
  .order {
    &__data {
      margin: 0;
      font-size: var(--font-sm);
      line-height: 1;
      &--span {
        font-size: var(--font-xs);
        color: var(--c-gray-lighten);
      }
      &--customer {
        text-transform: capitalize;
      }
      &--discount {
        background: var(--c-text);
        color: var(--c-white);
        padding: 0.15rem 0.45rem;
        font-size: var(--font-2xs);
        border-radius: 20px;
      }
      &--status {
        --select-padding: 0;
        --select-selected-padding: var(--spacer-2xs) var(--spacer-sm);
        --select-height: 1rem;
        --select-option-font-weight: var(--font-medium);
        &-paid {
          --select-background: rgba(92, 184, 92, .75);
          --select-color: #376e37;
        }
        &-cancelled {
          --select-background: rgba(217, 83, 79, .75);
          --select-color: #82322f;
        }
        &-pending {
          --select-background: rgba(240, 173, 78, .75);
          --select-color: #90682f;
        }
        // transform: translateY(-.25rem);
        &::v-deep .sf-select__selected {
          --select-option-padding: var(--spacer-2xs) var(--spacer-xs);
          --select-option-font-size: var(--font-sm) !important;
          --product-option-font-size: var(--font-sm) !important;
          --select-option-font-size: var(--font-sm) !important;
          --select-margin: 0;
          border-radius: 20px;
          transform: translateY(-.25rem);
        }
      }
    }
  }
}
.cancelledOption {
  --select-option-background: rgba(217, 83, 79, .75);
  color: #82322f;
  font-weight: var(--font-medium);
}
.paidOption {
  --select-option-background: rgba(92, 184, 92, .75);
  color: #376e37;
  font-weight: var(--font-medium);
}
.pendingOption {
  --select-option-background: rgba(240, 173, 78, .75);
  color: #90682f;
  font-weight: var(--font-medium);
}
</style>