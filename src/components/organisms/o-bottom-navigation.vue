<template>
  <div>
    <div class="o-bottom-navigation">
      <SfIcon
        key="home_fill"
        icon="home_fill"
        size="1.5rem"
        :color="activeRoute == '/' ? '#FA735A' : '#000'"
        class="iconStyle"
        @click="$router.push('/')"
      />
      <SfIcon
        key="account"
        icon="account"
        size="1.5rem"
        :color="activeRoute == '/account' ? '#FA735A' : '#000'"
        class="iconStyle"
        @click="$router.push('/account')"
      />
      <img
        src="@/assets/logos/logo_minimal.png"
        class="logoIcon"
        @click="activeMenu = !activeMenu"
      >
      <div class="cartContainer iconStyle">
        <SfIcon
          key="heart"
          icon="heart"
          size="20px"
          color="black"
          @click="$router.push('/wishlist')"
        />
        <div v-if="wishlist.length" class="cartContainer__badge">{{ wishlist.length }}</div>
      </div>
      <div class="cartContainer iconStyle">
        <SfIcon
          key="empty_cart"
          icon="empty_cart"
          size="20px"
          color="black"
          @click="$router.push('/cart')"
        />
        <div v-if="cart.length" class="cartContainer__badge">{{ cartProducts }}</div>
      </div>
    </div>
    <div class="menu" :class="{'menu--active': activeMenu}">
      <p class="menu__item" @click="goToUrl('/subscriptions')">Subscriptions</p>
      <p class="menu__item" @click="goToUrl('/disciplines')">Disciplines</p>
      <p class="menu__item" @click="goToUrl('/equipment')">Equipment</p>
    </div>
  </div>
</template>
<script>
import { SfIcon } from '@storefront-ui/vue'
import { mapGetters } from 'vuex'

export default {
  components: {
    SfIcon
  },
  data () {
    return {
      activeMenu: false,
      links: [
        {
          name: 'Home',
          path: '/'
        },
        {
          name: 'Subscriptions',
          path: '/subscriptions'
        },
        {
          name: 'Disciplines',
          path: '/disciplines'
        },
        {
          name: 'Equipment',
          path: '/equipment'
        }
      ]
    }
  },
  computed: {
    ...mapGetters({
      wishlist: 'getSubscriptionsFavourite',
      cart: 'getCartProducts'
    }),
    isAdmin () {
      return localStorage.getItem('user_role') == 'admin'
      ? true
      : false
    },
    activeRoute () {
      return this.$route.path
    },
    cartProducts () {
      let quantity = 0
      this.cart?.forEach(product => {
        quantity += product.qty
      })
      return quantity
    }
  },
  methods: {
  	goToUrl (path) {
      this.activeMenu = !this.activeMenu
      this.$router.push(path)
    }
  }
}
</script>
<style lang="scss" scoped>
.o-bottom-navigation {
  position: fixed;
  bottom: 0;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  width: calc(100vw - 3rem);
  padding: var(--spacer-sm) var(--spacer-base);
  box-shadow: 0px -2px 10px 1px rgba(0,0,0,0.2);
  background: var(--c-white);
  height: 1.2rem;
  z-index: 100;
}
.logoIcon {
  height: 4rem;
}
.menu {
  position: fixed;
  width: 100%;
  height: 0;
  bottom: 0;
  padding-bottom: 0;
  background: var(--c-light);
  z-index: 50;
  transition: .3s;
  &--active {
  	height: 16rem;
  }
  &__item {
  	padding: var(--spacer-sm) var(--spacer-sm);
    margin: 0;
    border-bottom: 1px solid var(--c-light-darken);
    &:hover {
      background: var(--c-light-darken);
    }
  }
}
.cartContainer {
  position: relative;
  &__badge {
    position: absolute;
    right: -0.4rem;
    top: -0.4rem;
    background: var(--c-text);
    color: var(--c-white);
    padding: var(--spacer-2xs);
    border-radius: 50%;
    width: 0.5rem;
    height: 0.5rem;
    font-size: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>