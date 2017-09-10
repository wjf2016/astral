<template>
  <div class="dashboard-repo-details absolute bottom-0 right-0 overflow-hidden">
    <star-info-header v-if="currentStar.hasOwnProperty('id')" :star="currentStar"></star-info-header>
    <!-- <div class="manage-star" v-if="currentStar.hasOwnProperty('id')">
      <div class="edit-star-tags">
          <div class="dropdown-wrap">
            <button class="toggle-tag-editor" @click="tagEditorShowing = !tagEditorShowing"><i class="fa fa-tag"></i> Edit Tags</button>
            <div>
              <tag-editor :tags="tagList" :class="{'active': tagEditorShowing}" v-on-clickaway="clickedAwayFromTagEditor"></tag-editor>
            </div>
          </div>
      </div>
      <button class="toggle-notes-editor" @click="noteEditorShowing = !noteEditorShowing"><i class="fa fa-sticky-note"></i> Notes</button>
      <div class="clone-url">
        <label for="txtGitHubCloneURL" @click="focusCloneInput">Clone:</label>
        <input type="text" id="txtGitHubCloneURL" :value="currentStar.ssh_url" @focus="focusCloneInput" readonly/>
      </div>
    </div> -->
    <transition name="readme-overlay">
      <div class="readme-error-overlay bg-white mid-gray absolute fw6 left-0 right-0 bottom-0 flex items-center justify-center" v-show="readmeError">
        Error Loading Readme
      </div>
    </transition>
    <transition name="readme-overlay">
      <div class="readme-notfound-overlay bg-white mid-gray absolute fw6 left-0 right-0 bottom-0 flex items-center justify-center" v-show="readmeNotFound">
        Readme not found
      </div>
    </transition>
    <transition name="readme-overlay">
      <div class="readme-loading-overlay bg-white-90 mid-gray absolute fw6 left-0 right-0 bottom-0 flex items-center justify-center" v-show="readmeLoading">
        <img src="/images/loader1.svg" />
      </div>
    </transition>
    <div class="repo-readme syntax absolute left-0 right-0 bottom-0 bg-white f5 overflow-x-hidden overflow-y-auto pa4" v-html="readme" v-show="currentStar.hasOwnProperty('id')"></div>
    <div>
    <transition name="readme-overlay">
      <div class="empty-placeholder bg-white mid-gray absolute absolute--fill fw6 flex items-center justify-center flex-column" v-show="!currentStar.hasOwnProperty('id')">
        <img src="/images/no-repo-selected-icon.svg" class="w-auto mb3">
        <span>No Repo Selected</span>
      </div>
    </transition>
      <!-- <star-notes-editor :notes="notes" v-if="currentStar.hasOwnProperty('id') && noteEditorShowing"></star-notes-editor> -->
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import TagEditor from './tag-editor.vue'
import StarNotesEditor from './star-notes-editor.vue'
import StarInfoHeader from './star-info-header.vue'
import { mixin as clickaway } from 'vue-clickaway'

export default {
  name: 'StarInfo',
  mixins: [clickaway],
  components: {
    'tag-editor': TagEditor,
    'star-notes-editor': StarNotesEditor,
    'star-info-header': StarInfoHeader
  },
  data () {
    return {
      tagEditorShowing: false,
      noteEditorShowing: false,
      readmeLoading: false,
      readmeError: false,
      readmeNotFound: false,
      currentNotes: ''
    }
  },
  computed: {
    ...mapGetters([
      'readme',
      'currentStar',
      'tags',
      'user'
    ]),
    notes () {
      if (this.currentStar && this.currentStar.hasOwnProperty('id')) {
        return this.currentStar.notes
      } else {
        return ''
      }
    },
    tagList () {
      return this.tags.map((tag) => {
        var isSelected = false
        if (this.currentStar.tags.length) {
          isSelected = this.currentStar.tags.map(function (starTag) {
            return starTag.id
          }).indexOf(tag.id) > -1
        }
        return {
          id: tag.id,
          text: tag.name,
          selected: isSelected
        }
      })
    }
  },
  created () {
    this.$bus.$on('SYNC_TAGS', tags => this.syncTags(tags))
    this.$bus.$on('NOTES_SAVED', (notes) => { this.saveNotes(notes) })
    this.$bus.$on('HIDE_TAG_DROPDOWN', () => {
      this.tagEditorShowing = false
    })
    this.$bus.$on('STAR_CHANGED', () => {
      this.noteEditorShowing = false
      this.readmeLoading = true
      this.fetchReadme({ name: this.currentStar.full_name, accessToken: this.user.access_token }).then(() => {
        this.readmeError = false
        this.readmeLoading = false
        this.readmeNotFound = false
      }).catch((errors) => {
        if (errors.message === 'Not Found') {
          this.readmeNotFound = true
        } else {
          this.readmeError = true
          this.$bus.$emit('NOTIFICATION', 'Unable to fetch readme from GitHub.', 'error')
        }
        this.readmeLoading = false
      })
    })
  },
  methods: {
    ...mapActions({
      editStarNotes: 'editStarNotes',
      fetchReadme: 'fetchReadme',
      sync: 'syncTags'
    }),
    showTagEditor () { this.tagEditorShowing = true },
    hideTagEditor () { this.tagEditorShowing = false },
    clickedAwayFromTagEditor (e) {
      if (!e.target.classList.contains('toggle-tag-editor') && !e.target.classList.contains('select2-selection__choice__remove')) {
        this.hideTagEditor()
      }
    },
    syncTags (tags) {
      this.sync({ repo: this.currentStar, tags: tags }).then((res) => {
        this.$bus.$emit('NOTIFICATION', `Tags for ${this.currentStar.full_name} updated.`)
      }).catch((errors) => {
        this.$bus.$emit('NOTIFICATION', 'There was an error saving these tags.', 'error')
      })
      this.hideTagEditor()
    },
    saveNotes (notes) {
      this.editStarNotes({ star: this.currentStar, text: notes }).catch((errors) => {
        this.$bus.$emit('NOTIFICATION', 'There was an error saving your notes for this star.', 'error')
      })
    },
    focusCloneInput () {
      setTimeout(() => {
        document.getElementById('txtGitHubCloneURL').focus()
        document.getElementById('txtGitHubCloneURL').select()
      }, 0)
    }
  }
}
</script>
<style lang="scss">
@import "../../sass/nebula/scss/colors";
.readme-overlay-enter-active, .readme-overlay-leave-active {
  transition: opacity 250ms ease;
}
.readme-overlay-enter, .readme-overlay-leave-to {
  opacity: 0;
}
.dashboard-repo-details {
  top: 80px;
  left: 680px;
  overflow: hidden;
}
.repo-readme {
  transform: translate3d(0, 0, 0);
  line-height: 1.5;
  top: 70px;
  word-wrap: break-word;
  h1:first-of-type { margin-top: 0; }
  a {
    color: $green;
    &:hover { text-decoration: none; }
  }
  pre {
    border: 1px solid #eee;
    font-size: 12px;
    padding: 0 0.5em;
  }
  p code {
    border: 1px solid #eee;
    border-radius: 2px;
    font-family: monospace;
    font-size: 12px;
    padding: 0 0.5em;
  }
  img {
    max-width: 100%;
    height: auto;
  }
  blockquote {
    border-left: 4px solid #eee;
    margin-left: 0;
    padding-left: 20px;
  }
}
.readme-loading-overlay, .readme-error-overlay, .readme-notfound-overlay {
  top: 70px;
  z-index: 99;
}
</style>
