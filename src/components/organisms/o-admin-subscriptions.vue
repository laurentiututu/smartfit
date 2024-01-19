<template>
  <div class="o-admin-subscriptions">
  	<template v-if="!editSubscription">
	  	<m-product-card @add="editForm({action: 'add'})" itemType="template" name="Add Subscription" />
			<m-product-card
				v-for="(subscription, i) in getSubscriptions"
				:key="i"
				:item="subscription"
				:editBtn="true"
				itemType="subscription"
				class="subscription"
				@edit="editForm({subscription: subscription, action: 'edit'})"
				@delete="deleteForm(subscription._id)"
			/>
		</template>
		<template v-else>
			<div class="editForm">
				<input
					v-model="subscription.name"
					type="text"
					placeholder="Name"
					class="editForm__field editForm__field--input"
				/>
        <textarea
        	v-model="subscription.description"
        	type="text"
        	placeholder="Description"
        	class="editForm__field editForm__field--textarea"
        />
        <div class="editForm__container" :key="disciplinesChanged">
        	<div
        		v-for="(discipline, i) in disciplines"
        		:key="i"
        		class="editForm__selectable"
        		:class="{'editForm__selectable--active': discipline.selected}"
        		@click="toggleDiscipline(discipline)"
        	>
        		{{discipline.name}}
        	</div>
        </div>
        <div class="editForm__container editForm__container--wrap">
	        <input
						v-model="subscription.duration"
						type="number"
						placeholder="Duration"
						class="editForm__field editForm__field--input editForm__field--half"
					/>
					<input
						v-model="subscription.price"
						type="number"
						placeholder="Price"
						class="editForm__field editForm__field--input editForm__field--half"
					/>
				</div>
				<SfButton class="sf-button--full-width imageBtn" @click="$refs.newImage.click()">Add Image</SfButton>
        <input class="hidden" type="file" name="newImage" ref="newImage" @change="changeImage">
				<m-product-card class="previewCard" :item="subscription" :key="subscriptionReloader" itemType="subscription" />
				<div class="editForm__container">
        	<SfButton class="editForm__button--submit" @click="sendData()">Submit</SfButton>
        	<SfButton class="editForm__button--cancel" @click="editForm({subscription: undefined, action: ''})">Cancel</SfButton>
				</div>
			</div>
		</template>
  </div>	
</template>
<script>
import MProductCard from '@/components/molecules/m-product-card'
import { mapGetters, mapActions } from 'vuex'
import { SfButton } from '@storefront-ui/vue'
import FormData from 'form-data'

export default {
	components: {
		MProductCard,
		SfButton
	},
	data () {
		return {
			editSubscription: false,
			disciplinesChanged: 0,
			subscriptionReloader: 0,
			disciplines: [],
			subscription: {
				id: '',
				name: '',
				description: '',
				duration: '',
				disciplines: [],
				price: '',
				pictures: []
			},
			imageToAdd: '',
			actionType: ''
		}
	},
	async mounted () {
    await this.fetchSubscriptions()
    await this.fetchDisciplines()
    await this.formatDisciplines()
  },
  watch: {
  	getDisciplines() {
  		this.formatDisciplines()
  	},
  	subscription: {
  		handler() {	
  			this.subscriptionReloader++
  		},
  		deep: true
  	}
  },
  computed: {
    ...mapGetters({
      getSubscriptions: 'getSubscriptions',
      getDisciplines: 'getDisciplines'
    })
  },
  methods: {
  	...mapActions({
  		fetchSubscriptions: 'fetchSubscriptions',
  		fetchDisciplines: 'fetchDisciplines',
  		newSubscription: 'addSubscription',
  		editCurrentSubscription: 'editSubscription',
  		deleteSubscription: 'deleteSubscription'
  	}),
  	editForm ({subscription, action}) {
  		this.actionType = action
  		this.disciplines.forEach(discipline => discipline.selected = false)
  		if (subscription) {
  			this.subscription.id = subscription._id
  			this.subscription.name = subscription.name
  			this.subscription.description = subscription.description
  			this.subscription.duration = subscription.duration
  			this.subscription.price = subscription.price
  			this.subscription.pictures = subscription.pictures
  			this.subscription.imagePreview = ''
  			subscription.disciplines.forEach(discipline => {
  				let index = this.disciplines.findIndex(item => discipline._id == item.id)
  				this.disciplines[index].selected = true
  				this.subscription.disciplines.push(this.disciplines[index])
  			})
  		} else {
  			this.subscription.id = ''
  			this.subscription.name = ''
  			this.subscription.description = ''
  			this.subscription.duration = ''
  			this.subscription.disciplines = []
  			this.subscription.pictures = []
  			this.subscription.price = ''
  			this.subscription.imagePreview = ''
  		}
  		this.editSubscription = !this.editSubscription
  	},
  	deleteForm(subscription) {
  		if (confirm('You\'re about to delete a subscription!')) {
  			this.deleteSubscription(subscription)
  		} else {
  			return
  		}
  	},
  	formatDisciplines () {
  		this.disciplines = this.getDisciplines
  		this.disciplines.forEach(discipline => { discipline.selected = false })
  	},
  	toggleDiscipline (discipline) {
  		discipline.selected = !discipline.selected
  		discipline.selected == true
  		? this.subscription.disciplines.push(discipline)
  		: this.subscription.disciplines.pop(discipline)
  		this.disciplinesChanged++
  	},
  	changeImage (e) {
  		this.imageToAdd = e.target.files[0]
  		let formData = new FormData()
  		formData.append('pictures', this.imageToAdd)

  		this.subscription.imagePreview = URL.createObjectURL(this.imageToAdd)
  		this.subscriptionReloader++
  	},
  	sendData () {
  		let subscription_id = this.subscription.id
  		let data = {
  			name: this.subscription.name,
  			duration: this.subscription.duration,
  			description: this.subscription.description,
  			disciplines: this.subscription.disciplines,
  			price: this.subscription.price
  		}
  		if (this.imageToAdd) {
  			var formData = new FormData()
  			formData.append('pictures', this.imageToAdd)
  		}
  		if (this.actionType == 'add') {
  			this.newSubscription({subscription: data, picture: formData})
  		} else if (this.actionType == 'edit') {
  			this.editCurrentSubscription({id: subscription_id, data: data, picture: formData})
  		}
  		this.editSubscription = !this.editSubscription
  	}
  }
}
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.o-admin-subscriptions {
	@include for-mobile {
		padding: 0 var(--spacer-sm);
	}
	padding: 0 var(--spacer-xl);
	// height: 84.5%;
  overflow-y: auto;
  &::-webkit-scrollbar {
  	display: none;
  }

	.subscription {
		width: 100%;
		margin: var(--spacer-xs) 0;
	}
}
.editForm {
	&__container {
		display: flex;
		flex-wrap: wrap;
		@include for-mobile {
			margin-bottom: var(--spacer-sm);
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
			@include for-desktop {
				margin: 0 var(--spacer-2xs);
			}
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
.previewCard {
	margin: var(--spacer-xs) 0 0;
}
.imageBtn {
	--button-border-radius: 12px;
  --button-font-size: var(--font-sm);
  margin: var(--spacer-xs) 0;
}
.hidden {
	display: none;
}
</style>