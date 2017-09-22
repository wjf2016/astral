<template>
  <div class="auth absolute absolute--fill cover flex justify-center items-center white">
    <div class="auth-authenticating" v-if="authenticating">
      <div class="auth-statusText f2 fw3 tc">
        Signing In
      </div>
      <div class="auth-pulser absolute br-100"></div>
    </div>
    <div class="auth-signIn db pa3 tc " v-else>
      <img src="/images/logo.svg" alt="Astral" class="db mb4">
      <div class="auth-error bg-black-70 br3 mb4 pa3" v-show="error != ''">{{ error }}</div>
      <a class="auth-signInButton dib br-pill white f3 pa3 " href="/api/auth" @click="authenticating = true">Sign In</a>
    </div>
  </div>
</template>
<script>
import ls from 'local-storage'

export default {
  name: 'Auth',
  data() {
    return {
      authenticating: false,
      error: ''
    }
  },
  beforeRouteEnter(to, from, next) {
    if (to.query.error) {
      next(vm => {
        vm.authenticating = false
        vm.error = 'Unable to authenticate user.'
      })
    } else {
      if (to.query.token) {
        ls('jwt', to.query.token)
        setTimeout(() => {
          next('/dashboard')
        }, 1)
      } else {
        next()
      }
    }
  }
}
</script>
<style lang="scss">
.auth {
  background: url(/images/bg.jpg);
  background-repeat: no-repeat;
}

.auth-statusText {
  animation: fadeInOut 2s cubic-bezier(0.1, 0.3, 0.3, 1.0);
  animation-iteration-count: infinite;
  opacity: 1;
  text-shadow: 0 0 16px #fff;
}

.auth-pulser {
  animation-name: pulse;
  animation-duration: 2s;
  animation-iteration-count: infinite;
  animation-fill-mode: backwards;
  animation-timing-function: cubic-bezier(0.1, 0.3, 0.3, 1.0);
  transform: scale(1) translate(-50%, -50%);
  transform-origin: top left;
  width: 400px;
  height: 400px;
  border: 10px solid rgba(#fff, 0.7);
  opacity: 1;
  top: 50%;
  left: 50%;
}

.auth-signIn {
  img {
    width: 300px;
    height: auto;
  }
  .auth-signInButton {
    transition: background 250ms ease, border 250ms ease;
    background: rgba(#fff, 0.08);
    border: 1px solid rgba(#fff, 0.65);
    box-shadow: 0 0 8px rgba(#fff, 0.3);
    text-decoration: none;
    text-shadow: none;
    width: 300px;
    &:hover {
      background: rgba(#fff, 0.12);
      border: 1px solid rgba(#fff, 1);
    }
  }
}

@keyframes fadeInOut {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}

@keyframes pulse {
  0% {
    transform: scale(0.1) translate(-50%, -50%);
    opacity: 1;
  }
  50% {
    transform: scale(1) translate(-50%, -50%);
    opacity: 0;
  }
  100% {
    opacity: 0;
  }
}
</style>
