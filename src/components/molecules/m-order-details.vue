<template>
  <div class="m-order-details">
  	<div class="order__section">
  	  <p class="order__section--title">Reference:</p>
  	  <p class="order__data">{{ order.reference }}</p>
  	</div>
  	<div class="order__section">
  	  <p class="order__section--title">Placed:</p>
  	  <p class="order__data">{{ formatDate(order.createdAt) }}</p>
  	</div>
  	<div class="order__section">
  	  <p class="order__section--title">Payment method:</p>
  	  <p class="order__data">{{ order.payment_method }}</p>
  	</div>
  	<div class="order__section">
  	  <p class="order__section--title">Status:</p>
  	  <p
  	  	class="order__data order__data--status"
        :class="{
          'order__data--status-paid': order.status == 'paid',
          'order__data--status-cancelled': order.status == 'cancelled',
          'order__data--status-pending': order.status == 'pending'
        }"
  	  >
  		{{order.status}}
  	  </p>
  	</div>
  	<div class="order__section">
  	  <p class="order__section--title">Total:</p>
  	  <p class="order__data">
        {{ order.total + ' lei' }}
        <span
          v-if="order.total_discounts"
          class="order__data--discount"
        >
          {{ `-${order.total_discounts} lei`}}
        </span>
      </p>
  	</div>
  </div>
</template>
<script>

export default {
  props: {
  	order: {
  	  type: Object,
  	  default: () => ({})
  	}
  },
  methods: {
  	formatDate (date) {
      let ms = Date.parse(date)
      return new Date(ms).toLocaleString('ro-ro', { day: 'numeric', month: 'numeric', year: 'numeric' })
    },
  }
}	
</script>
<style lang="scss" scoped>
  .m-order-details {
  	display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    background: var(--c-light);
    margin: var(--spacer-2xs) 0;
    padding: var(--spacer-xs) var(--spacer-sm);
    border-radius: 6px;
  }
  .order {
  	&__section {
  	  min-width: 6rem;
  	  &--title {
  	  	font-size: var(--font-2xs);
    	margin: 0 0 var(--spacer-2xs);
  	  }
  	}
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
	  	padding: var(--spacer-2xs) var(--spacer-xs);
	  	border-radius: 40px;
	  	font-size: var(--font-xs);
	  	text-transform: capitalize;
	  	text-align: center;
	    &-paid {
	      background: rgba(92, 184, 92, .75);
	      color: #376e37;
	    }
	    &-cancelled {
	      background: rgba(217, 83, 79, .75);
	      color: #82322f;
	    }
	    &-pending {
	      background: rgba(240, 173, 78, .75);
	      color: #90682f;
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