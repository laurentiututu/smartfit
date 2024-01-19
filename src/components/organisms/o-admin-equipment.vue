<template>
  <div class="o-admin-subscriptions">
  	<template v-if="!editEquipment">
	  	<m-product-card @add="editForm({action: 'add'})" itemType="template" name="Add Equipment" />
			<m-product-card
				v-for="(equipment, i) in getEquipments"
				:key="i"
				:item="equipment"
				:editBtn="true"
				itemType="equipment"
				class="subscription"
				@edit="editForm({equipment: equipment, action: 'edit'})"
				@delete="deleteForm(equipment._id)"
			/>
		</template>
		<template v-else>
			<div class="editForm">
				<input
					v-model="equipment.name"
					type="text"
					placeholder="Name"
					class="editForm__field editForm__field--input"
				/>
				<input
					v-model="equipment.short_description"
					type="text"
					placeholder="Short Description"
					class="editForm__field editForm__field--input"
				/>
				<input
					v-model="equipment.goals"
					type="text"
					placeholder="Goals"
					class="editForm__field editForm__field--input"
				/>
        <textarea
        	v-model="equipment.positioning"
        	type="text"
        	placeholder="Positioning"
        	class="editForm__field editForm__field--textarea"
        />
        <textarea
        	v-model="equipment.execution"
        	type="text"
        	placeholder="Execution"
        	class="editForm__field editForm__field--textarea"
        />
				<SfButton class="sf-button--full-width imageBtn" @click="$refs.newImage.click()">Add Image</SfButton>
        <input class="hidden" type="file" name="newImage" ref="newImage" @change="changeImage">
				<m-product-card class="previewCard" :item="equipment" :key="equipmentReloader" itemType="equipment" />
				<div class="editForm__container">
        	<SfButton class="editForm__button--submit" @click="sendData()">Submit</SfButton>
        	<SfButton class="editForm__button--cancel" @click="editForm({equipment: undefined, action: ''})">Cancel</SfButton>
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
			editEquipment: false,
			equipmentsChanged: 0,
			equipmentReloader: 0,
			equipments: [],
			equipment: {
				id: '',
				name: '',
				short_description: '',
				goals: '',
				positioning: '',
				execution: '',
				pictures: []
			},
			imageToAdd: '',
			actionType: ''
		}
	},
	async mounted () {
    await this.fetchEquipments()
    await this.formatEquipments()
  },
  watch: {
  	getEquipments() {
  		this.formatEquipments()
  	},
  	equipment: {
  		handler() {	
  			this.equipmentReloader++
  		},
  		deep: true
  	}
  },
  computed: {
    ...mapGetters({
      getEquipments: 'getEquipments'
    })
  },
  methods: {
  	...mapActions({
  		fetchEquipments: 'fetchEquipments',
  		newEquipment: 'addEquipment',
  		editCurrentEquipment: 'editEquipment',
  		deleteEquipment: 'deleteEquipment'
  	}),
  	editForm ({equipment, action}) {
  		this.actionType = action
  		this.equipments.forEach(equipment => equipment.selected = false)
  		if (equipment) {
  			this.equipment.id = equipment._id
  			this.equipment.name = equipment.name
  			this.equipment.short_description = equipment.short_description
  			this.equipment.goals = equipment.goals
  			this.equipment.positioning = equipment.positioning
  			this.equipment.execution = equipment.execution
  			this.equipment.pictures = equipment.pictures
  			this.equipment.imagePreview = ''
  		} else {
  			this.equipment.id = ''
  			this.equipment.name = ''
  			this.equipment.short_description = ''
  			this.equipment.goals = ''
  			this.equipment.positioning = ''
  			this.equipment.execution = ''
  			this.equipment.pictures = []
  			this.equipment.imagePreview = ''
  		}
  		this.editEquipment = !this.editEquipment
  	},
  	deleteForm(equipment) {
  		if (confirm('You\'re about to delete an equipment!')) {
  			this.deleteEquipment(equipment)
  		} else {
  			return
  		}
  	},
  	formatEquipments () {
  		this.equipments = this.getEquipments
  		this.equipments.forEach(equipment => { equipment.selected = false })
  	},
  	changeImage (e) {
  		this.imageToAdd = e.target.files[0]
  		let formData = new FormData()
  		formData.append('pictures', this.imageToAdd)

  		this.equipment.imagePreview = URL.createObjectURL(this.imageToAdd)
  		this.equipmentReloader++
  	},
  	sendData () {
  		let equipment_id = this.equipment.id
  		let data = {
  			name: this.equipment.name,
  			short_description: this.equipment.short_description,
  			goals: this.equipment.goals,
  			positioning: this.equipment.positioning,
  			execution: this.equipment.execution
  		}
  		if (this.imageToAdd) {
  			var formData = new FormData()
  			formData.append('pictures', this.imageToAdd)
  		}
  		if (this.actionType == 'add') {
  			this.newEquipment({equipment: data, picture: formData})
  		} else if (this.actionType == 'edit') {
  			this.editCurrentEquipment({id: equipment_id, data: data, picture: formData})
  		}
  		this.editEquipment = !this.editEquipment
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
	@include for-mobile {
		margin-bottom: var(--spacer-sm);
	}
	&__container {
		display: flex;
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