import * as assignDeep from "deep-extend";
import {defRouteData, ModuleGetter, RootRouter, RouterData, viewToPath} from "modules";
import {ReturnModule, RouterParser} from "react-coat";
import {matchPath} from "react-router";

/*
@Type PathToView
根据 modules/index.ts中定义的 viewToPath 反推导出来，形如：
{
  "/": ["app", "Main"],
  "/photos": ["photos", "Main"],
  "/photos/:itemId": ["photos", "Details"],
  "/videos": ["videos", "Main"],
  "/videos/:itemId": ["videos", "Details"],
  "/messages": ["messages", "Main"],
  "/:type/:typeId/comments": ["comments", "Main"],
  "/:type/:typeId/comments/:itemId": ["comments", "Details"],
}
*/
type PathToView = {[pathname: string]: [string, string]};

/*
  @Type Views
 例如根据：pathToView可以匹配出当前展示了哪些view，形如：
{
  app: {Main: true},
  photos: {Main: true, Details: true},
  comments: {Main: true},
}
*/
type Views = {[moduleName: string]: {[viewName: string]: boolean}};

/* 
 根据 modules/index.ts中定义的 viewToPath 反推导出来 pathToView
*/
const pathToView: PathToView = ((maps: {[mName: string]: string | {[vName: string]: string}}) => {
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
})(viewToPath as any);

/*
defSearch 和 defHash 根据 modules/index.ts中定义的 defRouteData 推导出来，例如：

defRouteData 结构为：
{
  app: {pathData: {}, searchData: {showSearch: false, showRegisterPop: false}, hashData: {refresh: null}},
  photos: {pathData: {}, searchData: {search: {title: null, page: 1, pageSize: 10}, showComment: false}, hashData: {}},
  videos: {pathData: {}, searchData: {search: {title: null, page: 1, pageSize: 10}}, hashData: {}},
  messages: {pathData: {}, searchData: {search: {title: null, page: 1, pageSize: 10}}, hashData: {}},
  comments: {pathData: {type: "photos", typeId: ""}, searchData: {search: {articleId: "", isNewest: false, page: 1, pageSize: 10}}, hashData: {}},
}
推导出来 defSearch：
{
  app: {showSearch: false, showRegisterPop: false},
  photos: {search: {title: null, page: 1, pageSize: 10}, showComment: false},
  videos: {search: {title: null, page: 1, pageSize: 10}},
  messages: {search: {title: null, page: 1, pageSize: 10}},
  comments: {search: {articleId: "", isNewest: false, page: 1, pageSize: 10}},
}
推导出来 defHash：
{
  app: {refresh: null}, 
  photos: {}, 
  videos: {}, 
  messages: {}, 
  comments: {}
}
*/
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

/*
用JSON格式序列化路由参数，并加上模块名作前缀，例如：
{
  app: {showSearch: false, showRegisterPop: false},
  photos: {search: {title: "张家界"}, showComment: false},
}
序列化为：
app-showSearch=false&app-showRegisterPop=false&photos-search={title: "张家界"}&photos-showComment=false
*/
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

/*
  根据 modules/index.ts中定义的 viewToPath, 只需知道要展示哪个view，就能推导出它的pathname，并自动将path中的参数占位符替换，例如：
  /:type/:typeId/comments => photos/4/comments
*/
export function toPath<N extends keyof RouterData["pathData"], M extends ReturnModule<ModuleGetter[N]>, V extends keyof M["views"], P extends RouterData["pathData"][N]>(
  moduleName: N,
  viewName?: V,
  params?: P
): string {
  viewName = viewName || ("Main" as V);
  const pathExp = viewToPath[moduleName as "app"][viewName as "Main"] || "";
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

/*
 根据路由配置，判断某view是否被当前展示。
 routerParser 会自动依据 pathToView 计算出当前哪些View被展示，如：
{
  app: {Main: true},
  photos: {Main: true, Details: true},
  comments: {Main: true},
}
*/

export function isCur<N extends keyof ModuleGetter, M extends ReturnModule<ModuleGetter[N]>, V extends keyof M["views"]>(views: RouterData["views"], moduleName: N, viewName?: V): boolean {
  return views[moduleName] && views[moduleName][(viewName as string) || "Main"];
}

/*
 排除默认路由参数，如果传参与默认一致，则省去
*/
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

/*
 合并默认路由参数，与以上方法互逆，注意补足参数为空的模块
*/
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

// 生成 Url
export function toUrl(pathname: string, searchData: RouterData["searchData"] | null, hashData: RouterData["hashData"] | null): string {
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

/*
  react-coat 框架中只集成了 connected-react-router，只对路由做简单的解析，比如：
  /photos/item/2/comments/item/66?photos-search={title: "张家界"}&photos-showComment=false
  connected-react-router 只解析为：{
    location: {
      pathname: "/photos/item/2/comments/item/66",
      search: "photos-search={title: "张家界"}&photos-showComment=false",
      hash: ""
    }
  }
  react-coat 框架留了一个自定义解析的钩子方便用户扩展：
  RouterParser<T = any> = (nextRouter: T, prevRouter?: T) => T
*/
export const routerParser: RouterParser<RootRouter> = (() => {
  type PathData = {[moduleName: string]: {[key: string]: any}};
  /*
  解析 pathname，得到当前展示了哪些 view，以及 pathname中的参数，不同模块对应的解析结果是不同的，例如：
  当前 pathname 为 /photos/item/2/comments/item/66
  对于 photos 模块，因为配置了：Details: "/photos/item/:itemId"，所以解析出 {itemId:2}
  对于 comments 模块，因为配置了：/:type/item/:typeId/comments/item/:itemId，所以解析出 {type:photos, typeId:2, itemId:66}
  */
  function parsePathname(pathname: string): {pathData: PathData; views: Views} {
    const views: Views = {};
    const pathData: PathData = {};
    Object.keys(pathToView).forEach(url => {
      const match = matchPath(pathname, url);
      if (match) {
        const result = pathToView[url];
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

  const ISO_DATE_FORMAT = /^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d(\.\d+)?(Z|[+-][01]\d:[0-5]\d)$/;

  /*
    将字符串变成 Data，因为 JSON 中没有 Date 类型，所以用正则表达式匹配自动转换
  */
  function unserializeQuery(query: string): any {
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

  /*
    将module前缀去掉，并转换成结构，列如：
    app-showSearch=false&app-showRegisterPop=false&photos-search={title: "张家界"}&photos-showComment=false
    反序列化为：
    {
      app: {showSearch: false, showRegisterPop: false},
      photos: {search: {title: "张家界"}, showComment: false},
    }
  */

  function reduce(pre: {}, cur: string) {
    const [key, val] = cur.split("=");
    if (key) {
      const arr = key.split("-");
      const moduleName = arr.shift();
      const moduleKey = arr.join("-");
      if (moduleName && moduleKey) {
        if (!pre[moduleName]) {
          pre[moduleName] = {};
        }
        pre[moduleName][moduleKey] = unserializeQuery(val);
      }
    }
    return pre;
  }

  const parser: RouterParser<RootRouter> = (nextRouter, prevRouter) => {
    const nRouter: RootRouter = {...nextRouter};
    const changed = {pathname: false, search: false, hash: false};
    if (!prevRouter || nextRouter.location.pathname !== prevRouter.location.pathname) {
      const {views, pathData} = parsePathname(nextRouter.location.pathname);
      nRouter.views = views;
      nRouter.pathData = pathData;
      changed.pathname = true;
    }
    if (!prevRouter || nextRouter.location.search !== prevRouter.location.search) {
      nRouter.searchData = nextRouter.location.search.split(/[&?]/).reduce(reduce, {});
      changed.search = true;
    }
    if (!prevRouter || nextRouter.location.hash !== prevRouter.location.hash) {
      nRouter.hashData = nextRouter.location.hash.split(/[&#]/).reduce(reduce, {});
      changed.hash = true;
    }
    if (changed.pathname || changed.search) {
      // 加上默认参数
      nRouter.wholeSearchData = mergeDefData(nRouter.views, nRouter.searchData, defSearch);
    }
    if (changed.pathname || changed.hash) {
      // 加上默认参数
      nRouter.wholeHashData = mergeDefData(nRouter.views, nRouter.hashData, defHash);
    }
    return nRouter;
  };
  return parser;
})();
