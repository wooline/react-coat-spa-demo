import { State as BaseState } from "react-coat";
import { State as AppState } from "modules/app";

interface RootState extends BaseState {
  project: {
    app: AppState;
  };
}
export default RootState;
