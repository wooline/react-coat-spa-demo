import {routerParser} from "common/routers";
import {moduleGetter} from "modules";
import {ModuleNames} from "modules/names";
import {buildApp} from "react-coat";

const env = getInitEnv();
const initEnv: typeof InitEnv = {
  clientPublicPath: env.clientPublicPath,
  apiServerPath: env.apiServerPath,
};
// tslint:disable-next-line:no-string-literal
window["InitEnv"] = initEnv;

buildApp(moduleGetter, ModuleNames.app, {routerParser});
