import { State as AdminState } from "modules/admin";
import { State as AppState } from "modules/app";
import { State as ProductState } from "modules/product";
import { State as TodosState } from "modules/todos";
import { StoreState } from "react-coat-pkg";

type RootState = StoreState<AppState & AdminState & TodosState & ProductState>;
export default RootState;
