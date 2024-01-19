<template>
  <div class="cart">
  	<div v-if="!products.length" class="message">
      You have no subscriptions in cart.
    </div>
    <template v-else>
	    <h1 class="headingTitle">Checkout</h1>
	  	<div class="collected-products">
	  	  <m-product-card
	        v-for="(subscription, i) in products"
	        :key="i"
	        :item="subscription.details"
	        :qty="subscription.qty"
	        :total="subscription.price"
	        :collected="true"
	        itemType="subscription"
	        class="subscription"
	      />
	  	</div>
	  	<div class="bottom-info">
		  <div class="totals">
		  	<div class="totals__price">
		  	  <span class="totals__price--title">Products:</span>
		  	  <span class="totals__price--value">{{`${prices.products} lei`}}</span>
		  	</div>
		  	<template v-if="prices.discounts > 0">	
		  	  <div v-for="(discount, i) in discounts" :key="i" class="totals__price">
		  	    <span class="totals__price--title">
		  	      <b class="removeDiscount" @click="deleteDiscount(discount.details.id)">X</b>
		  	  	  {{discount.details.name}}
		  	  	</span>
		  	    <span class="totals__price--value">{{`-${discount.reduction} lei`}}</span>
		  	  </div>
		  	</template>
		  	<div class="totals__price">
		  	  <span class="totals__price--title">Grand Total:</span>
		  	  <span class="totals__price--value">{{`${prices.total} lei`}}</span>
		  	</div>
		  </div>
		  <div class="actions">
		    <div class="actions__discounts">
		      <input v-model="discount_code" type="text" name="discount" placeholder="Got a coupon? Enter it here.">
		      <button class="discountBtn" @click="applyCoupon()">Apply</button>
		    </div>
		    <div class="editForm__field editForm__boolean">
	    	  <span
	    	  	:class="paymentMethod == 'cash' ? 'boolean__selected' : 'boolean'"
	    	  	@click="paymentMethod = 'cash'"
	    	  >
	    	  	Cash on delivery
	    	  </span>
	    	  <span
	    	  	:class="paymentMethod == 'stripe' ? 'boolean__selected' : 'boolean'"
	    	  	@click="paymentMethod = 'stripe'"
	    	  >
	    	  	Credit card
	    	  </span>
	        </div>
		    <button class="placeOrder" @click="placeOrder(paymentMethod)">Place Order</button>
		  </div>
		</div>
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
  data () {
  	return {
  	  discount_code: '',
  	  paymentMethod: 'cash'
  	}
  },
  async mounted () {
  	await this.fetchCart()
  },
  computed: {
  	...mapGetters({
  	  products: 'getCartProducts',
  	  discounts: 'getCartDiscounts',
  	  prices: 'getCartPrices'
  	})
  },
  methods: {
  	...mapActions({
  	  fetchCart: 'fetchCart',
  	  addDiscount: 'addCartDiscount',
  	  deleteDiscount: 'deleteCartDiscount',
  	  placeOrder: 'placeOrder'
  	}),
  	applyCoupon () {
  	  this.addDiscount(this.discount_code)
  	  this.discount_code = ''
  	}
  }
}
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.cart {
  padding: var(--spacer-lg) var(--spacer-2xl);
  @include for-desktop {
  	height: calc(100vh - 80px - 4rem);
  }
  @include for-mobile {
  	padding: var(--spacer-sm) var(--spacer-sm) 6rem;
  	height: calc(100vh - 51px - 2rem);
  }
}
.subscription {
  margin: var(--spacer-xs);
}
.bottom-info {
  background: var(--c-light);
  margin: var(--spacer-xs);
  border-radius: 12px;
  padding: var(--spacer-sm);
}
.actions {
  .placeOrder {
  	width: 100%;
    height: 3rem;
    outline: 0;
    border: 0;
    background: var(--c-black);
    color: var(--c-white);
    text-transform: uppercase;
    font-weight: var(--font-bold);
    font-size: var(--font-sm);
    border-radius: 8px;
    cursor: pointer;
    transition: .3s;
    &:hover {
      background: rgba(0,0,0,.75);
    }
  }
  &__discounts {
  	margin: var(--spacer-sm) 0;
  	input {
  	  outline: 0;
      border: 0;
      border-radius: 6px;
      height: 2rem;
      width: 80%;
      padding: var(--spacer-2xs) var(--spacer-xs);
      @include for-mobile {
      	width: 65%;
      }
  	}
  	.discountBtn {
	  @include for-mobile {
	  	width: calc(45% - 3.5rem);
	  	margin-left: var(--spacer-xs);
	  }
	  width: calc(20% - 2rem);
	  margin-left: var(--spacer-sm);
	  outline: 0;
	  border: 0;
	  background: var(--c-primary);
	  color: var(--c-white);
	  text-transform: uppercase;
	  border-radius: 6px;
	  transition: .3s;
	  height: 2.45rem;
	  cursor: pointer;
	  &:hover {
	  	background: var(--c-primary-darken);
	  }
  	}
  }
}
.totals {
  margin-bottom: var(--spacer-lg);
  &__price {
  	display: flex;
    justify-content: space-between;
    border-bottom: 1px solid var(--c-light-darken);
    padding: var(--spacer-xs) 0;
    &--value {
      font-weight: var(--font-semibold);
    }
  }
}
.removeDiscount {
  margin-right: var(--spacer-xs);
  cursor: pointer;
  &:hover {
  	color: var(--c-gray-lighten);
  }
}
.editForm {
  &__boolean {
    display: flex;
    padding: 0 !important;
    flex: 1 1 calc(50% + var(--spacer-lg)) !important;
    span {
  	width: 50%;
      display: block;
      text-align: center;
      border-radius: 10px 0 0 10px;
      padding: var(--spacer-sm);
      color: var(--c-white);
      cursor: pointer;
      transition: .3s;
      &:nth-child(2) {
      	border-radius: 0 10px 10px 0;
      }
      @include for-mobile {
      	padding: var(--spacer-xs);
      }
    }
  }
  &__field {
    width: 100%;
    background: transparent;
    border: 1px solid var(--c-primary);
    border-radius: 12px;
    padding: var(--spacer-sm);
    font-size: var(--font-sm);
    font-family: var(--font-family-secondary);
    margin: var(--spacer-2xs) 0 var(--spacer-base);
  }
}
.boolean {
  background: rgba(250, 115, 90, .15);
  color: var(--c-primary) !important;
  &__selected {
  	background: var(--c-primary);
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
</style>