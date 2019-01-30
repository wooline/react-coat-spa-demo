import {defineModuleGetter, defineRouterData} from "common/utils";
import {defRouteData as appDefRouteData} from "modules/app/facade";
import {defRouteData as commentsDefRouteData} from "modules/comments/facade";
import {defRouteData as messagesDefRouteData} from "modules/messages/facade";
import {defRouteData as photosDefRouteData} from "modules/photos/facade";
import {defRouteData as videosDefRouteData} from "modules/videos/facade";
import {ReturnModule, RootState as BaseState, RouterState} from "react-coat";

// 定义模块的加载方案，同步或者异步均可
export const moduleGetter = defineModuleGetter({
  app: () => {
    return import(/* webpackChunkName: "app" */ "modules/app");
  },
  photos: () => {
    return import(/* webpackChunkName: "photos" */ "modules/photos");
  },
  videos: () => {
    return import(/* webpackChunkName: "videos" */ "modules/videos");
  },
  messages: () => {
    return import(/* webpackChunkName: "messages" */ "modules/messages");
  },
  comments: () => {
    return import(/* webpackChunkName: "comments" */ "modules/comments");
  },
});

export type ModuleGetter = typeof moduleGetter;

// 扩展 connected-react-router 的路由结构
export const routerData = defineRouterData({
  app: appDefRouteData,
  photos: photosDefRouteData,
  videos: videosDefRouteData,
  messages: messagesDefRouteData,
  comments: commentsDefRouteData,
});

export type RouterData = typeof routerData;

export type RootRouter = RouterState & RouterData;

export type RootState = BaseState<ModuleGetter, RootRouter>;

// 定义整站路由与view的匹配模式
export const viewToPath: {[K in keyof ModuleGetter]: {[V in keyof ReturnModule<ModuleGetter[K]>["views"]]+?: string}} = {
  app: {Main: "/"},
  photos: {Main: "/photos", Details: "/photos/:itemId"},
  videos: {Main: "/videos", Details: "/videos/:itemId"},
  messages: {Main: "/messages"},
  comments: {Main: "/:type/:typeId/comments", Details: "/:type/:typeId/comments/:itemId"},
};
