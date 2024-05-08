import { createStore } from "vuex";
import { auth } from "./auth.module";
import { post } from "./post.module";
import { comment } from "./comment.module"
import createPersistedState from 'vuex-persistedstate';
console.log(post)
const store = createStore({
  modules: {
    auth,
    post,
    comment
  },
  plugins: [createPersistedState()],
});

export default store;