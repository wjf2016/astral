import { Promise } from 'es6-promise'

import { SET_USER } from '../mutation-types.js'
import User from '../api/user'

const state = {
  user: {}
}

const getters = {
  user: state => state.user
}

export const mutations = {
  [SET_USER] (state, user) {
    state.user = user
  }
}

const actions = {
  fetchUser ({ commit }) {
    return User.fetch().then((res) => {
      commit(SET_USER, res.message)
    })
  },
  setUserAutoTag ({ commit }, state) {
    return User.setAutoTag(state).then((res) => {
      commit(SET_USER, res.message)
    })
  },
  setUserSeenPatreonNotice ({ commit }) {
    return User.setSeenPatreonNotice().then((res) => {
      commit(SET_USER, res.message)
    })
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
