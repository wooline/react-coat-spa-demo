import { buildModule } from "react-coat";
import { Actions, State } from "./model";
import namespace from "./namespace";

export default buildModule<Actions>(namespace);
export { State };
