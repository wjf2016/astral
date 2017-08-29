<template>
  <div class="dashboard-sidebar">
    <div class="dashboard-sidebar-header fixed top-0 left-0 h4 flex justify-start items-center">
      <img src="/images/logo.svg" alt="Astral">
    </div>
    <div class="sidebar-header">
      <h3 class="sidebar-header-text">Stars</h3>
      <div class="sidebar-header-control">
        <button class="refresh-stars" :class="{ 'active': refreshingStars }" @click="refreshStars"><i class="fa fa-refresh"></i></button>
      </div>
    </div>
    <ul class="dashboard-list sidebar-stars">
      <li class="all-stars dashboard-list-item" @click="resetTag" :class="{ 'selected': tagFilter == 'ALL' }"><i class="fa fa-inbox"></i> All Stars</li>
      <li class="untagged-stars dashboard-list-item" @click="showUntagged" :class="{ 'selected': tagFilter == 'UNTAGGED' }"><i class="fa fa-star-o"></i> Untagged Stars</li>
    </ul>
    <div class="sidebar-header tags-header">
      <h3 class="sidebar-header-text">Tags</h3>
      <div class="tag-button-group">
        <button class="tag-button-group-item" @click="addTagFormShowing = !addTagFormShowing"><i class="fa fa-plus-circle"></i> Add</button>
        <div class="sidebar-sortDropdown">
          <button class="tag-button-group-item" @click.stop="sortTagsDropdownVisible = !sortTagsDropdownVisible"><i class="fa fa-sort"></i> Sort</button>
          <sort-tags-dropdown :visible="sortTagsDropdownVisible" v-on-clickaway="hideSortTagsDropdown"></sort-tags-dropdown>
        </div>
      </div>
    </div>
    <form class="tag-form" v-show="addTagFormShowing" @submit.prevent="doAddTag()">
      <input type="text" name="name" v-model="newTag.name" placeholder="Tag name">
      <button type="submit">Save</button>
    </form>
    <!-- <div class="no-tags" v-show="tags.length == 0">
      <i class="fa fa-tag"></i>
      <p>You haven't added any tags yet!</p>
    </div> -->
    <transition-group name="sidebar-tag" tag="ul" class="dashboard-list sidebar-tags">
      <li class="dashboard-list-item tag" v-for="tag in tags" :key="tag.id" :data-id="tag.id" @click="setTag(tag)" :class="{ 'selected': currentTag.id == tag.id }" ref="tag">
        <i class="fa fa-tag"></i>
        <span class="tag-name">{{ tag.name }}</span>
        <span class="tagged-count" v-if="tag.stars_count > 0">{{ tag.stars_count }}</span>
      </li>
    </transition-group>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { orderBy } from 'lodash'
import { mixin as clickaway } from 'vue-clickaway'
import $ from 'jquery'
import dragula from 'dragula'
import SortTagsDropdown from './sort-tags-dropdown.vue'

export default {
  name: 'DashboardSidebar',
  components: {
    'sort-tags-dropdown': SortTagsDropdown
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
    tags () {
      setTimeout(() => {
        this.bindTagItemDragListeners()
      }, 1)
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
    doAddTag: function () {
      const newTagName = this.newTag.name
      this.addTag().then(() => {
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
@import "../../sass/application/shared/variables";
@import "../../sass/application/shared/modules/btn";
@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}
.dashboard-sidebar {
  background: $dark-blue;
  overflow-y: auto; overflow-x: hidden;
  position: absolute; top: 60px; bottom: 0; left: 0;
  width: $dashboard-sidebar-width;
  .dashboard-sidebar-header {
    width: $dashboard-sidebar-width;
    padding: 0 20px;
    background: $primary;
    img {
      width: 65%;
    }
    h3 {
      color: #fff;
      font-weight: 600;
      margin: 0;
      position: relative; top: 18px;
    }
  }
  .sidebar-header {
    color: rgba(#fff, 0.3);
    display: flex; align-items: center;
    font-size: 0.7rem;
    font-weight: bold;
    height: 42px;
    overflow: hidden;
    padding: 0 0 0 20px;
    position: relative;
    text-transform: uppercase;
    .sidebar-header-control {
      margin-left: auto; margin-right: 12px;
      .refresh-stars {
        transition: background 250ms ease;
        appearance: none;
        background: rgba(#fff, 0.1);
        border-radius: 50%;
        border: none;
        color: #fff;
        cursor: pointer;
        font-size: 0.6rem;
        font-weight: bold;
        line-height: 0.6rem;
        outline: none;
        padding: 0.45rem;
        &:hover { background: rgba(#fff, 0.2); }
        &.active {
          animation: spin 750ms linear 0s infinite;
          opacity: 0.75;
          pointer-events: none;
        }
      }
    }
    &.tags-header {
      overflow: visible;
      .tag-button-group {
        float: right;
        font-size: 0;
        height: 100%;
        position: relative;
        .sidebar-sortDropdown {
          display: inline-block;
          height: 100%;
        }
        .tag-button-group-item {
          transition: background 200ms linear, color 200ms linear;
          appearance: none;
          background: transparent;
          border: none;
          border-left: 1px solid rgba(#fff, 0.08);
          color: rgba(#fff, 0.65);
          display: inline-block;
          font-size: 0.8rem;
          height: 100%;
          outline: none;
          padding: 0 15px;
          i.fa {
            margin-right: 2px;
            pointer-events: none;
          }
          &:hover {
            background: rgba(#fff, 0.03);
            color: rgba(#fff, 0.85);
          }
        }
      }
    }
    .sidebar-header-text {
      display: inline-block;
      flex-grow: 1;
      margin: 0;
    }
  }
  .tag-form {
    background: $dark-blue;
    font-size: 0;
    input[type=text] {
      appearance: none;
      background: rgba(#fff, 0.1);
      background-clip: padding-box;
      border-radius: 0;
      border: none;
      display: inline-block;
      outline: none;
      float: left;
      font-size: 0.75rem;
      height: 40px;
      padding: 0 12px;
      position: relative; top: 0; left: 0;
      width: 80%;
      &:focus {
        background: #fff;
        color: $dark-blue;
      }
    }
    button[type=submit] {
      @include btn_flat( $primary );
      border-radius: 0;
      font-size: 0.75rem;
      height: 41px;
      margin-bottom: -2px;
      position: relative; top: 0; right: 0;
      width: 20%;
    }
  }
  .dashboard-list {
    clear: both;
    list-style-type: none;
    margin: 0;
    padding: 0;
    .dashboard-list-item {
      transition: transform 200ms linear;
      border-bottom: 1px solid rgba(#fff, 0.08);
      color: rgba(#fff, 0.65);
      cursor: pointer;
      display: flex;
      align-items: center;
      font-size: 0.8rem;
      height: 42px;
      padding: 0 20px;
      &:first-child, &:only-child { border-top: 1px solid rgba(#fff, 0.08); }
      i.fa { margin-right: 5px; pointer-events: none; }
      &.selected {
        background: rgba(#fff, 0.05);
        color: #fff;
      }
      &:hover {
        background: rgba(#fff, 0.03);
        color: rgba(#fff, 0.85);
      }
      &.selected {
        background: rgba(#fff, 0.05);
        color: #fff;
      }
    }
    &.sidebar-tags {
      position: relative;
      .no-tags {
        border-top: 1px solid rgba(#fff, 0.08);
        color: rgba(#fff, 0.85);
        display: flex; justify-content: center; align-items: center;
        flex-direction: column;
        padding: 20px;
        position: absolute; top: 0; right: 0; bottom: 0; left: 0;
        text-align: center;
        .fa {
          font-size: 10rem;
        }
      }
    }
    &.sidebar-tags .tag {
      transition: all 250ms ease;
      &.sidebar-tag-move {
        transition: transform .5s cubic-bezier(.55,0,.1,1);
      }
      &.sidebar-tag-enter, &.sidebar-tag-leave-to {
        transform: translate3d(-100%, 0, 0);
        opacity: 0;
      }
      &.sidebar-tag-leave-active {
        position: absolute;
      }
      &.dragging {
        background: $primary;
        color: #fff;
      }
      &.gu-mirror, &.gu-transit { transition: none!important; }
      .tag-name {
        flex-grow: 1;
        pointer-events: none;
      }
      .tagged-count {
        background: rgba(#fff, 0.1);
        border-radius: 100px;
        color: #fff;
        display: inline-block;
        font-size: 0.6rem;
        font-weight: bold;
        line-height: 0.6rem;
        padding: 0.3rem 0.7rem;
        pointer-events: none;
      }
    }
  }
}

//Dragula clone-url
.dashboard-list-item.gu-mirror {
  border: 1px solid rgba(#fff, 0.08);
  color: rgba(#fff, 0.65);
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 0.8rem;
  height: 42px;
  padding: 0 20px;
  i.fa { margin-right: 5px; pointer-events: none; }
  .tag-name {
    flex-grow: 1;
  }
  .tagged-count {
    background: rgba(#fff, 0.1);
    border-radius: 100px;
    color: #fff;
    display: inline-block;
    font-size: 0.6rem;
    font-weight: bold;
    line-height: 0.6rem;
    padding: 0.3rem 0.7rem;
  }
}

</style>
