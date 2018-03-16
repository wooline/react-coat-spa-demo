import { buildFacade } from "react-coat";
import { Actions, State } from "./model";
import namespace from "./namespace";

export default buildFacade<Actions>(namespace);
export { State };
