import {
  SET_SEARCH_QUERY,
  SET_SEARCH_TOKENS
} from '../mutation-types.js'

const state = {
  searchQuery: '',
  tokenizedSearchQuery: {
    query: '',
    tags: [],
    strings: []
  }
}

const getters = {
  searchQuery: state => state.searchQuery,
  tokenizedSearchQuery: state => state.tokenizedSearchQuery
}

export const mutations = {
  [SET_SEARCH_QUERY] (state, query) {
    state.searchQuery = query
  },
  [SET_SEARCH_TOKENS] (state, obj) {
    state.tokenizedSearchQuery = obj
  }
}

const actions = {
  setSearchQuery ({ commit }, query) {
    commit(SET_SEARCH_QUERY, query)

    const searchArray = query.split(':')

    const tags = searchArray.filter(tag => tag[0] === '#').map(tag => tag.substring(1).toLowerCase())

    const strings = searchArray.filter(str => str[0] !== '#').map(str => str.toLowerCase())

    const tokenizedQuery = {
      query,
      tags,
      strings
    }

    commit(SET_SEARCH_TOKENS, tokenizedQuery)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
