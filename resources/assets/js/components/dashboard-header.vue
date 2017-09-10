<template>
  <div class="dashboard-dashboardHeader bg-white flex items-center absolute top-0 right-0 bb b--light-gray">
    <h2 class="dib ml4 near-black">
      <span>{{ currentTagName }}</span>
    </h2>
    <edit-tag-dropdown v-if="currentTagExists()"></edit-tag-dropdown>
    <transition name="dashboard-status">
      <div class="dashboard-status ml3 mid-gray flex items-center" v-show="status != ''">
        <div class="status-spinner w1 h1 o-50 br-100 mr1"></div>
        <span>{{ status }}</span>
      </div>
    </transition>
    <!-- <div class="dashboard-userDropdown" @click.stop="userDropdownVisible = !userDropdownVisible">
      <img :src="user.avatar_url" :alt="user.name" class="dashboard-userDropdownAvatar"/>
      <span class="dashboard-userDropdownName">{{ user.username }}</span>
      <i class="fa fa-chevron-down"></i>
      <user-dropdown :visible="userDropdownVisible" v-on-clickaway="hideUserDropdown"></user-dropdown>
    </div> -->
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import EditTagDropdown from './edit-tag-dropdown.vue'
import UserDropdown from './user-dropdown.vue'
import { mixin as clickaway } from 'vue-clickaway'

export default {
  name: 'DashboardHeader',
  components: {
    'edit-tag-dropdown': EditTagDropdown,
    'user-dropdown': UserDropdown
  },
  mixins: [clickaway],
  data () {
    return {
      userDropdownVisible: false,
      status: '',
      viewingUntagged: false
    }
  },
  computed: {
    ...mapGetters({
      user: 'user',
      currentTag: 'currentTag',
      tagFilter: 'tagFilter',
      query: 'searchQuery'
    }),
    currentTagName () {
      if (Object.keys(this.currentTag).length) {
        return this.currentTag.name
      } else {
        return this.tagFilter === 'UNTAGGED' ? 'Untagged' : 'All Stars'
      }
    },
    currentSearchQuery: {
      get () {
        return this.query
      },
      set (newValue) {
        this.setSearchQuery(newValue)
      }
    }
  },
  created () {
    this.$bus.$on('STATUS', (message) => { this.status = message })
    this.$bus.$on('IS_VIEWING_UNTAGGED', (isViewing) => { this.viewingUntagged = isViewing })
  },
  methods: {
    ...mapActions([
      'setSearchQuery'
    ]),
    currentTagExists () {
      return !!Object.keys(this.currentTag).length
    },
    hideUserDropdown () {
      this.userDropdownVisible = false
    }
  }
}
</script>
<style lang="scss">
@import "../../sass/nebula/scss/colors";

.dashboard-dashboardHeader {
  left: 280px;
  height: 80px;
}
.dashboard-status {
  &-enter-active, &-leave-active {
    transition: opacity 250ms ease;
  }
  &-enter, &-leave-to {
    opacity: 0;
  }
  .status-spinner {
    animation: spin 1.2s backwards infinite linear;
    border: 2px solid;
    border-top-color: $dark-gray;
    color: $gray;
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
