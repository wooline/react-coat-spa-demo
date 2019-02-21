import ArticleHandlers from "common/ArticleHandlers";
import {MessageResource, State} from "entity/message";
import {ModuleNames} from "modules/names";
import {Actions, exportModel} from "react-coat";
import api from "./api";

// 定义本导出本模块的 ModuleState
export {State} from "entity/message";

const initState: State = {};

class ModuleHandlers extends ArticleHandlers<MessageResource, State> {
  constructor(init: State) {
    super(init, {api});
  }
}

// 导出本模块的Actions
export type ModuleActions = Actions<ModuleHandlers>;

export default exportModel(ModuleNames.messages, ModuleHandlers, initState);
