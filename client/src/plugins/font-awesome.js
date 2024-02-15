import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faHome,
  faUser,
  faUserPlus,
  faSignInAlt,
  faSignOutAlt,
  faPlus,
  faCircleUser,
  faHeart
} from "@fortawesome/free-solid-svg-icons";

library.add(faHome,faHeart, faUser, faUserPlus,faPlus, faSignInAlt, faSignOutAlt,faCircleUser);

export { FontAwesomeIcon };