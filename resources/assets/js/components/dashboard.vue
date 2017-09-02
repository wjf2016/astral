<template>
  <div class="dashboard bg-near-white absolute absolute--fill">
    <!-- <settings-panel :class="{'active': settingsPanelShowing}"></settings-panel>
    <patreon-notice :class="{'active': patreonNoticeShowing}"></patreon-notice> -->
    <div class="dashboard-main">
      <dashboard-header></dashboard-header>
      <dashboard-sidebar></dashboard-sidebar>
      <search-box></search-box>
      <star-list></star-list>
    </div>
    <div><notifier timeout="3000"></notifier></div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import ls from 'local-storage'
import store from './../store'
import SettingsPanel from './settings-panel.vue'
import DashboardHeader from './dashboard-header.vue'
import DashboardSidebar from './dashboard-sidebar.vue'
import SearchBox from './search-box.vue'
import StarList from './star-list.vue'
import Notifier from './notifier.vue'
import PatreonNotice from './notices/patreon-notice.vue'

export default {
  name: 'Dashboard',
  components: {
    'settings-panel': SettingsPanel,
    'patreon-notice': PatreonNotice,
    'dashboard-header': DashboardHeader,
    'dashboard-sidebar': DashboardSidebar,
    'search-box': SearchBox,
    'star-list': StarList,
    'notifier': Notifier
  },
  data () {
    return {
      settingsPanelShowing: false
    }
  },
  computed: {
    ...mapGetters([
      'tags',
      'user'
    ]),
    patreonNoticeShowing () {
      return !this.user.seen_patreon_notice
    }
  },
  methods: {
    ...mapActions([
      'fetchUser',
      'setCurrentTag',
      'setTagFilter',
      'resetCurrentTag'
    ])
  },
  created () {
    window.addEventListener('keyup', (e) => {
      if (e.keyCode === 27) {
        this.$bus.$emit('HIDE_SETTINGS_PANEL')
      }
    })

    this.$bus.$on('SHOW_SETTINGS_PANEL', () => { this.settingsPanelShowing = true })
    this.$bus.$on('HIDE_SETTINGS_PANEL', () => { this.settingsPanelShowing = false })

    this.$router.afterEach((to, from) => {
      if (to.path.match(/^\/dashboard\/untagged/g) !== null) {
        this.resetCurrentTag()
        this.setTagFilter('UNTAGGED')
        return true
      }
      if (this.tags.length) {
        if (typeof to.params.tag !== 'undefined') {
          const tag = this.tags.find((tag) => {
            return tag.slug === to.params.tag
          })
          if (tag) {
            this.setTagFilter('TAG')
            this.setCurrentTag(tag)
          } else {
            this.setTagFilter('ALL')
            this.resetCurrentTag()
          }
        } else {
          this.setTagFilter('ALL')
          this.resetCurrentTag()
        }
      }
    })
  },
  beforeRouteEnter (to, from, next) {
    if (ls('jwt')) {
      store.dispatch('fetchUser').then((res) => {
        next()
      }).catch((error) => {
        if (error.status === 401 || error.status === 400) {
          next('/auth')
        } else {
          next(false)
        }
      })
    } else {
      next('/auth')
    }
  }
}
</script>
<style lang="scss">
$easeOutCubic: cubic-bezier(0.215, 0.61, 0.355, 1);
.router-transition {
 transition: opacity 500ms $easeOutCubic;
 opacity: 1;
}
.router-enter, .router-leave {
 opacity: 0;
}
.dashboard-main {
  height: 100vh;
  overflow: hidden;
}
</style>
