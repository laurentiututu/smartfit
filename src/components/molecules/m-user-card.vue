<template>
  <div class="m-user-card">
  	<div class="user__image--container">
      <img v-if="user.picture" :src="getUrl(user.picture.filePath)" class="user__image">
      <img v-else src="@/assets/icons/user.png" class="user__image--placeholder">
    </div>
    <div class="user__details">
      <div class="user">
        <h2>
          {{user.name}}
          <br>
          <span>{{user.role}}</span>
        </h2>
        <div class="details desktop-only">
          <h3>
            Height
            <br>
            <span>{{user.height ? `${user.height} cm` : '-'}}</span>
          </h3>
          <h3>
            Weight
            <br>
            <span>{{user.weight ? `${user.weight} kg` : '-'}}</span>
          </h3>
          <h3>
            Age
            <br>
            <span>{{user.age ? user.age : '-'}}</span>
          </h3>
        </div>
        <div class="actions">
          <button
            :class="{'selectedRole': user.role == 'admin'}"
            @click="setRole('admin')"
            :disabled="user.id == getUserDetails.id"
          >
            Admin
          </button>
          <button
            :class="{'selectedRole': user.role == 'salesman'}"
            @click="setRole('salesman')"
            :disabled="user.id == getUserDetails.id"
          >
            Salesman
          </button>
          <button
            :class="{'selectedRole': user.role == 'user'}"
            @click="setRole('user')"
            :disabled="user.id == getUserDetails.id"
          >
            User
          </button>
        </div>
        <button
          class="delete"
          @click="deleteAccount(user)"
          :disabled="user.id == getUserDetails.id"
        >
          Delete Account
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import config from '../../store/resources/endpoints/users.json'
import { mapGetters, mapActions } from 'vuex'

export default {
  props: {
  	user: {
  	  type: Object,
  	  default: () => ({})
  	},
    editBtn: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters({
      getUserDetails: 'getUserDetails'
    })
  },
  methods: {
    ...mapActions({
      updateUser: 'editUser',
      fetchUserDetails: 'fetchUserDetails',
      deleteUser: 'deleteUser'
    }),
  	getUrl (name) {
  		return config.api + name
  	},
    setRole (role) {
      let data = { role: role }
      this.updateUser({id: this.user.id, data: data})
    },
    deleteAccount (user) {
      let warning = `You're about to delete a user.\nUser: ${user.name}`
      if (confirm(warning)) {
        this.deleteUser(user.id)
      } else {
        return
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.m-user-card {
  margin-top: 2rem;
  position: relative;
  width: 14rem;
  height: 8rem;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
  transition: .35s;
  &:hover {
    height: 21.5rem;

    .user__image--container {
      width: 10rem;
      height: 10rem;
    }
    .user__details .user {
      transform: translateY(0px);
    }
  }

  .user {
    &__image {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      &--container {
        position: absolute;
        left: 50%;
        top: -2rem;
        transform: translateX(-50%);
        width: 6rem;
        height: 6rem;
        background: #fff;
        border-radius: 20px;
        box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
        overflow: hidden;
        transition: .35s;
      }
      &--placeholder {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 60%;
        height: 60%;
        object-fit: cover;
      }
    }
    &__details {
      position: absolute;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: flex-end;
      overflow: hidden;
      .user {
        padding: var(--spacer-sm) var(--spacer-sm) var(--spacer-base);
        text-align: center;
        width: 100%;
        transition: .35s;
        transform: translateY(9.25rem);

        h2 {
          font-size: var(--font-base);
          font-weight: 600;
          color: var(--c-text);
          line-height: 1.1;

          span {
            font-size: var(--font-xs);
            font-weight: var(--font-normal);
            color: var(--c-primary);
            text-transform: capitalize;
          }
        }
      }
      .details {
        display: flex;
        justify-content: space-between;
        margin: var(--spacer-sm);

        h3 {
          margin: 0 0 var(--spacer-xs) 0;
          font-weight: var(--font-bold);
          font-size: var(--font-2xs);

          span {
            display: block;
            padding: var(--spacer-2xs);
            background: var(--c-primary);
            color: var(--c-white);
            border-radius: 8px;
            font-size: var(--font-xs);
            font-weight: var(--font-semibold);
            width: 3rem;
            margin-top: var(--spacer-2xs);
          }
        }
      }
      .actions {
        display: flex;
        justify-content: space-between;
        @include for-mobile {
          flex-wrap: wrap;
          justify-content: center;
        }


        button {
          margin: 0 var(--spacer-2xs);
          padding: var(--spacer-2xs) var(--spacer-xs);
          border-radius: 5px;
          outline: none;
          font-size: var(--font-sm);
          font-weight: 500;
          cursor: pointer;
          border: 1px solid #999;
          color: #999;
          background: var(--c-white);
          transition: .3s;
          @include for-mobile {
            width: 100%;
            margin: .15rem var(--spacer-2xs);
          }
        }
      }
    }
  }
}
.selectedRole {
  transition: .3s;
  background: var(--c-primary) !important;
  color: var(--c-white) !important;
  border: 1px solid var(--c-primary) !important;
}
.delete {
  margin-top: var(--spacer-xs);
  width: calc(100% - 0.5rem);
  height: 1.6rem;
  outline: none;
  border: none;
  border-radius: 6px;
  background: #d9534f;
  color: #82322f;
  font-weight: var(--font-bold);
  text-transform: uppercase;
  font-size: var(--font-2xs);
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
}
</style>