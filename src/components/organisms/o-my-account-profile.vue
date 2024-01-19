<template>
  <div class="o-my-account-profile">
    <div class="admin-panel">
      <div class="admin-panel__image">
        <img
          v-if="userDetails.picture"
          :src="fetchImage(userDetails.picture.filePath)"
        />
        <img v-else class="avatarPlaceholder" src="@/assets/icons/user.png" />
        <div
          class="admin-panel__image--overlay"
          @click="$refs.updateImage.click()"
        >
          Change
        </div>
        <input
          class="hidden"
          type="file"
          name="image"
          ref="updateImage"
          @change="updatePicture"
        />
      </div>
      <div class="verticalSpacing">
        <div class="admin-panel__user">
          <h4>{{ userDetails.name }}</h4>
          <span>{{ userDetails.role }}</span>
        </div>
        <div class="admin-panel__user--details">
          <div class="admin-panel__user--details-item">
            <p>Height</p>
            <span>{{
              userDetails.height ? userDetails.height + " cm" : "-"
            }}</span>
          </div>
          <div class="admin-panel__user--details-item">
            <p>Weight</p>
            <span>{{
              userDetails.weight ? userDetails.weight + " kg" : "-"
            }}</span>
          </div>
          <div class="admin-panel__user--details-item">
            <p>Age</p>
            <span>{{ userDetails.age ? userDetails.age : "-" }}</span>
          </div>
        </div>
      </div>
    </div>
    <button
      class="updateDetails"
      :class="{ 'updateDetails--active': update }"
      @click="activateDetails()"
    >
      Change Details
    </button>
    <div
      class="updateDetails__container"
      :class="{ 'updateDetails__container--active': update }"
    >
      <div class="detailsFlex">
        <div class="admin-panel__user--details-item">
          <p>Height</p>
          <input v-model="details.height" type="number" name="height" />
        </div>
        <div class="admin-panel__user--details-item">
          <p>Weight</p>
          <input v-model="details.weight" type="number" name="weight" />
        </div>
        <div class="admin-panel__user--details-item">
          <p>Age</p>
          <input v-model="details.age" type="number" name="age" />
        </div>
      </div>
      <button class="detailsFlex__btn" @click="updateDetails">Update</button>
      <button class="detailsFlex__btn" @click="cancelDetails">Cancel</button>
    </div>
    <button
      class="updatePassword"
      :class="{ 'updatePassword--active': update_password }"
      @click="activatePasswordDetails()"
    >
      Update Password
    </button>
    <div
      class="updatePassword__container"
      :class="{ 'updatePassword__container--active': update_password }"
    >
      <input
        v-model="password.passwordCurrent"
        class="passwordInput"
        type="password"
        placeholder="Current Password"
      />
      <input
        v-model="password.password"
        class="passwordInput"
        type="password"
        placeholder="New Password"
      />
      <input
        v-model="password.passwordConfirm"
        class="passwordInput"
        type="password"
        placeholder="Confirm Password"
      />
      <button class="detailsFlex__btn" @click="updatePassword">Update</button>
      <button class="detailsFlex__btn" @click="cancelPassword">Cancel</button>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import FormData from "form-data";

export default {
  data() {
    return {
      api: "https://smartfit.ltct.ro/api",
      update: false,
      update_password: false,
      details: {
        height: "",
        weight: "",
        age: "",
      },
      password: {
        passwordCurrent: "",
        password: "",
        passwordConfirm: "",
      },
    };
  },
  async mounted() {
    await this.fetchUserDetails();
  },
  computed: {
    ...mapGetters({
      userDetails: "getUserDetails",
    }),
  },
  methods: {
    ...mapActions({
      fetchUserDetails: "fetchUserDetails",
      updateUserDetails: "updateUserDetails",
      updateUserPassword: "updateUserPassword",
      updateUserImage: "updateUserImage",
      deleteUserImage: "deleteUserImage",
    }),
    fetchImage(path) {
      return this.api + path;
    },
    activateDetails() {
      this.update = !this.update;
      if (this.update) {
        this.details.height = this.userDetails.height;
        this.details.weight = this.userDetails.weight;
        this.details.age = this.userDetails.age;
      } else {
        this.details.height = "";
        this.details.weight = "";
        this.details.age = "";
      }
    },
    activatePasswordDetails() {
      this.update_password = !this.update_password;
    },
    updateDetails() {
      this.updateUserDetails(this.details);
      this.details.height = "";
      this.details.weight = "";
      this.details.age = "";
      this.update = !this.update;
    },
    updatePassword() {
      this.updateUserPassword(this.password);
      this.password.password = "";
      this.password.passwordConfirm = "";
      this.password.passwordCurrent = "";
      this.update_password = !this.update_password;
    },
    cancelDetails() {
      this.update = !this.update;
      this.details.height = "";
      this.details.weight = "";
      this.details.age = "";
    },
    cancelPassword() {
      this.update_password = !this.update_password;
      this.password.password = "";
      this.password.passwordConfirm = "";
      this.password.passwordCurrent = "";
    },
    async updatePicture(e) {
      let imageFile = e.target.files[0];
      let formData = new FormData();
      formData.append("picture", imageFile);
      if (this.userDetails.picture) {
        await this.deleteUserImage();
      }
      this.updateUserImage(formData);
    },
  },
};
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.o-my-account-profile {
}
.admin-panel {
  // padding: var(--spacer-base);
  background: var(--c-white);
  border-radius: 12px;
  display: flex;
  @include for-mobile {
    flex-wrap: wrap;
    justify-content: center;
  }

  &__image {
    position: relative;
    width: 12rem;
    height: 12rem;
    overflow: hidden;
    margin: 0 var(--spacer-sm) 0 0;
    border-radius: 12px;
    box-shadow: 1px 3px 5px 0px rgba(0, 0, 0, 0.1);
    background: var(--c-light);
    &--overlay {
      position: absolute;
      display: flex;
      justify-content: center;
      align-items: center;
      background: rgba(0, 0, 0, 0.5);
      color: var(--c-white);
      text-decoration: underline;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      opacity: 0;
      transition: 0.3s;
      cursor: pointer;
      &:hover {
        opacity: 1;
      }
    }
    img {
      position: absolute;
      display: block;
      width: 100%;
      height: 100%;
      border-radius: 12px;
      object-fit: cover;
    }
  }
  &__user {
    @include for-mobile {
      text-align: center;
    }
    text-align: left;
    h4 {
      margin: var(--spacer-xs) 0 var(--spacer-2xs);
      text-transform: capitalize;
      font-size: 1.5rem;
      line-height: 1;
    }
    span {
      font-size: var(--font-sm);
      color: var(--c-primary);
      text-transform: capitalize;
    }
    &--details {
      display: flex;
      justify-content: space-between;
      text-align: center;
      margin: var(--spacer-base) 0 var(--spacer-2xs);
      min-width: 20rem;
      &-item {
        width: 6rem;
        input {
          border: 0;
          outline: 0;
          width: 4rem;
          height: 1.25rem;
          text-align: center;
        }
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
.verticalSpacing {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.updateDetails {
  @include for-mobile {
    width: 100%;
  }
  cursor: pointer;
  margin-top: var(--spacer-lg);
  height: 3rem;
  width: 33rem;
  border: none;
  outline: none;
  background: var(--c-primary);
  color: var(--c-white);
  border-radius: 10px;
  font-weight: var(--font-bold);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: 0.3s;
  &--active {
    border-radius: 10px 10px 0 0;
  }
  &__container {
    @include for-mobile {
      width: 100%;
    }
    text-align: center;
    overflow: hidden;
    width: 33rem;
    height: 0;
    background: var(--c-primary);
    color: var(--c-white);
    transition: 0.3s;
    border-radius: 0 0 10px 10px;
    padding-top: 0;
    &--active {
      height: 8rem;
      padding-top: var(--spacer-sm);
    }
  }
}
.updatePassword {
  @include for-mobile {
    width: 100%;
  }
  cursor: pointer;
  margin-top: var(--spacer-xs);
  height: 3rem;
  width: 33rem;
  border: none;
  outline: none;
  background: var(--c-primary);
  color: var(--c-white);
  border-radius: 10px;
  font-weight: var(--font-bold);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: 0.3s;
  &--active {
    border-radius: 10px 10px 0 0;
  }
  &__container {
    @include for-mobile {
      width: 100%;
    }
    text-align: center;
    overflow: hidden;
    width: 33rem;
    height: 0;
    background: var(--c-primary);
    color: var(--c-white);
    transition: 0.3s;
    border-radius: 0 0 10px 10px;
    padding-top: 0;
    &--active {
      height: 12rem;
      padding-top: var(--spacer-sm);
    }
  }
}
.detailsFlex {
  display: flex;
  justify-content: space-between;
  width: calc(100% - 3rem);
  padding: 0 var(--spacer-base);
  &__btn {
    width: calc(50% - 2rem);
    margin: var(--spacer-sm);
    border: 2px solid var(--c-white);
    background: transparent;
    padding: var(--spacer-xs) var(--spacer-sm);
    color: var(--c-white);
    border-radius: 6px;
    cursor: pointer;
    transition: 0.3s;
    &:hover {
      background: rgba(255, 255, 255, 0.25);
    }
  }
}
.hidden {
  display: none;
}
.avatarPlaceholder {
  transform: scale(0.6);
}
.passwordInput {
  display: block;
  margin: var(--spacer-xs) var(--spacer-sm);
  padding: 0 var(--spacer-xs);
  height: 1.75rem;
  width: calc(100% - 3rem);
  border: none;
  border-radius: 6px;
}
</style>
