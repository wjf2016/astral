<template>
<div class="vue-tagger">
  <span class="vue-tagger-tag" v-for="(tag, index) in visibleTags" :key="tag.id">
    <span class="vue-tagger-tag-name">{{ tag.name }}</span>
  </span>
  <div class="vue-tagger-input-container">
    <input class="vue-tagger-input" @click.stop v-model="newTagText" @keypress="onKeypress" type="text" @keydown.delete.stop="onDeletePressed" :placeholder="placeholder" ref="vue-tagger-input" />
  </div>
</div>
</template>
<script>
import fuzzysearch from 'fuzzysearch'
import Awesomplete from 'awesomplete'
import { differenceBy } from 'lodash'
export default {
  name: 'StarTags',
  props: {
    tags: {
      type: Array,
      required: true,
      default: []
    },
    delimiter: {
      type: String,
      default: ','
    },
    placeholder: {
      type: String,
      default: 'Add a tag...'
    },
    refId: {
      type: Number
    }
  },
  data () {
    return {
      awesomplete: null,
      newTagText: '',
      tagList: [].concat(this.tags)
    }
  },
  computed: {
    autocompleteList () {
      return differenceBy(this.tags, this.visibleTags, 'name').map(tag => tag.name)
    },
    visibleTags () {
      return this.tagList.filter(tag => tag.selected)
    }
  },
  mounted () {
    this.initAwesomplete()
  },
  watch: {
    tags () {
      this.tagList = [].concat(this.tags)
      this.awesomplete.list = this.autocompleteList
    },
    tagList () {
      this.$emit('change', JSON.parse(JSON.stringify(this.visibleTags)).map(tag => tag.name))
      this.awesomplete.list = this.autocompleteList
    }
  },
  methods: {
    initAwesomplete () {
      this.awesomplete = new Awesomplete(this.$refs["vue-tagger-input"], {
        autoFirst: true,
        filter (text, input) {
          return fuzzysearch(input.toLowerCase(), text.toLowerCase())
        },
        list: this.autocompleteList
      })
      window.addEventListener('awesomplete-select', (e) => {
        if (e.target === this.$refs[`vue-tagger-input`]) {
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
        this.tagList.push({ name: name, selected: true })
      } else {
        this.tagList.push({ name: name, selected: true })
      }
    },
    removeTagAtIndex (index) {
      this.tagList.splice(index, 1)
    },
    deleteTag (tag) {
      const index = this.tagList.findIndex(t => t.name === tag.name)
      this.removeTagAtIndex(index)
      this.$refs['vue-tagger-input'].focus()
    }
  }
}
</script>
<style lang="scss">
$primary: #708EA3;
$text: #fff;
.vue-tagger {
  background: transparent;
  background-clip: padding-box;
  border-radius: 3px;
  display: flex;
  flex-wrap: wrap;
  padding: 6px 0 0 6px;
  max-width: 400px;
  min-height: 32px;
  &.is-focused {
    background: #fcfcfc;
    border: 1px solid rgba(#000, 0.15);
    box-shadow: inset 0 1px 2px rgba(#000, 0.1);
  }
  &-tag {
    background: $primary;
    border-radius: 20px;
    color: $text;
    font-size: 0.7rem;
    font-weight: bold;
    padding: 3px 8px;
    letter-spacing: 0.02em;
    margin-bottom: 6px;
    margin-right: 3px;
  }
  &-delete-tag {
    display: none;
    cursor: pointer;
    line-height: 1;
    position: relative; top: -1px;
    margin-left: 0.75em;
    padding: 3px;
  }
  &-input-container {
    flex-grow: 1;
    flex-basis: 75px;
    margin-bottom: 6px;
    margin-right: 6px;
    height: 17px;
  }
  &-input {
    -webkit-appearance: none;
    appearance: none;
    background: transparent;
    border: none;
    font-size: 0.7rem;
    height: 100%;
    outline: none;
    width: 100%;
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
    background: #fff;
}

.awesomplete > ul:empty {
    display: none;
}

.awesomplete > ul {
	border-radius: .3em;
	margin: .2em 0 0;
	background: hsla(0,0%,100%,.9);
	background: linear-gradient(to bottom right, white, hsla(0,0%,100%,.8));
	border: 1px solid rgba(0,0,0,.3);
	box-shadow: .05em .2em .6em rgba(0,0,0,.2);
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
	  font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans;
    font-size: 13px;
		position: relative;
		padding: .5em .5em;
		cursor: pointer;
	}

	.awesomplete > ul > li:hover {
		background: rgba($primary, 0.7);
		color: $text;
	}

	.awesomplete > ul > li[aria-selected="true"] {
		background: $primary;
		color: $text;
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
