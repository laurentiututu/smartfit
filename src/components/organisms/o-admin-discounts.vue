<template>
  <div v-if="!edit" class="o-admin-discounts">
  	<m-discount-card type="template" @add-discount="editDiscountForm"/>
		<m-discount-card
			v-for="(discount, i) in discounts"
			:key="i"
			:discount="discount"
			@edit-discount="editDiscountForm"
			@delete-discount="deleteActiveDiscount"
		/>
  </div>	
	<div v-else class="editForm">
		<input
			v-model="discount.name"
			type="text"
			placeholder="Name"
			class="editForm__field editForm__field--input"
		/>
		<input
			v-model="discount.code"
			type="text"
			placeholder="Code"
			class="editForm__field editForm__field--input"
		/>
    <div class="editForm__container editForm__container--wrap">
      <input
				v-model="discount.qtyTotal"
				type="number"
				placeholder="Uses"
				class="editForm__field editForm__field--input editForm__field--half"
			/>
			<input
				v-model="discount.qtyCustomer"
				type="number"
				placeholder="Customer limit"
				class="editForm__field editForm__field--input editForm__field--half"
			/>
		</div>
		<div class="editForm__container editForm__container--wrap">
      <div class="editForm__field editForm__boolean editForm__field--half">
      	<span
      		:class="discount.type == 'amount' ? 'boolean__selected' : 'boolean'"
      		@click="discount.type = 'amount'"
      	>
      		Amount (lei)
      	</span>
      	<span
      		:class="discount.type == 'percent' ? 'boolean__selected' : 'boolean'"
      		@click="discount.type = 'percent'"
      	>
      		Percent (%)
      	</span>
      </div>
			<input
				v-model="discount.value"
				type="number"
				placeholder="Value"
				class="editForm__field editForm__field--input editForm__field--half"
			/>
		</div>
		<input
			v-model="discount.minimumCartTotal"
			type="number"
			placeholder="Minimum Buy"
			class="editForm__field editForm__field--input"
		/>
		<div class="editForm__container editForm__container--wrap">
      <input
				v-model="discount.validFrom"
				type="date"
				placeholder="Valid since"
				class="editForm__field editForm__field--input editForm__field--half"
			/>
			<input
				v-model="discount.validTo"
				type="date"
				:min="discount.validFrom"
				placeholder="Valid until"
				class="editForm__field editForm__field--input editForm__field--half"
			/>
		</div>
		<div class="editForm__container">
    	<SfButton class="editForm__button--submit" @click="submitDiscount()">Submit</SfButton>
    	<SfButton class="editForm__button--cancel" @click="editDiscountForm()">Cancel</SfButton>
		</div>
	</div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import MDiscountCard from '@/components/molecules/m-discount-card'
import { SfButton } from '@storefront-ui/vue'

export default {
	components: {
		MDiscountCard,
		SfButton
	},
	data () {
		return {
			edit: false,
			discount: {
				id: '',
				name: '',
				code: '',
				qtyTotal: '',
				qtyCustomer: '',
				type: 'amount',
				value: '',
				minimumCartTotal: '',
				validFrom: '',
				validTo: ''
			}
		}
	},
	async mounted () {
		await this.fetchDiscounts()
	},
	computed: {
		...mapGetters({
			getDiscounts: 'getDiscounts'
		}),
		discounts () {
			let discounts = []
			this.getDiscounts.forEach(discount => {
				if (discount.active) {
					discounts.push(discount)
				}
			})
			console.log(this.getDiscounts)
			return discounts
		}
	},
	methods: {
		...mapActions({
			fetchDiscounts: 'fetchDiscounts',
			addDiscount: 'addDiscount',
			deleteDiscount: 'deleteDiscount',
			editDiscount: 'editDiscount'
		}),
		formatDate (date) {
      let ms = Date.parse(date)
      let newDate = new Date(ms)

    	const year = newDate.getFullYear();
		 	const month = String(newDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
		  const day = String(newDate.getDate()).padStart(2, '0');

		  return `${year}-${month}-${day}`;
    },
		editDiscountForm (id) {
			this.edit = !this.edit
			if (id) {
				const discount = this.getDiscounts.find(item => item.id == id)

				this.discount.id = discount.id
				this.discount.name = discount.name,
				this.discount.code = discount.code,
				this.discount.qtyTotal = discount.qtyTotal,
				this.discount.qtyCustomer = discount.qtyCustomer,
				this.discount.type = discount.type,
				this.discount.value = discount.value,
				this.discount.minimumCartTotal = discount.minimumCartTotal,
				this.discount.validFrom = this.formatDate(discount.validFrom),
				this.discount.validTo = this.formatDate(discount.validTo)
			} else {
				this.discount.id = '',
				this.discount.name = '',
				this.discount.code = '',
				this.discount.qtyTotal = '',
				this.discount.qtyCustomer = '',
				this.discount.type = 'amount',
				this.discount.value = '',
				this.discount.minimumCartTotal = '',
				this.discount.validFrom = '',
				this.discount.validTo = ''
			}
			console.log(this.discount)
		},
		submitDiscount () {
			let data = { ...this.discount }
			delete data.id
			if (this.discount.id) {
				this.editDiscount({id: this.discount.id, data: data})
			} else {
				this.addDiscount(data)
			}
			this.edit = !this.edit
		},
		deleteActiveDiscount (id) {
  		if (confirm('You\'re about to delete a discount!')) {
  			this.deleteDiscount(id)
  		} else {
  			return
  		}
  	},
	}
}
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.o-admin-discounts {
	display: flex;
	flex-wrap: wrap;
	padding: 0 var(--spacer-lg);
	@include for-mobile {
		padding: 0 var(--spacer-sm);
	}
}
.editForm {
	@include for-desktop {
		padding-left: var(--spacer-lg);
	}
	@include for-mobile {
		padding: 0 var(--spacer-sm);
	}
	&__container {
		display: flex;
		&--wrap {
			padding: var(--spacer-2xs) 0;
		}
	}
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
		width: calc(100% - var(--spacer-lg) - 2px);
	  background: transparent;
	  border: 1px solid var(--c-primary);
	  border-radius: 12px;
	  padding: var(--spacer-sm);
	  font-size: var(--font-sm);
	  font-family: var(--font-family-secondary);
	  margin: var(--spacer-2xs) 0;
		&--input {
			height: 1rem;
		}
		&--textarea {
			height: 6rem;
	    resize: none;
		}
		&--half {
			flex: 1 1 50%;
			margin: 0 var(--spacer-2xs);
			&:first-child {
				margin-left: 0;
			}
			&:last-child {
				margin-right: 0;
			}
		}
	}
	&__selectable {
		margin: var(--spacer-2xs) var(--spacer-2xs) var(--spacer-xs);
    background: var(--c-primary-lighten);
    color: var(--c-white);
    padding: var(--spacer-xs);
    font-size: var(--font-sm);
    font-weight: var(--font-semibold);
    border-radius: 8px;
		cursor: pointer;
		&--active {
			background: var(--c-primary-darken);
		}
		&:first-child {
			margin-left: 0;
		}
		&:last-child {
			margin-right: 0;
		}
		&:hover {
			background: var(--c-primary-darken);
		}
	}
	&__button {
		&--submit {
			--button-font-size: var(--font-sm);
			--button-border-radius: 12px;
			flex: 1 1 80%;
			margin-right: var(--spacer-2xs);
			margin-top: var(--spacer-xs);
		}
		&--cancel {
			--button-font-size: var(--font-sm);
			--button-background: rgba(209, 39, 39, .1);
			--button-border: solid;
			--button-border-color: var(--c-danger);
			--button-border-width: 1px;
			--button-color: var(--c-danger);
			--button-border-radius: 12px;	
			flex: 1 1 20%;
			margin-left: var(--spacer-2xs);
			margin-top: var(--spacer-xs);
		}
	}
}
.boolean {
	background: rgba(250, 115, 90, .15);
	color: var(--c-primary) !important;
	&__selected {
		background: var(--c-primary);
	}
}
</style>