import {routerParser} from "common/routers";
import {moduleGetter} from "modules";
import {ModuleNames} from "modules/names";
import {buildApp} from "react-coat";

getInitEnv(window, process.env.NODE_ENV !== "production");
buildApp(moduleGetter, ModuleNames.app, {routerParser});
