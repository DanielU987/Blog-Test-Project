import { library,config  } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faHome,
  faUser,
  faUserPlus,
  faSignInAlt,
  faSignOutAlt,
  faPlus,
  faHeart,
  faComment,
  faCircleUser,
  faPaperPlane
} from "@fortawesome/free-solid-svg-icons";

library.add(faHome,faComment,faHeart,faCircleUser,faPaperPlane, faUser, faUserPlus,faPlus, faSignInAlt, faSignOutAlt,faUser);

export { FontAwesomeIcon };