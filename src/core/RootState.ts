import { State as AdminState } from "modules/admin";
import { State as AppState } from "modules/app";
import { State as ProductState } from "modules/product";
import { State as TodosState } from "modules/todos";
import { RootState } from "react-coat-pkg";

type State = RootState<AppState & AdminState & TodosState & ProductState>;
export default State;
