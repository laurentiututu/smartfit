<template>
  <div class="login demo__margin">
    <img class="backgroundLogin" src="@/assets/bg.jpg" />
    <div class="login__panel">
      <div class="logo">
        <img src="@/assets/logos/white_logo.png" />
      </div>
      <h4 v-if="formType == 'login'">Log In</h4>
      <h4 v-if="formType == 'register'">Register</h4>
      <h4 v-if="formType == 'forgotPassword'">Forgot Password</h4>
      <div v-if="formType == 'login'" class="form">
        <input
          v-model="login.email"
          type="text"
          name="email"
          placeholder="Email"
        />
        <input
          v-model="login.password"
          type="password"
          name="password"
          placeholder="Password"
        />
      </div>
      <div v-if="formType == 'register'" class="form">
        <input
          v-model="register.name"
          type="text"
          name="name"
          placeholder="Full Name"
        />
        <input
          v-model="register.email"
          type="text"
          name="email"
          placeholder="Email"
        />
        <input
          v-model="register.password"
          type="password"
          name="password"
          placeholder="Password"
        />
        <input
          v-model="register.passwordConfirm"
          type="password"
          name="passwordConfirm"
          placeholder="Confirm Password"
        />
      </div>
      <div v-if="formType == 'forgotPassword'" class="form">
        <input
          v-model="forgotPassword.email"
          type="text"
          name="email"
          placeholder="Email"
        />
      </div>
      <div v-if="formType == 'resetPassword'" class="form">
        <input
          v-model="resetPassword.email"
          type="text"
          name="email"
          placeholder="Email"
          class="hidden"
        />
        <input
          v-model="resetPassword.pin"
          type="text"
          name="pin"
          placeholder="Pin"
        />
        <input
          v-model="resetPassword.password"
          type="password"
          name="password"
          placeholder="Password"
        />
        <input
          v-model="resetPassword.passwordConfirm"
          type="password"
          name="passwordConfirm"
          placeholder="Confirm Password"
        />
      </div>
      <span v-if="formType == 'login'" @click="formType = 'forgotPassword'"
        >Forgot password?</span
      >
      <button
        v-if="formType == 'login'"
        @click="sendLogin(login)"
        class="actionBtn"
      >
        Log In
      </button>
      <button
        v-if="formType == 'register'"
        @click="callRegister(register)"
        class="actionBtn"
      >
        Register
      </button>
      <button
        v-if="formType == 'forgotPassword'"
        @click="callForgotPassword()"
        class="actionBtn"
      >
        Forgot Password
      </button>
      <button
        v-if="formType == 'resetPassword'"
        @click="sendResetPassword(resetPassword)"
        class="actionBtn"
      >
        Reset Password
      </button>
      <p v-if="formType == 'login'" @click="formType = 'register'">
        Don't have an account? Register
      </p>
      <p v-if="formType == 'register'" @click="formType = 'login'">
        Already have an account? Log In
      </p>
      <p v-if="formType == 'forgotPassword'" @click="formType = 'login'">
        Log In
      </p>
    </div>
    <!-- <input v-model="credentials.email" type="text" name="email" placeholder="Email">
  	<input v-model="credentials.password" type="password" name="password" placeholder="Password">
  	<button @click="login(credentials)">Login</button> -->
  </div>
</template>
<script>
import { mapActions } from "vuex";

export default {
  data() {
    return {
      formType: "login",
      login: {
        email: "",
        password: "",
      },
      register: {
        name: "",
        email: "",
        password: "",
        passwordConfirm: "",
      },
      forgotPassword: {
        email: "",
      },
      resetPassword: {
        email: "",
        pin: "",
        password: "",
        passwordConfirm: "",
      },
    };
  },
  methods: {
    ...mapActions({
      sendLogin: "fetchLogin",
      sendRegister: "fetchRegister",
      sendForgotPassword: "fetchForgotPassword",
      sendResetPassword: "fetchResetPassword",
    }),
    callForgotPassword() {
      this.sendForgotPassword(this.forgotPassword);
      this.resetPassword.email = this.forgotPassword.email;
      this.formType = "resetPassword";
    },
    callRegister() {
      this.sendRegister(this.register);
      this.formType = "login";
    },
  },
};
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.logo {
  width: 100%;
  height: 5rem;
  margin-bottom: var(--spacer-lg);
  img {
    width: auto;
    height: 100%;
  }
}
.login {
  position: relative;
  width: 100vw;
  height: calc(100vh - 2rem);
  overflow: hidden;

  .backgroundLogin {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  span {
    display: flex;
    justify-content: flex-end;
    margin: var(--spacer-xs) 0 0;
    font-size: var(--font-xs);
    font-weight: var(--font-medium);
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
  p {
    font-size: var(--font-xs);
    font-weight: var(--font-semibold);
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }

  &__panel {
    display: flex;
    flex-direction: column;
    position: absolute;
    background: var(--c-primary);
    width: 30%;
    text-align: center;
    color: var(--c-white);
    @include for-mobile {
      height: calc(75vh - 5rem);
      border-radius: 16px 16px 0 0;
      bottom: 0;
      width: calc(100vw - 5rem);
      padding: var(--spacer-xl);
    }
    @include for-desktop {
      height: calc(100vh - 15rem);
      justify-content: center;
      margin: var(--spacer-base);
      border-radius: 16px;
      padding: var(--spacer-2xl);
    }

    h4 {
      text-align: center;
      font-size: var(--font-lg);
      font-weight: var(--font-black);
      font-family: var(--font-family-secondary);
    }
  }
}
.form {
  display: flex;
  flex-direction: column;
  input {
    margin: var(--spacer-2xs) 0;
    border: none;
    border-radius: 6px;
    outline: none;
    height: 3rem;
    width: calc(100% - 2rem);
    padding: 0 var(--spacer-sm);
  }
}
.actionBtn {
  display: block;
  width: 100%;
  height: 2.5rem;
  outline: none;
  border: none;
  background: var(--c-text);
  color: var(--c-white);
  font-size: var(--font-sm);
  font-weight: var(--font-semibold);
  border-radius: 5px;
  margin-top: var(--spacer-lg);
  cursor: pointer;
  transition: 0.3s;
  &:hover {
    background: rgba(0, 0, 0, 0.65);
  }
}
.hidden {
  display: none;
}
.demo {
  &__margin {
    margin-top: 2rem;
  }
}
</style>
