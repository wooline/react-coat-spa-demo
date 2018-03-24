import appViews from "modules/app/views";
import { createApp } from "react-coat";
import "assets/global.less";
/* createApp()还可以传两个参数以自定义扩展Store：
storeMiddlewares?: Middleware[]
storeEnhancers?: Function[]
*/
createApp(appViews.Main, "root");
