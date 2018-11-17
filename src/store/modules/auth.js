/* eslint-disable promise/param-names */
import { AUTH_REQUEST, AUTH_ERROR, AUTH_SUCCESS, AUTH_LOGOUT } from '../actions/auth'
import { USER_REQUEST } from '../actions/user'
import apiCall from '../../utils/api'
import axios from 'axios'

const state = { token: localStorage.getItem('user-token') || '', status: '', hasLoadedOnce: false }

const getters = {
  isAuthenticated: state => !!state.token,
  authStatus: state => state.status,
}

const actions = {
  [AUTH_REQUEST]: ({commit, dispatch}, user) => {
    return new Promise((resolve, reject) => {
      commit(AUTH_REQUEST)
      //apiCall({url: 'auth', lang: user, method: 'POST'})
        axios.post('api/token', {}, { auth: {
            username: user.username,
            password: user.password
          }})
      .then(resp => {
        // Here set the header of your ajax library to the token value.
        // example with axios
          commit(AUTH_SUCCESS, resp)
          axios.defaults.headers.common['Authorization'] = resp.token
          localStorage.setItem('user-token', resp.data.token)
          //dispatch(AUTH_SUCCESS)
        resolve(resp)
      })
      .catch(err => {
        commit(AUTH_ERROR, err)
        localStorage.removeItem('user-token')
        reject(err)
      })
    })
  },
  [AUTH_LOGOUT]: ({commit, dispatch}) => {
    return new Promise((resolve, reject) => {
      commit(AUTH_LOGOUT)
      localStorage.removeItem('user-token')
        axios.defaults.headers.common['Authorization'] = ''
      resolve()
    })
  }
}

const mutations = {
  [AUTH_REQUEST]: (state) => {
    state.status = 'loading'
  },
  [AUTH_SUCCESS]: (state, resp) => {
    state.status = 'success'
    state.token = resp.data.token
    state.hasLoadedOnce = true
  },
  [AUTH_ERROR]: (state) => {
    state.status = 'error'
    state.hasLoadedOnce = true
  },
  [AUTH_LOGOUT]: (state) => {
    state.token = ''
    state.status = ''
  }
}

export default {
  state,
  getters,
  actions,
  mutations,
}