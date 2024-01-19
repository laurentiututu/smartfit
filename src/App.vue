<template>
  <div id="app" class="app">
    <MNotification />
    <div class="demo">
      <p>This is a preview mode. Some data may not be available.</p>
    </div>
    <OHeader v-if="getCurrentPath" class="desktop-only demo__margin" />
    <router-view />
    <OBottomNavigation
      v-if="$route.path !== '/login' && $route.path !== '/admin'"
      class="mobile-only"
    />
  </div>
</template>
<script>
import OHeader from "@/components/organisms/o-header.vue";
import OBottomNavigation from "@/components/organisms/o-bottom-navigation.vue";
import MNotification from "@/components/molecules/m-notification.vue";

export default {
  components: {
    OHeader,
    OBottomNavigation,
    MNotification,
  },
  computed: {
    getCurrentPath() {
      return this.$route.path !== "/admin" && this.$route.path !== "/login";
    },
  },
};
</script>
<style lang="scss">
@import "~@storefront-ui/shared/styles/helpers/breakpoints";
.app {
  @include for-mobile {
    overflow-x: hidden;
  }
}
body {
  margin: 0;

  /*  overflow-y: scroll;*/
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.demo {
  position: fixed;
  display: flex;
  top: 0;
  z-index: 999;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 2rem;
  background-color: #f0ad4e;
  color: #90682f;
  border-bottom: 1px solid #90682f;

  &__margin {
    margin-top: 2rem;
  }
  p {
    margin: 0;
    font-size: 0.875rem;
    font-weight: 500;
  }
}
</style>
