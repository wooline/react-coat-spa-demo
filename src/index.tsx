import "assets/global.less";
import appViews from "modules/app/views";
import { createApp } from "react-coat-pkg";

/*
createApp()还可以传入四个可选参数以自定义扩展Store：
storeMiddlewares?: Middleware[]
storeEnhancers?: Function[]
reducers?: ReducersMapObject //你可以额外添加自已的reducers
storeHistory?: History  //如果不传，则使用history/createBrowserHistory
*/

// ie9请使用 import createHashHistory from "history/createHashHistory";
// ie9请使用 createApp(appViews.Main, "root", [], [], createHashHistory());

createApp(appViews.Main, "root");
