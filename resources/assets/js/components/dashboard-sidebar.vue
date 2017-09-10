<template>
  <div class="dashboard-sidebar bg-near-black overflow-y-auto overflow-x-hidden absolute top-0 bottom-0 left-0">
    <div class="dashboard-brand flex justify-start items-center ph5 mb5 bg-green">
      <img src="/images/logo.svg" alt="Astral">
    </div>
    <div class="sidebar-items">
      <sidebar-header title="Stars">
        <refresh-button :active="refreshingStars" @click.native="refreshStars"></refresh-button>
      </sidebar-header>
      <ul class="dashboard-list sidebar-stars list ma0 ph0 pt0 pb3 bb b--dark-gray ph5">
        <sidebar-item
          class="all-stars"
          :class="{ 'selected': tagFilter == 'ALL' }"
          @click.native="resetTag"
          title="All Stars"
          icon="inbox"
          icon-size="16"
        ></sidebar-item>
        <sidebar-item
          class="untagged-stars"
          :class="{ 'selected': tagFilter == 'UNTAGGED' }"
          @click.native="showUntagged"
          title="Untagged Stars"
          icon="star"
          icon-size="16"
        ></sidebar-item>
      </ul>
      <sidebar-header title="Tags">
        <div class="sidebar-sortDropdown">
          <button class="bn bg-transparent mid-gray f6 ttu flex items-center outline-0 cur-p" :class="{'active': sortTagsDropdownVisible}" @click.stop="sortTagsDropdownVisible = !sortTagsDropdownVisible"><i class="fa fa-sort mr1"></i> Sort</button>
          <sort-tags-dropdown :visible="sortTagsDropdownVisible" v-on-clickaway="hideSortTagsDropdown"></sort-tags-dropdown>
        </div>
      </sidebar-header>
      <new-tag-form @submit="doAddTag"></new-tag-form>
      <transition-group name="sidebar-tags" tag="ul" class="dashboard-list sidebar-tags list ma0 pa0 pb3 bb b--dark-gray ph4">
        <sidebar-item
          v-for="tag in tags" :key="tag.id"
          :data-id="tag.id"
          class="tag ph2 br3"
          :class="{ 'selected': currentTag.id == tag.id }"
          ref="tag"
          @click.native="setTag(tag)"
          :title="tag.name"
          icon="tag"
          icon-size="14"
          :badge="tag.stars_count"
        ></sidebar-item>
      </transition-group>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { orderBy } from 'lodash'
import { mixin as clickaway } from 'vue-clickaway'
import $ from 'jquery'
import dragula from 'dragula'
import SidebarHeader from './sidebar/sidebar-header.vue'
import SidebarItem from './sidebar/sidebar-item.vue'
import NewTagForm from './sidebar/new-tag-form.vue'
import SortTagsDropdown from './sidebar/sort-tags-dropdown.vue'
import RefreshButton from './sidebar/refresh-button.vue'

export default {
  name: 'DashboardSidebar',
  components: {
    'sidebar-header': SidebarHeader,
    'sidebar-item': SidebarItem,
    'new-tag-form': NewTagForm,
    'sort-tags-dropdown': SortTagsDropdown,
    'refresh-button': RefreshButton
  },
  mixins: [clickaway],
  data () {
    return {
      addTagFormShowing: false,
      sortTagsDropdownVisible: false,
      refreshingStars: false,
      drake: null
    }
  },
  computed: {
    ...mapGetters([
      'newTag',
      'tags',
      'currentTag',
      'tagFilter',
      'githubStars'
    ])
  },
  watch: {
    tags (newVal, oldVal) {
      if (newVal.length !== oldVal.length) {
        setTimeout(() => {
          this.bindTagItemDragListeners()
        }, 1)
      }
    }
  },
  created () {
    this.fetchTags().then(() => {
      if (this.$route.params.tag) {
        const tag = this.tags.find((tag) => {
          return tag.slug === this.$route.params.tag
        })
        if (tag) {
          this.setCurrentTag(tag)
        }
      }
      let sortMap = []
      this.drake = dragula([document.querySelector('.sidebar-tags')]).on('drop', (el, target, source, sibling) => {
        sortMap = Array.from(source.children).map(function (el, index) {
          return {
            id: el.dataset.id,
            sortOrder: index
          }
        })
        this.reorderTags(sortMap)
      })
    }).catch((errors) => {
      this.$bus.$emit('NOTIFICATION', 'There was an error fetching your tags.', 'error')
    })

    this.$bus.$on('TAGS_SORTED', (sorter) => {
      this.sortTagsDropdownVisible = false
      let sortedTags = []
      let sortMap = []
      switch (sorter) {
        case 'ALPHA_ASC':
          sortedTags = orderBy(this.tags, ['name'], ['asc'])
          break
        case 'ALPHA_DESC':
          sortedTags = orderBy(this.tags, ['name'], ['desc'])
          break
        case 'STARS_ASC':
          sortedTags = orderBy(this.tags, ['stars_count'], ['asc'])
          break
        case 'STARS_DESC':
          sortedTags = orderBy(this.tags, ['stars_count'], ['desc'])
          break
        default:
          sortedTags = orderBy(this.tags, ['name'], ['asc'])
          break
      }
      sortMap = sortedTags.map((tag, index) => {
        return {
          id: tag.id,
          sortOrder: index
        }
      })
      this.reorderTags(sortMap)
    })
  },
  destroyed () {
    if (this.drake) {
      this.drake.destroy()
    }
  },
  methods: {
    ...mapActions([
      'fetchTags',
      'fetchStars',
      'addTag',
      'tagStar',
      'reorderTags',
      'setCurrentTag',
      'cleanupStars'
    ]),
    bindTagItemDragListeners () {
      $('.dashboard-list-item.tag').off('dragover dragleave drop')
      $('.dashboard-list-item.tag').on('dragover', function (e) {
        e.preventDefault()
        e.stopPropagation()
        e.target.classList.add('dragging')
      })
      $('.dashboard-list-item.tag').on('dragleave', function (e) {
        e.preventDefault()
        e.stopPropagation()
        e.target.classList.remove('dragging')
      })
      $('.dashboard-list-item.tag').on('drop', (e) => {
        const dropData = JSON.parse(e.originalEvent.dataTransfer.getData('text'))
        const tagId = e.currentTarget.dataset.id
        e.preventDefault()
        e.stopPropagation()
        e.target.classList.remove('dragging')
        this.tagStarWithData(dropData, tagId)
      })
    },
    showNewTagForm () {
      this.addTagFormShowing = true
      setTimeout(() => {
        this.$refs.newTagForm.focus()
      }, 0)
    },
    doAddTag (name) {
      const newTagName = name
      this.addTag(newTagName).then(() => {
        this.$bus.$emit('NOTIFICATION', `${newTagName} was created successfully.`)
      }).catch((errors) => {
        if (errors.name) {
          this.$bus.$emit('NOTIFICATION', errors.name[0], 'error')
        } else {
          this.$bus.$emit('NOTIFICATION', 'There was an error creating this tag.', 'error')
        }
      })
    },
    tagStarWithData: function (data, tagId) {
      const starData = {
        repoId: data.id,
        repoName: data.full_name,
        tagId
      }
      this.tagStar(starData)
    },
    setTag: function (tag) {
      this.$router.push(`/dashboard/tag/${tag.slug}`)
    },
    resetTag: function () {
      this.$router.push('/dashboard')
    },
    viewingUntagged () {
      return this.$route.fullPath.match(/^\/dashboard\/untagged/g) !== null
    },
    showUntagged () {
      this.$router.push('/dashboard/untagged')
    },
    refreshStars () {
      this.$bus.$emit('STATUS', 'Loading stars...')
      this.refreshingStars = true
      this.fetchStars({ refresh: true }).then((res) => {
        this.refreshingStars = false
        this.$bus.$emit('STATUS', 'Cleaning up...')
        this.cleanupStars().then((res) => {
          this.$bus.$emit('STATUS', '')
        })
        Array.from(document.querySelectorAll('.repo')).forEach((repo) => {
          repo.addEventListener('dragstart', (e) => {
            const data = JSON.stringify(this.githubStars[parseInt(e.currentTarget.dataset.index, 10)])
            e.dataTransfer.effectAllowed = 'move'
            e.dataTransfer.setData('text/plain', data)
          }, false)
        })
      }).catch((error) => {
        error = JSON.parse(error)
        this.refreshingStars = false
        this.$bus.$emit('STATUS', '')
        // Check if user is throttled
        if (error.response.status === 429) {
          const secondsRemaining = parseInt(error.headers['retry-after'], 10)
          const time = secondsRemaining >= 60 ? `${Math.round(secondsRemaining / 60)} minute(s)` : `${secondsRemaining} second(s)`

          this.$bus.$emit('NOTIFICATION', `You can only refresh your stars from GitHub once every 5 minutes. Please wait ${time}, and try again.`, 'error', 7000)
        } else {
          this.$bus.$emit('NOTIFICATION', 'There was an error fetching your stars from GitHub.', 'error')
        }
      })
    },
    hideSortTagsDropdown () {
      this.sortTagsDropdownVisible = false
    }
  }
}
</script>

<style lang="scss">
@import "../../sass/nebula/scss/colors";

$sidebar-width: 280px;

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}
.dashboard-sidebar {
  width: $sidebar-width;
  .dashboard-brand {
    width: $sidebar-width;
    height: 80px;
    img {
      width: 168px;
    }
  }
  .sidebar-tags {
    &-enter, &-leave-to {
      transform: translate3d(-100%, 0, 0);
      opacity: 0;
    }
    &-leave-active {
      position: absolute;
    }
    .tag svg {
      position: relative; top: 1px
    }
  }
  .sidebar-sortDropdown button {
    transition: color 250ms ease;
    &:hover, &.active {
      color: $silver;
    }
  }
}

//Dragula clone-url
.dashboard-list-item.gu-mirror {
}

</style>
