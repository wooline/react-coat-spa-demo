import { buildViews } from "react-coat";
import Main from "./Main";
import { NAMESPACE } from "../actionNames";
import model from "../model";

export default buildViews(NAMESPACE, { Main }, model);
