import {routerActions} from "connected-react-router";
import * as assignDeep from "deep-extend";
import {defRouteData, ModuleGetter, moduleToUrl, ReturnModule, RootRouter, RouterData} from "modules";
import {RouterParser} from "react-coat";
import {matchPath} from "react-router";
import {Dispatch} from "redux";

type MData = {[moduleName: string]: {[key: string]: any}};
type Views = {[moduleName: string]: {[viewName: string]: boolean}};

// 转换一下路由配置的数据结构
const modulePaths = ((maps: {[mName: string]: string | {[vName: string]: string}}) => {
  const urls: {[pathname: string]: [string, string]} = {};
  for (const mName in maps) {
    if (maps.hasOwnProperty(mName)) {
      const item = maps[mName];
      if (typeof item === "string") {
        urls[item] = [mName, "Main"];
      } else {
        for (const vName in item) {
          if (item.hasOwnProperty(vName)) {
            urls[item[vName]] = [mName, vName];
          }
        }
      }
    }
  }
  return urls;
})(moduleToUrl as any);

// 转换一下路由默认值的数据结构
const {defSearch, defHash}: {defSearch: RouterData["wholeSearchData"]; defHash: RouterData["wholeHashData"]} = (routeData => {
  const search = {};
  const hash = {};
  for (const moduleName in routeData) {
    if (routeData.hasOwnProperty(moduleName)) {
      search[moduleName] = routeData[moduleName].searchData;
      hash[moduleName] = routeData[moduleName].hashData;
    }
  }
  return {defSearch: search, defHash: hash};
})(defRouteData);

// 用JSON格式序列化路由参数，并加上模块名作前缀
function serialize(data: {[key: string]: any}): string {
  const flatArr: string[] = [];
  for (const mName in data) {
    if (data.hasOwnProperty(mName)) {
      const mRoute = data[mName];
      if (mRoute) {
        for (const mKey in mRoute) {
          if (mRoute.hasOwnProperty(mKey)) {
            if (mRoute[mKey] !== undefined) {
              flatArr.push(`${mName}-${mKey}=${escape(JSON.stringify(mRoute[mKey]))}`);
            }
          }
        }
      }
    }
  }
  if (flatArr.length) {
    return flatArr.sort().join("&");
  } else {
    return "";
  }
}

// 根据路由配置，将view推导出路由pathname
export function toPath<N extends keyof RouterData["pathData"], M extends ReturnModule<ModuleGetter[N]>, V extends keyof M["views"], P extends RouterData["pathData"][N]>(
  moduleName: N,
  viewName?: V,
  params?: P
): string {
  viewName = viewName || ("Main" as V);
  const pathExp = moduleToUrl[moduleName as "app"][viewName as "Main"] || "";
  let pathname = pathExp;
  if (params) {
    pathname = pathExp.replace(/:\w+/g, flag => {
      const key = flag.substr(1);
      if (params[key]) {
        return params[key];
      } else {
        return "";
      }
    });
  }
  return pathname;
}

// 合并默认路由参数
function mergeDefData(views: Views, data: any, def: any) {
  const newData = {...data};
  Object.keys(views).forEach(mName => {
    if (!newData[mName]) {
      newData[mName] = {};
    }
  });
  Object.keys(newData).forEach(mName => {
    if (def[mName]) {
      newData[mName] = assignDeep({}, def[mName], newData[mName]);
    }
  });
  return newData;
}

// 排除默认路由参数
const excludeDefData = (data: any, def: any) => {
  const result: any = {};
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      if (typeof data[key] === "object" && def[key] && !Array.isArray(def[key])) {
        result[key] = excludeDefData(data[key], def[key]);
      } else if (data[key] !== def[key]) {
        result[key] = data[key];
      }
    }
  }
  if (Object.keys(result).length === 0) {
    return undefined;
  }
  return result;
};

// 格式化url，如果是默认参数则省去
export function toUrl(pathname: string, searchData?: RouterData["searchData"], hashData?: RouterData["hashData"]): string {
  let url = pathname;
  if (searchData) {
    const str = serialize(excludeDefData(searchData, defSearch));
    if (str) {
      url += "?" + str.replace("?", "");
    }
  }
  if (hashData) {
    const str = serialize(excludeDefData(hashData, defHash));
    if (str) {
      url += "#" + str.replace("#", "");
    }
  }
  return url;
}

// 根据路由配置，判断某view是否被当前展示
export function isCur<N extends keyof ModuleGetter, M extends ReturnModule<ModuleGetter[N]>, V extends keyof M["views"]>(views: RouterData["views"], moduleName: N, viewName?: V): boolean {
  return views[moduleName] && views[moduleName][(viewName as string) || "Main"];
}

export function linkTo(e: React.MouseEvent<HTMLAnchorElement>, dispatch: Dispatch) {
  e.preventDefault();
  const href = e.currentTarget.getAttribute("href") as string;
  if (href && href !== "#") {
    dispatch(routerActions.push(href));
  }
}

const ISO_DATE_FORMAT = /^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d(\.\d+)?(Z|[+-][01]\d:[0-5]\d)$/;

// 反序列化JSON字串，如果是标准的日期格式，将自动生成日期
export function unserializeUrlQuery(query: string): any {
  if (!query) {
    return "";
  }
  let args;
  try {
    args = JSON.parse(unescape(query), (prop: any, value: any) => {
      if (typeof value === "string" && ISO_DATE_FORMAT.test(value)) {
        return new Date(value);
      }
      return value;
    });
  } catch (e) {
    args = "";
  }
  return args;
}

// 解析pathname
function parsePathname(pathname: string): {pathData: MData; views: Views} {
  const views: Views = {};
  const pathData: MData = {};
  Object.keys(modulePaths).forEach(url => {
    const match = matchPath(pathname, url);
    if (match) {
      const result = modulePaths[url];
      if (!views[result[0]]) {
        views[result[0]] = {};
      }
      views[result[0]][result[1]] = true;
      if (match.params) {
        pathData[result[0]] = match.params;
      }
    }
  });
  return {views, pathData};
}

// 反序列化路由参数，将module前缀去掉，并转换成结构
function parseRoute(pre: {}, cur: string) {
  const [key, val] = cur.split("=");
  if (key) {
    const arr = key.split("-");
    const moduleName = arr.shift();
    const moduleKey = arr.join("-");
    if (moduleName && moduleKey) {
      if (!pre[moduleName]) {
        pre[moduleName] = {};
      }
      pre[moduleName][moduleKey] = unserializeUrlQuery(val);
    }
  }
  return pre;
}

// 完整的路由解析器
export const routerParser: RouterParser<RootRouter> = (nextRouter, prevRouter) => {
  const nRouter: RootRouter = {...nextRouter};
  const changed = {pathname: false, search: false, hash: false};
  if (!prevRouter || nextRouter.location.pathname !== prevRouter.location.pathname) {
    const {views, pathData} = parsePathname(nextRouter.location.pathname);
    nRouter.views = views;
    nRouter.pathData = pathData;
    changed.pathname = true;
  }
  if (!prevRouter || nextRouter.location.search !== prevRouter.location.search) {
    nRouter.searchData = nextRouter.location.search.split(/[&?]/).reduce(parseRoute, {});
    changed.search = true;
  }
  if (!prevRouter || nextRouter.location.hash !== prevRouter.location.hash) {
    nRouter.hashData = nextRouter.location.hash.split(/[&#]/).reduce(parseRoute, {});
    changed.hash = true;
  }
  if (changed.pathname || changed.search) {
    nRouter.wholeSearchData = mergeDefData(nRouter.views, nRouter.searchData, defSearch);
  }
  if (changed.pathname || changed.hash) {
    nRouter.wholeHashData = mergeDefData(nRouter.views, nRouter.hashData, defHash);
  }
  return nRouter;
};
