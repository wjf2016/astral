<template>
  <transition name="dashboard-notifier">
    <div :class="'dashboard-notifier dashboard-notifier-' + mode" v-show="show">
      <div class="dashboard-notifierInner">
        <div class="dashboard-notifierMessage">
          {{ message }}
        </div>
        <div class="dashboard-dismissNotifier" @click="hideNotifier()">&times;</div>
      </div>
    </div>
  </transition>
</template>
<script>
import Vue from 'vue'
export default {
  name: 'Notifier',
  props: ['timeout'],
  data() {
    return {
      _timeout: null,
      show: false,
      mode: 'success',
      message: ''
    }
  },
  created() {
    this.$bus.$on('NOTIFICATION', (message, mode = 'success', duration = '3000') => {
      this.message = message
      this.mode = mode
      Vue.nextTick(() => {
        this.showNotifier(duration)
      })
    })
  },
  methods: {
    showNotifier(duration = 3000) {
      this.show = true
      clearTimeout(this._timeout)
      this._timeout = setTimeout(() => {
        this.show = false
      }, parseInt(duration, 10) + 500)
    },
    hideNotifier() {
      clearTimeout(this._timeout)
      this.show = false
    }
  }
}
</script>
<style lang="scss">
@import "../../sass/application/shared/variables";
.dashboard-notifier {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: $dashboard-sidebar-width;
  z-index: 99999;
  &-enter-active,
  &-leave-active {
    transition: transform 250ms cubic-bezier(0.215, 0.61, 0.355, 1), opacity 250ms cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  &-enter,
  &-leave-to {
    transform: translate3d(40px, 0, 0);
    opacity: 0;
  }
  .dashboard-notifierInner {
    width: 100%;
    height: 100%;
    background: $primary;
    border-radius: 3px;
    color: #fff;
    display: flex;
    align-items: center;
    font-size: 0.75rem;
    font-weight: bold;
    padding: 20px 30px 20px 20px;
    .dashboard-notifierMessage {
      flex-grow: 1;
    }
    .dashboard-dismissNotifier {
      transform: translateY(-50%);
      color: darken($primary, 12%);
      cursor: pointer;
      font-size: 1.2rem;
      margin-top: -1px;
      position: absolute;
      top: 50%;
      right: 10px;
      text-shadow: 0 1px 0 rgba(#fff, 0.12);
      &:hover {
        color: darken($primary, 16%);
      }
    }
  }
  &-error {
    .dashboard-notifierInner {
      background: $red;
      .dashboard-dismissNotifier {
        color: darken($red, 12%);
        &:hover {
          color: darken($red, 16%);
        }
      }
    }
  }
}
</style>
