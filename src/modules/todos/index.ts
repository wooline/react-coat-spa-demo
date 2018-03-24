import { buildModule } from "react-coat";
import { Actions, State as ModuleState } from "./model";
import { NAMESPACE } from "./actionNames";

// 导出本模块的State类型
export type State = {
  [NAMESPACE]: ModuleState;
};

// 导出Actions
export default buildModule<Actions>(NAMESPACE);
