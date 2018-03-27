import { buildViews } from "react-coat-pkg";

import { NAMESPACE } from "../actionNames";
import model from "../model";
import Main from "./Main";

export default buildViews(NAMESPACE, { Main }, model);
