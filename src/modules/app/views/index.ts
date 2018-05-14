import { buildViews } from "react-coat-pkg";

import { NAMESPACE } from "../exportActionNames";
import model from "../model";
import Main from "./Main";

export default buildViews(NAMESPACE, { Main }, model);
