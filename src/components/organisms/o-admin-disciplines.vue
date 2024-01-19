<template>
  <div class="o-admin-subscriptions">
  	<template v-if="!editDiscipline">
	  	<m-product-card @add="editForm({action: 'add'})" itemType="template" name="Add Discipline" />
			<m-product-card
				v-for="(discipline, i) in getDisciplines"
				:key="i"
				:item="discipline"
				:editBtn="true"
				itemType="discipline"
				class="subscription"
				@edit="editForm({discipline: discipline, action: 'edit'})"
				@delete="deleteForm(discipline._id)"
			/>
		</template>
		<template v-else>
			<div class="editForm">
				<input
					v-model="discipline.name"
					type="text"
					placeholder="Name"
					class="editForm__field editForm__field--input"
				/>
				<input
					v-model="discipline.short_description"
					type="text"
					placeholder="Short Description"
					class="editForm__field editForm__field--input"
				/>
        <textarea
        	v-model="discipline.long_description"
        	type="text"
        	placeholder="Description"
        	class="editForm__field editForm__field--textarea"
        />
				<SfButton class="sf-button--full-width imageBtn" @click="$refs.newImage.click()">Add Image</SfButton>
        <input class="hidden" type="file" name="newImage" ref="newImage" @change="changeImage">
				<m-product-card class="previewCard" :item="discipline" :key="disciplineReloader" itemType="discipline" />
				<div class="editForm__container">
        	<SfButton class="editForm__button--submit" @click="sendData()">Submit</SfButton>
        	<SfButton class="editForm__button--cancel" @click="editForm({discipline: undefined, action: ''})">Cancel</SfButton>
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
			editDiscipline: false,
			disciplinesChanged: 0,
			disciplineReloader: 0,
			disciplines: [],
			discipline: {
				id: '',
				name: '',
				short_description: '',
				long_description: '',
				pictures: []
			},
			imageToAdd: '',
			actionType: ''
		}
	},
	async mounted () {
    await this.fetchDisciplines()
    await this.formatDisciplines()
  },
  watch: {
  	getDisciplines() {
  		this.formatDisciplines()
  	},
  	discipline: {
  		handler() {	
  			this.disciplineReloader++
  		},
  		deep: true
  	}
  },
  computed: {
    ...mapGetters({
      getDisciplines: 'getDisciplines'
    })
  },
  methods: {
  	...mapActions({
  		fetchDisciplines: 'fetchDisciplines',
  		newDiscipline: 'addDiscipline',
  		editCurrentDiscipline: 'editDiscipline',
  		deleteDiscipline: 'deleteDiscipline'
  	}),
  	editForm ({discipline, action}) {
  		this.actionType = action
  		this.disciplines.forEach(discipline => discipline.selected = false)
  		if (discipline) {
  			this.discipline.id = discipline._id
  			this.discipline.name = discipline.name
  			this.discipline.short_description = discipline.short_description
  			this.discipline.long_description = discipline.long_description
  			this.discipline.pictures = discipline.pictures
  			this.discipline.imagePreview = ''
  		} else {
  			this.discipline.id = ''
  			this.discipline.name = ''
  			this.discipline.short_description = ''
  			this.discipline.long_description = ''
  			this.discipline.pictures = []
  			this.discipline.imagePreview = ''
  		}
  		this.editDiscipline = !this.editDiscipline
  	},
  	deleteForm(discipline) {
  		if (confirm('You\'re about to delete a discipline!')) {
  			this.deleteDiscipline(discipline)
  		} else {
  			return
  		}
  	},
  	formatDisciplines () {
  		this.disciplines = this.getDisciplines
  		this.disciplines.forEach(discipline => { discipline.selected = false })
  	},
  	changeImage (e) {
  		this.imageToAdd = e.target.files[0]
  		let formData = new FormData()
  		formData.append('pictures', this.imageToAdd)

  		this.discipline.imagePreview = URL.createObjectURL(this.imageToAdd)
  		this.disciplineReloader++
  	},
  	sendData () {
  		let discipline_id = this.discipline.id
  		let data = {
  			name: this.discipline.name,
  			short_description: this.discipline.short_description,
  			long_description: this.discipline.long_description
  		}
  		if (this.imageToAdd) {
  			var formData = new FormData()
  			formData.append('pictures', this.imageToAdd)
  		}
  		if (this.actionType == 'add') {
  			this.newDiscipline({discipline: data, picture: formData})
  		} else if (this.actionType == 'edit') {
  			this.editCurrentDiscipline({id: discipline_id, data: data, picture: formData})
  		}
  		this.editDiscipline = !this.editDiscipline
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