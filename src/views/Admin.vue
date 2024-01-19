<template>
  <div class="admin demo__margin" id="admin">
    <ONavbarAdmin
      class="mobileNavbar"
      :class="{ mobileNavbar__active: navbarActive }"
      @changeSection="setCurrentSection"
    />
    <div
      class="content mobileContent"
      :class="{ mobileContent__active: navbarActive }"
    >
      <div class="user">
        <div class="user__flex">
          <div class="admin-panel__image">
            <img
              :src="getUrl(userDetails.picture.filePath)"
              @click="toggleNavbar"
            />
          </div>
          <div class="user__data">
            <h4>{{ "Hello, " + userDetails.name }}</h4>
            <p class="section">{{ activeSection.name }}</p>
          </div>
        </div>
        <div class="user__date">
          <span class="capitalize">{{ currentDate }}</span>
          <div class="user__date--image">
            <img src="@/assets/icons/calendar.png" />
          </div>
        </div>
      </div>
      <keep-alive>
        <component :is="activeSection.component" />
      </keep-alive>
    </div>
    <!-- <div class="admin-panel">
      <div class="admin-panel__image">
        <img src="@/assets/nicholas.jpg">
      </div>
      <div class="admin-panel__user">
        <h4>{{ userDetails.name }}</h4>
        <span>{{ userDetails.role }}</span>
      </div>
      <div class="admin-panel__user--details">
        <div class="admin-panel__user--details-item">
          <p>Height</p>
          <span>{{ userDetails.height + ' cm' }}</span>
        </div>
        <div class="admin-panel__user--details-item">
          <p>Weight</p>
          <span>{{ userDetails.weight + ' kg' }}</span>
        </div>
        <div class="admin-panel__user--details-item">
          <p>Age</p>
          <span>{{ userDetails.age }}</span>
        </div>
      </div>
    </div> -->
  </div>
</template>
<script>
import ONavbarAdmin from "@/components/organisms/o-navbar-admin.vue";
import OAdminDashboard from "@/components/organisms/o-admin-dashboard.vue";
import OAdminUsers from "@/components/organisms/o-admin-users.vue";
import OAdminSubscriptions from "@/components/organisms/o-admin-subscriptions.vue";
import OAdminDisciplines from "@/components/organisms/o-admin-disciplines.vue";
import OAdminEquipment from "@/components/organisms/o-admin-equipment.vue";
import OAdminOrders from "@/components/organisms/o-admin-orders.vue";
import OAdminDiscounts from "@/components/organisms/o-admin-discounts.vue";
import { mapGetters, mapActions } from "vuex";
import config from "../store/resources/endpoints/users.json";

export default {
  components: {
    ONavbarAdmin,
    OAdminDashboard,
    OAdminUsers,
    OAdminSubscriptions,
    OAdminDisciplines,
    OAdminEquipment,
    OAdminOrders,
    OAdminDiscounts,
  },
  data() {
    return {
      navbarActive: false,
      activeSection: {
        name: "dashboard",
        component: OAdminDashboard,
      },
      panels: [
        {
          name: "dashboard",
          component: OAdminDashboard,
        },
        {
          name: "users",
          component: OAdminUsers,
        },
        {
          name: "subscriptions",
          component: OAdminSubscriptions,
        },
        {
          name: "disciplines",
          component: OAdminDisciplines,
        },
        {
          name: "equipment",
          component: OAdminEquipment,
        },
        {
          name: "orders",
          component: OAdminOrders,
        },
        {
          name: "discounts",
          component: OAdminDiscounts,
        },
      ],
    };
  },
  async mounted() {
    let token = localStorage.getItem("token");
    await this.fetchUserDetails(token);
  },
  computed: {
    ...mapGetters({
      userDetails: "getUserDetails",
    }),
    currentDate() {
      let date = new Date();
      let month = date.toLocaleString("ro-ro", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      return month;
    },
  },
  methods: {
    ...mapActions({
      fetchUserDetails: "fetchUserDetails",
    }),
    setCurrentSection(value) {
      const activePanel = this.panels.find((panel) => panel.name == value);
      this.activeSection = activePanel;
      this.navbarActive = !this.navbarActive;
    },
    toggleNavbar() {
      this.navbarActive = !this.navbarActive;
    },
    getUrl(name) {
      return config.api + name;
    },
  },
};
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.admin {
  background: #f9f9f9;
  display: flex;
  justify-content: space-between;
  min-height: 100vh;
}
.content {
  @include for-desktop {
    flex: 1 1 73%;
    padding-left: 6rem;
  }
  padding-top: var(--spacer-lg);
}
.admin-panel {
  flex: 1 1 27%;
  padding: var(--spacer-base);
  background: var(--c-white);
  margin: var(--spacer-lg) var(--spacer-xl) var(--spacer-lg);
  border-radius: 12px;
  box-shadow: 1px 3px 5px 0px rgba(0, 0, 0, 0.1);
  max-height: 85vh;

  &__image {
    position: relative;
    width: 4rem;
    height: 4rem;
    overflow: hidden;
    margin: 0 var(--spacer-sm) 0 0;
    border-radius: 12px;
    box-shadow: 1px 3px 5px 0px rgba(0, 0, 0, 0.1);
    img {
      display: block;
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 12px;
      object-fit: cover;
    }
  }
  &__user {
    text-align: center;
    h4 {
      margin-bottom: var(--spacer-2xs);
      text-transform: capitalize;
    }
    span {
      font-size: var(--font-xs);
      color: var(--c-primary);
      text-transform: capitalize;
    }
    &--details {
      display: flex;
      justify-content: space-between;
      text-align: center;
      margin-top: var(--spacer-base);
      &-item {
        width: 6rem;
        p {
          margin: 0 0 var(--spacer-xs) 0;
          font-weight: var(--font-bold);
          font-size: var(--font-xs);
        }
        span {
          display: block;
          padding: var(--spacer-xs) var(--spacer-sm);
          background: var(--c-primary);
          color: var(--c-white);
          border-radius: 8px;
          font-size: var(--font-sm);
          font-weight: var(--font-semibold);
        }
      }
    }
  }
}
.user {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 var(--spacer-xl) var(--spacer-xl) var(--spacer-xl);
  @include for-mobile {
    padding: 0 var(--spacer-sm) var(--spacer-2xl);
  }
  h4 {
    @include for-mobile {
      font-size: 1rem;
    }
    font-size: 1.5rem;
    text-align: left;
    margin: var(--spacer-2xs) 0 0;
  }
  p {
    text-align: left;
    color: var(--c-gray-lighten);
    margin: var(--spacer-2xs) 0 0;
    font-size: var(--font-sm);
    @include for-mobile {
      font-size: var(--font-xs);
    }
  }
  &__flex {
    display: flex;
    align-items: center;
  }
  &__data {
    h4 {
      text-transform: capitalize;
    }
  }
  &__date {
    display: flex;
    align-items: center;
    height: 1.75rem;
    border: 2px solid var(--c-primary);
    border-radius: 12px;
    padding: var(--spacer-2xs) var(--spacer-sm);
    span {
      margin-right: 0.75rem;
      color: var(--c-primary);
      font-size: var(--font-sm);
      font-weight: var(--font-semibold);
      text-transform: capitalize;
    }
    &--image {
      width: 1rem;
      margin-top: 2px;
      img {
        width: 100%;
        filter: invert(73%) sepia(62%) saturate(4755%) hue-rotate(324deg)
          brightness(102%) contrast(96%);
      }
    }
  }
}
.section {
  text-transform: capitalize;
}
.mobileNavbar {
  @include for-mobile {
    transition: 0.5s;
    transform: translateX(-6rem);
    &__active {
      transform: translateX(0);
    }
  }
}
.mobileContent {
  @include for-mobile {
    transition: 0.55s;
    padding-left: 0;
    &__active {
      transform: translateX(6rem);
    }
    overflow-x: hidden;
  }
}

.demo {
  &__margin {
    margin-top: 2rem;
  }
}
</style>
