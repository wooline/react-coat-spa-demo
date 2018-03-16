import { injectComponents } from "react-coat";
import model from "./model";
import namespace from "./namespace";
import Main from "./views/Main";

export default injectComponents(namespace, { Main }, model);
