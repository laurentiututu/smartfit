<template>
  <div class="o-admin-users">
		<m-user-card v-for="(user, i) in sortedUsers" :key="i" :user="user"/>
  </div>	
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import FormData from 'form-data'
import MUserCard from '@/components/molecules/m-user-card'
// import { SfButton } from '@storefront-ui/vue'

export default {
	components: {
		MUserCard
	},
	async mounted () {
		await this.fetchUsers()
		await this.fetchUserDetails()
	},
	computed: {
		...mapGetters({
			getUsers: 'getUsers',
			getUserDetails: 'getUserDetails'
		}),
		sortedUsers () {
			let users = [...this.getUsers]
			users.sort(user => { return user.id == this.getUserDetails.id ? -1 : 0 })
			return users
		}
	},
	methods: {
		...mapActions({
			fetchUsers: 'fetchUsers',
			fetchUserDetails: 'fetchUserDetails'
		})
	}
}
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.o-admin-users {
	@include for-mobile {
		padding: var(--spacer-sm);
	}
	padding: var(--spacer-2xl) var(--spacer-xl);
	// max-height: 84.5%;
  overflow-y: auto;
  &::-webkit-scrollbar {
  	display: none;
  }

	display: flex;
	flex-wrap: wrap;

	.m-user-card {
		flex: 1 1 calc(25% - var(--spacer-sm));
		max-width: calc(25% - var(--spacer-sm));
		margin: 2rem var(--spacer-xs);
		@include for-mobile {
			flex: 1 1 calc(50% - var(--spacer-sm));
			max-width: calc(50% - var(--spacer-sm));
		}
	}
}
</style>