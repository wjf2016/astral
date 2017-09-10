<template>
<div class="vue-tagger bg-transparent flex flex-wrap pt2">
  <span class="vue-tagger-tag relative flex items-center f6 mr1 mb2 bg-gray br-pill white ph2 pv1 cur-p lh-solid" v-for="tag in visibleTags" :key="tag.id" @click="setTag(tag)" :class="{'is-focused': isFocused}">
    <span class="vue-tagger-tag-name">{{ tag.name }}</span>
    <div class="vue-tagger-tag-delete-overlay f4 br-pill bg-red white absolute absolute--fill flex items-center justify-center" v-show="isFocused" @click.stop="deleteTag(tag)">
      &times;
    </div>
  </span>
  <div class="vue-tagger-input-container grow-1 mb1 mr1">
    <input
      :placeholder="mutablePlaceholder"
      ref="input"
      @click.stop
      @keypress="onKeypress"
      @keydown.delete.stop="onDeletePressed"
      @focus="focusEditor"
      @blur="editorBlurred"
      v-model="newTagText"
      class="vue-tagger-input f6 bg-transparent bn h-100 w-100"
      type="text"
    />
  </div>
</div>
</template>
<script>
import Vue from 'vue'
import { mapActions } from 'vuex'
import fuzzysearch from 'fuzzysearch'
import Awesomplete from 'awesomplete'
import { differenceBy, isEqual } from 'lodash'

export default {
  name: 'StarTags',
  props: {
    tags: {
      type: Array,
      required: true,
      default: () => []
    },
    delimiter: {
      type: String,
      default: ','
    },
    placeholder: {
      type: String,
      default: 'Add a tag...'
    },
    repo: {
      type: Object
    }
  },
  data () {
    return {
      awesomplete: null,
      newTagText: '',
      tagList: [].concat(this.tags),
      tagsToSync: [],
      tagsChanged: false,
      mutablePlaceholder: this.placeholder,
      isFocused: false,
      _blurTimeout: null
    }
  },
  computed: {
    autocompleteList () {
      return differenceBy(this.tagList, this.visibleTags, 'name').map(tag => tag.name)
    },
    visibleTags () {
      return this.tagList.filter(tag => tag.selected)
    }
  },
  mounted () {
    this.initAwesomplete()
  },
  watch: {
    tags (newVal, oldVal) {
      if (!isEqual(newVal, this.tagsList)) {
        this.tagList = [].concat(this.tags)
        this.awesomplete.list = this.autocompleteList
      }
    },
    tagList (newVal, oldVal) {
      this.tagsChanged = !isEqual(newVal, oldVal)
    }
  },
  methods: {
    ...mapActions([
      'syncTags'
    ]),
    initAwesomplete () {
      this.awesomplete = new Awesomplete(this.$refs.input, {
        autoFirst: true,
        filter (text, input) {
          return fuzzysearch(input.toLowerCase(), text.toLowerCase())
        },
        list: this.autocompleteList
      })
      window.addEventListener('awesomplete-select', (e) => {
        if (e.target === this.$refs.input) {
          setTimeout(() => {
            const tagName = e.text.value.trim()
            this.addTag(tagName)
            setTimeout(() => {
              this.newTagText = ''
            }, 0)
          }, 0)
        }
      }, false)
    },
    onKeypress (e) {
      const key = this.delimiter.charCodeAt(0)
      if (e.which === key) {
        const tagName = this.newTagText.trim().replace(this.delimiter, '')
        this.addTag(tagName)
        setTimeout(() => {
          this.newTagText = ''
        }, 0)
      }
    },
    onDeletePressed () {
      if (this.newTagText === '') {
        const lastVisibleTag = this.tagList.filter(tag => tag.selected).pop()
        if (lastVisibleTag) {
          const index = this.tagList.findIndex(tag => tag.name === lastVisibleTag.name)
          this.removeTagAtIndex(index)
        }
      }
    },
    getTagIndexByName (name) {
      return this.tagList.findIndex(tag => tag.name.trim().toLowerCase() === name.trim().toLowerCase())
    },
    addTag (name) {
      const tagIndex = this.getTagIndexByName(name)
      if (tagIndex !== -1) {
        this.tagList.splice(tagIndex, 1)
        this.tagList = this.tagList
          .slice(0, tagIndex)
          .concat(this.tagList.slice(tagIndex + 1))
          .concat([{ name: name, selected: true }])
      } else {
        this.tagList = this.tagList.concat([{ name: name, selected: true }])
      }
    },
    removeTagAtIndex (index) {
      this.tagList = this.tagList
        .slice(0, index)
        .concat(this.tagList.slice(index + 1))
    },
    deleteTag (tag) {
      clearTimeout(this._blurTimeout)
      this.$refs.input.focus()
      const index = this.tagList.findIndex(t => t.name === tag.name)
      this.removeTagAtIndex(index)
    },
    doSyncTags () {
      Vue.nextTick(() => {
        if (this.tagsChanged) {
          this.mutablePlaceholder = 'Saving tags...'
          const tagsToSync = this.visibleTags.map(tag => tag.name)
          this.syncTags({ repo: this.repo, tags: tagsToSync }).then((res) => {
            this.tagsChanged = false
            this.mutablePlaceholder = 'Tags saved!'
            setTimeout(() => {
              this.mutablePlaceholder = this.placeholder
            }, 2500)
          }).catch((errors) => {
            this.$bus.$emit('NOTIFICATION', 'There was an error saving these tags.', 'error')
            this.tagsChanged = false
          })
        }
      })
    },
    setTag (tag) {
      if (this.isFocused) { return false }
      if (tag.hasOwnProperty('slug')) {
        this.$router.push(`/dashboard/tag/${tag.slug}`)
      } else {
        return false
      }
    },
    focusEditor (e) {
      if (!e.target.classList.contains('vue-tagger-tag-name')) {
        this.isFocused = true
      }
    },
    editorBlurred () {
      this._blurTimeout = setTimeout(() => {
        this.isFocused = false
        this.doSyncTags()
      }, 100)
    }
  }
}
</script>
<style lang="scss">
@import "../../sass/nebula/scss/colors";
.vue-tagger {
  background: transparent;
  background-clip: padding-box;
  max-width: 400px;
  min-height: 32px;
  &-tag {
    transition: background-color 250ms ease;
    height: 22px;
    letter-spacing: 0.02em;
    .vue-tagger-tag-delete-overlay {
      transition: opacity 250ms ease;
      opacity: 0;
    }
    &:hover { background: $mid-gray; }
    &.is-focused:hover {
      background-color: transparent;
      .vue-tagger-tag-delete-overlay {
        opacity: 1;
      }
    }
  }
  &-input-container {
    flex-basis: 75px;
    height: 17px;
  }
  &-input {
    -webkit-appearance: none;
    appearance: none;
    outline: none;
  }
}

// Awesomplete Styles
.awesomplete [hidden] {
    display: none;
}

.awesomplete .visually-hidden {
    position: absolute;
    clip: rect(0, 0, 0, 0);
}

.awesomplete {
    display: inline-block;
    width: 100%; height: 100%;
    position: relative;
}

.awesomplete > ul {
    position: absolute;
    left: 0;
    z-index: 1;
    min-width: 200px;
    max-width: 200px;
    box-sizing: border-box;
    list-style: none;
    padding: 0;
    margin: 0;
    background: $white;
}

.awesomplete > ul:empty {
    display: none;
}

.awesomplete > ul {
  border-radius: .25rem;
  margin: .2em 0 0;
  background: $white;
  background-clip: padding-box;
  border: 1px solid rgba($near-black, 0.1);
  box-shadow: 0 1px 1px rgba(#000, 0.08);
  overflow: hidden;
  text-shadow: none;
}

@supports (transform: scale(0)) {
  .awesomplete > ul[hidden],
  .awesomplete > ul:empty {
    opacity: 0;
    display: block;
  }
}

  .awesomplete > ul > li {
    font-size: 0.875rem;
    position: relative;
    padding: .5em .5em;
    cursor: pointer;
  }

  .awesomplete > ul > li:hover {
    background: rgba($green, 0.7);
    color: $white;
  }

  .awesomplete > ul > li[aria-selected="true"] {
    background: $green;
    color: $white;
  }

    .awesomplete mark {
      background: transparent;
      font-weight: bold;
    }

    .awesomplete li:hover mark {
      background: transparent;
      font-weight: bold;
    }

    .awesomplete li[aria-selected="true"] mark {
      background: transparent;
      font-weight: bold;
      color: inherit;
    }
</style>
