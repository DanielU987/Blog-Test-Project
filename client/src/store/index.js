import { createStore } from "vuex";
import { auth } from "./auth.module";
import { post } from "./post.module";
import { comment } from "./comment.module"

console.log(post)
const store = createStore({
  modules: {
    auth,
    post,
    comment
  },
});

export default store;