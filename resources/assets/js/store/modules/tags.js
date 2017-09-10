import { Promise } from 'es6-promise'

import {
  ADD_TAG,
  SET_TAGS,
  SET_TAG_FILTER,
  SET_CURRENT_TAG,
  RESET_CURRENT_TAG,
  EDIT_TAG_NAMES_ON_STARS,
  SET_REPO_TAGS,
  REMOVE_TAG_FROM_STARS
} from '../mutation-types.js'

import Tags from '../api/tags'
import Stars from '../api/stars'

const state = {
  tags: [],
  currentTag: {},
  tagFilter: 'ALL'
}

const getters = {
  tags: state => state.tags,
  currentTag: state => state.currentTag,
  tagFilter: state => state.tagFilter
}

export const mutations = {
  [ADD_TAG] (state, tag) {
    state.tags = state.tags.concat([tag])
  },
  [SET_TAGS] (state, tags) {
    state.tags = tags
  },
  [SET_TAG_FILTER] (state, filter) {
    state.tagFilter = filter
  },
  [SET_CURRENT_TAG] (state, tag) {
    state.currentTag = Object.assign({}, state.currentTag, tag)
  },
  [RESET_CURRENT_TAG] (state) {
    state.currentTag = {}
  }
}

const actions = {
  fetchTags ({ commit }) {
    return Tags.fetch().then((res) => {
      commit(SET_TAGS, res.message)
    })
  },
  addTag ({ commit }, name) {
    return Tags.add({ name }).then((res) => {
      commit(ADD_TAG, res.message)
    })
  },
  reorderTags ({ commit }, sortMap) {
    return Tags.reorder(sortMap).then((res) => {
      commit(SET_TAGS, res.message)
    })
  },
  syncTags ({ commit, rootState }, { repo, tags }) {
    return Tags.sync(repo, tags).then((res) => {
      commit(SET_REPO_TAGS, {
        id: res.message.star.repo_id,
        tags: res.message.star.tags
      })
      commit(SET_TAGS, res.message.tags)
    })
  },
  editTagName ({ commit }, { id, name }) {
    return Tags.edit(id, name).then((res) => {
      commit(SET_TAGS, res.message.tags)
      commit(SET_CURRENT_TAG, res.message.tag)
      setTimeout(() => {
        commit(EDIT_TAG_NAMES_ON_STARS, {
          id: id,
          newTag: res.message.tag
        })
      }, 0)
    })
  },
  deleteTag ({ commit }, id) {
    return Tags.delete(id).then((res) => {
      commit(REMOVE_TAG_FROM_STARS, id)
      commit(SET_TAGS, res.message)
    })
  },
  cleanupStars ({ commit }) {
    return Stars.cleanup().then((res) => {
      commit(SET_TAGS, res.message.tags)
    })
  },
  setCurrentTag ({ commit }, tag) {
    commit(SET_CURRENT_TAG, tag)
  },
  setTagFilter ({ commit }, filter) {
    commit(SET_TAG_FILTER, filter)
  },
  resetCurrentTag ({ commit }) {
    commit(RESET_CURRENT_TAG)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
