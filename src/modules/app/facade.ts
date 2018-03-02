import { buildActions } from "react-coat";
import { Actions, State } from "./model";
import namespace from "./namespace";

const actions: Actions = buildActions(namespace) as any;

export default actions;
export { State };
