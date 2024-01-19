<template>
  <div class="o-header">
  	<div class="header__logo">
      <img src="@/assets/logos/logo.png" @click="$router.push('/')">
    </div>
    <div class="header__links">
      <p
        v-for="(link, i) in links"
        :key="i"
        :class="{'activeLink': isActive(link.path)}"
        @click="$router.push(link.path)"
      >
        {{ link.name }}
      </p>
    </div>
    <div class="header__icons">
      <!-- <SfIcon
        v-if="isAdmin"
        key="account"
        icon="account"
        size="20px"
        color="black"
        class="iconStyle"
        @click="$router.push('/admin')"
      /> -->
      <img
        v-if="isAdmin"
        src="@/assets/icons/admin.png"
        class="adminIcon desktop-only"
        @click="$router.push('/admin')"
      >
      <SfIcon
        key="account"
        icon="account"
        size="20px"
        color="black"
        class="iconStyle"
        @click="$router.push('/account')"
      />
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
      return localStorage.getItem('user_role') !== 'user'
      ? true
      : false
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
    isActive (path) {
      return this.$route.path == path
    }
  }
}
</script>
<style lang="scss" scoped>
.o-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacer-sm) var(--spacer-2xl);
}
.header {
  &__logo {
    width: 12rem;
    height: 3rem;
    img {
      width: auto;
      height: 100%;
      object-fit: cover;
      cursor: pointer;
    }
  }
  &__links {
    display: flex;
    p {
      margin: var(--spacer-xs) var(--spacer-sm);
      font-size: var(--font-base);
      font-weight: var(--font-medium);
      cursor: pointer;
      transition: .2s;
      &:hover {
        color: var(--c-primary);
        text-decoration: underline;
      }
    }
  }
  &__icons {
    width: 12rem;
    display: flex;
    justify-content: flex-end;
  }
}
.activeLink {
  color: var(--c-primary);
}
.iconStyle {
  cursor: pointer;
  &:not(:last-child) {
    margin-right: var(--spacer-sm);
  }
}
.adminIcon {
  width: 20px;
  display: block;
  transform: translateY(1px);
  margin-right: var(--spacer-lg);
  filter: invert(54%) sepia(46%) saturate(614%) hue-rotate(321deg) brightness(93%) contrast(111%);
  cursor: pointer;
}
.cartContainer {
  position: relative;
  &__badge {
    position: absolute;
    right: -0.25rem;
    top: -0.25rem;
    background: var(--c-text);
    color: var(--c-white);
    padding: var(--spacer-2xs);
    border-radius: 50%;
    width: 0.35rem;
    height: 0.35rem;
    font-size: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>