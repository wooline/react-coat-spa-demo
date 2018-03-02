import { injectModule } from "react-coat";
import { actions, handlers } from "./model";
import namespace from "./namespace";
import Main from "./views/Main";

const components = {
  Main
};

export { namespace, actions, handlers, components };
injectModule({
  namespace,
  actions,
  handlers,
  components
});
