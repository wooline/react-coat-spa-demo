import { StoreState } from "react-coat";
import { State as AppState } from "modules/app";
import { State as AdminState } from "modules/admin";
import { State as TodosState } from "modules/todos";
import { State as ProductState } from "modules/product";

type RootState = StoreState<AppState & AdminState & TodosState & ProductState>;
export default RootState;
