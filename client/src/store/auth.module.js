import AuthService from '../services/auth.service';

const user = JSON.parse(localStorage.getItem('user'));
const initialState = user
  ? { status: { loggedIn: true }, user }
  : { status: { loggedIn: false }, user: null };

export const auth = {
  namespaced: true,
  state: {
    ...initialState,
    userId: user ? user.id : null
  },
  actions: {
    async login({ commit }, user) {
      try {
        const loggedInUser = await AuthService.login(user);
        commit('loginSuccess', loggedInUser);
        return loggedInUser;
      } catch (error) {
        commit('loginFailure');
        throw error;
      }
    },
    logout({ commit }) {
      AuthService.logout();
      commit('logout');
    },
    async register({ commit }, user) {
      try {
        const response = await AuthService.register(user);
        commit('registerSuccess');
        return response.data;
      } catch (error) {
        commit('registerFailure');
        throw error;
      }
    },
    getUserId({ state }) {
      return new Promise((resolve) => {
        if (state.user) {
          resolve(state.user.id);
        } else {
          resolve("User not logged in");
        }
      });
    },
  },
  mutations: {

    loginSuccess(state, user) {
      state.status.loggedIn = true;
      state.user = user;
    },
    loginFailure(state) {
      state.status.loggedIn = false;
      state.user = null;
    },
    logout(state) {
      state.status.loggedIn = false;
      state.user = null;
    },
    registerSuccess(state) {
      state.status.loggedIn = false;
    },
    registerFailure(state) {
      state.status.loggedIn = false;
    }
  }
};
