<template>
  <div class="my-account">
    <h1 class="headingTitle">My Account</h1>
  	<SfContentPages
      title="My Account"
      :active="activePage"
      class="my-account__content"
      @click:change="changeActivePage"
    >
      <SfContentCategory title="Personal Details">
        <SfContentPage title="My profile">
          <OMyAccountProfile />
        </SfContentPage>
        <SfContentPage title="My subscriptions">
          <OMyAccountSubscriptions />
        </SfContentPage>
      </SfContentCategory>
      <SfContentCategory title="Order details">
        <SfContentPage title="Order history">
          <OMyAccountOrdersHistory />
        </SfContentPage>
      </SfContentCategory>
      <SfContentPage :logout="true" title="Log out" @click="logout" />
    </SfContentPages>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import { SfContentPages } from '@storefront-ui/vue'
import OMyAccountOrdersHistory from '@/components/organisms/o-my-account-orders-history'
import OMyAccountProfile from '@/components/organisms/o-my-account-profile'
import OMyAccountSubscriptions from '@/components/organisms/o-my-account-subscriptions'

export default {
  components: {
  	SfContentPages,
  	OMyAccountOrdersHistory,
  	OMyAccountProfile,
  	OMyAccountSubscriptions
  },
  data () {
  	return {
  	  activePage: 'My profile'
  	}
  },
  methods: {
    ...mapActions({
      logout: 'fetchLogout'
    }),
  	changeActivePage (title) {
      if (title === 'Log out') {
        this.logout();
        return;
      }
      this.activePage = title;
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.my-account {
  padding: var(--spacer-lg) var(--spacer-2xl);
  @include for-mobile {
    padding: var(--spacer-sm) var(--spacer-sm) 6rem;
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
</style>