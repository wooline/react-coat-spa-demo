import ArticleHandlers from "common/ArticleHandlers";
import {PhotoResource, State} from "entity/photo";
import {ModuleNames} from "modules/names";
import {Actions, exportModel} from "react-coat";
import api from "./api";

// 定义本导出本模块的 ModuleState
export {State} from "entity/photo";

const initState: State = {};

class ModuleHandlers extends ArticleHandlers<State, PhotoResource> {
  constructor(init: State) {
    super(init, {api});
  }
  protected async parseRouter() {
    const result = await super.parseRouter();
    this.updateState({showComment: result.moduleSearchData.showComment});
    return result;
  }
}

// 导出本模块的Actions
export type ModuleActions = Actions<ModuleHandlers>;

export default exportModel(ModuleNames.photos, ModuleHandlers, initState);
