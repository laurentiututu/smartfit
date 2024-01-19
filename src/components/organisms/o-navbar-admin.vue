<template>
  <div class="navbar" id="navbar">
  	<ALogo class="logo" />
    <div class="navbar__actions">
      <template v-for="(action, i) in actions">
        <div
          v-if="allowAccess(action)"
          :key="i"
          :class="{'navbar__action--active': activeSection == action.name.toLowerCase()}"
          class="navbar__action"
          @click="setCurrentSection(action.name.toLowerCase())"
        >
          <img :src="action.thumbnail">
        </div>
      </template>
    </div>
    <div class="navbar__action--logout" @click="logout()">
      <img src="@/assets/icons/power.png">
      <span>Log out</span>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import ALogo from '../atoms/a-logo.vue'

export default {
  components: {
  	ALogo
  },
  data () {
    return {
      activeSection: 'dashboard',
      actions: [
        {
          name: 'Dashboard',
          thumbnail: require('@/assets/icons/dashboard.png'),
          role: 'all'
        },
        {
          name: 'Users',
          thumbnail: require('@/assets/icons/group.png'),
          role: 'admin'
        },
        {
          name: 'Subscriptions',
          thumbnail: require('@/assets/icons/id-card.png'),
          role: 'admin'
        },
        {
          name: 'Disciplines',
          thumbnail: require('@/assets/icons/weightlifting.png'),
          role: 'admin'
        },
        {
          name: 'Equipment',
          thumbnail: require('@/assets/icons/equipment.png'),
          role: 'admin'
        },
        {
          name: 'Orders',
          thumbnail: require('@/assets/icons/file.png'),
          role: 'all'
        },
        {
          name: 'Discounts',
          thumbnail: require('@/assets/icons/discount.png'),
          role: 'admin'
        },
      ]
    }
  },
  methods: {
    ...mapActions({
      logout: 'fetchLogout'
    }),
    setCurrentSection (id) {
      if (this.activeSection !== id) {
        this.activeSection = id
        this.$emit('changeSection', id)
      }
    },
    allowAccess (action) {
      let currentUserRole = localStorage.getItem('user_role')

      if (currentUserRole == 'admin') {
        return true;
      }
      if (action.role !== 'admin') {
        return true;
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.navbar {
  position: fixed;
	height: 100vh;
	width: 6rem;
	background: var(--c-primary);
  padding: var(--spacer-lg) 0;
  ::-webkit-scrollbar {
    width: 8px;
  }
  ::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, .35);
  }
  ::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, .65);
    &:hover {
      background: rgba(255, 255, 255, .85);
    }
  }
  &__actions {
    margin-top: var(--spacer-2xl);
    overflow-y: scroll;
    max-height: 62.5%;
  }
  &__action {
    cursor: pointer;
    border-radius: 10px;
    width: 60%;
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    transition: all .3s ease;
    &:not(:last-child) {
      margin-bottom: var(--spacer-xs);
    }
    &:hover {
      background: rgba(255, 255, 255, .35);
    }
    &--active {
      background: rgba(255, 255, 255, .35);
    }
    img {
      width: 40%;
      filter: invert(100%) sepia(1%) saturate(0%) hue-rotate(74deg) brightness(105%) contrast(100%);
    }
    &--logout {
      position: absolute;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin: 0 auto;
      bottom: 4rem;
      background: var(--c-primary);
      padding: var(--spacer-sm) 0;
      border: 1px solid var(--c-white);
      border-width: 1px 0 0 0;
      cursor: pointer;
      &:hover {
        text-decoration: underline;
        text-decoration-color: var(--c-white);
      }
      img {
        width: 30%;
        filter: invert(100%) sepia(1%) saturate(0%) hue-rotate(74deg) brightness(105%) contrast(100%);
      }
      span {
        color: var(--c-white);
        text-transform: uppercase;
        font-size: var(--font-2xs);
        margin-top: var(--spacer-xs);
      }
    }
  }
}
</style>