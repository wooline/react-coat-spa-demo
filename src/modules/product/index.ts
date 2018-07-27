import { exportModule } from "react-coat-pkg";

import { NAMESPACE } from "./exportActionNames";
import { Actions, State as ModuleState } from "./model";

// 导出State数据格式
export interface State {
  [NAMESPACE]: ModuleState;
}

// 导出Actions
export default exportModule<Actions>(NAMESPACE);
