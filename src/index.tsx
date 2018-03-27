import "assets/global.less";
import appViews from "modules/app/views";
import { createApp } from "react-coat-pkg";

/* createApp()还可以传两个参数以自定义扩展Store：
storeMiddlewares?: Middleware[]
storeEnhancers?: Function[]
*/

// ie9请使用 import createHashHistory from "history/createHashHistory";
// ie9请使用 createApp(appViews.Main, "root", [], [], createHashHistory());

createApp(appViews.Main, "root");
