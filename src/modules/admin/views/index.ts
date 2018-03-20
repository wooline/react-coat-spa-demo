import { buildViews } from "react-coat";
import model from "../model";
import namespace from "../namespace";
import Main from "./Main";

export default buildViews(namespace, { Main }, model);
