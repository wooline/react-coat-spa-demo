- react-coat 同时支持`浏览器渲染(SPA)`和`服务器渲染(SSR)`，本 Demo 仅演示`浏览器渲染`，请先了解一下：[react-coat v4.0](https://github.com/wooline/react-coat)
- **如果有错误或 Bug 欢迎批评指正，如果觉得还不错请别忘了给个 Star >\_<**

---

react-coat 使用**Typescript**开发，集成**Redux**，由浅入深请看 3 个 Demo：

> [入手：Helloworld](https://github.com/wooline/react-coat-helloworld)

> [进阶：SPA(单页应用) （**本 demo**）](https://github.com/wooline/react-coat-spa-demo)

> [升级：SPA(单页应用)+SSR(服务器渲染)](https://github.com/wooline/react-coat-ssr-demo)

---

## 第二站：进阶 SPA(单页应用)

### 安装

```
git clone https://github.com/wooline/react-coat-spa-demo.git
npm install
```

<!-- TOC -->

- [第二站：进阶 SPA(单页应用)](#第二站进阶-spa单页应用)
  - [安装](#安装)
  - [运行](#运行)
  - [查看在线 Demo](#查看在线-demo)
  - [项目背景](#项目背景)
  - [路由控制需要更细粒度](#路由控制需要更细粒度)
    - [Router Store 概念](#router-store-概念)
    - [Router Store 结构](#router-store-结构)
    - [pathname 和 view 的映射](#pathname-和-view-的映射)
    - [定义 searchData 和 hashData](#定义-searchdata-和-hashdata)
    - [定义 RouterParser](#定义-routerparser)
    - [在源头消化 RouterStore 为 ReduxStore](#在源头消化-routerstore-为-reduxstore)
    - [最后看看效果](#最后看看效果)
  - [提取公共代码](#提取公共代码)
    - [使用继承解决](#使用继承解决)
    - [定义 Resource 相关的抽象类型](#定义-resource-相关的抽象类型)
    - [定义 Resource 相关的 ActionHandler](#定义-resource-相关的-actionhandler)
    - [逐层泛化](#逐层泛化)
  - [下一个 Demo](#下一个-demo)

<!-- /TOC -->

### 运行

- `npm start` 以开发模式运行
- `npm run build` 以产品模式编译生成文件
- `npm run prod-express-demo` 以产品模式编译生成文件并启用一个 express 做 demo
- `npm run gen-icon` 自动生成 [iconfont](https://iconfont.cn) 文件及 ts 类型

### 查看在线 Demo

- [点击查看在线 Demo](http://react-coat.spa.teying.vip/)

- 或者手机扫码查看：
  ![在线 Demo](https://github.com/wooline/react-coat-spa-demo/blob/master/docs/imgs/qr.png)

### 项目背景

项目要求及说明请看：[第一站 Helloworld](https://github.com/wooline/react-coat-helloworld)，在第一站点，我们总结了某些`“美中不足”`，主要是 3 点：

- 路由控制需要更细粒度
- 路由参数需要 TS 类型检查
- 公共代码需要提取

### 路由控制需要更细粒度

> 某市场人员说：评论内容很吸引眼球，希望分享链接的时候，能指定某些评论

> 某脑洞大开的产品经理说，我希望你能在 android 手机上模拟原生 APP，点击手机工具栏的`“返回”`键，能撤销上一步操作，比如：点返回键能关闭弹窗。

所以每一步操作，都要用一条 URL 来驱动？那 URL 中要记录的东西可多了，比如：旅行路线详情+弹出评论弹窗+评论列表(最新、第 2 页)

[/photos/1/comments?comments-search={"articleId":"1","isNewest":true,"page":2}&photos-showComment=true](http://react-coat.spa.teying.vip/photos/1/comments?comments-search=%7B%22articleId%22%3A%221%22%2C%22isNewest%22%3Atrue%2C%22page%22%3A2%7D&photos-showComment=true)

看到这个长长的 URL，我们不禁想想路由的本质是什么？

- 路由是程序状态的切片。路由中包含的信息越多越细，程序的切片就能越多越细。
- 路由是程序的状态机。跟 ReduxStore 一样，路由也是一种 Store，我们可以称其为 RouterStore，它记录了程序运行的某些状态，只不过 ReduxStore 存在内存中，而 RouterStore 存在地址栏。

#### Router Store 概念

如果接受 RouterStore 这个概念，那我们程序中就不是单例 Store，而是两个 Store 了，可是 Redux 不是推荐单例 Store 么？两个 Store 那会不会把维护变复杂呢？

所以，我们要特殊一点看待 RouterStore，仅把它当作是 ReduxStore 的一种`冗余设计`。也就是说，“你大爷还是你大爷”，程序的运行还是围绕 ReduxStore 来展开，除了 router 信息的流入流出源头之外，你就当 RouterStore 不存在，RouterStore 中有的信息，ReduxStore 中全都有。

- RouterStore 是瞬时局部的，而 ReduxStore 是完整的。
- 程序中不要直接依赖 RouterStore 中的状态，而是依赖 ReduxStore 状态。
- 控制住 RouterStore 流入流出的源头，第一时间将其消化转换为 ReduxStore。
- RouterStore 是只读的。RouterStore 对程序本身是透明的，所以也不存在修改它。

#### Router Store 结构

RouterStore 有着与 ReduxStore 类似的结构。

- 首先，它是一个所有模块共用的 Store，每个模块都可以往这个 Store 中存取状态。
- 既然是公共 Store，就存在命名空间的管理。与 ReduxStore 一样，每个模块在 RouterStore 下面分配一个节点，模块可以在此节点中定义和维护自已的路由状态。
- 根据 URL 的结构，我们进一步将 RouterStore 细分为：pathData、searchData、hashData。比如：

```
/photos/1/comments?comments-search={"articleId":"1","isNewest":true,"page":2}&photos-showComment=true#app-forceRefresh=true

将这个 URL 反序列化为 RouterStore：

{
  pathData: {
    photos: {itemId: "1"},
    comments: {type: "photos", typeId: "1"},
  },
  searchData: {
    comments: {search: {articleId: "1", isNewest: true, page: 2}},
    photos: {showComment: true},
  },
  hashData: {
    app: {forceRefresh: true},
  },
}

```

从以上示例看出，为了解决命名空间的问题，在序列化为 URL 时，为每笔 key 增加了一个`moduleName-`作为前缀，而反序列化时，将该前缀去掉转换成 JS 的数据结构，当然这个过程是可以由某函数统一自动处理的。其它都好明白，就是`pathData`是怎么得来的？

```
/photos/1/comments

怎么得出：

pathData: {
    photos: {itemId: "1"},
    comments: {type: "photos", typeId: "1"},
}
```

#### pathname 和 view 的映射

对于同一个 pathname，我们 photos 模块分析得出的 pathData 是 {itemId: "1"}，而 comments 模块分析得出的 pathData 是 {type: "photos", typeId: "1"}，这是因为我们配置了 pathname 与 view 的映射规则：

```JS
// ./src/modules/index.ts

// 定义整站路由与 view 的匹配模式
export const viewToPath: {[K in keyof ModuleGetter]: {[V in keyof ReturnModule<ModuleGetter[K]>["views"]]+?: string}} = {
  app: {Main: "/"},
  photos: {Main: "/photos", Details: "/photos/:itemId"},
  videos: {Main: "/videos", Details: "/videos/:itemId"},
  messages: {Main: "/messages"},
  comments: {Main: "/:type/:typeId/comments", Details: "/:type/:typeId/comments/:itemId"},
};
```

一个 View 被映射为一个 pathname 正则，反过来也可以反向推导出 pathToView：

```JS
// ./src/common/routers.ts

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
```

好了，现在我们能根据以上的 pathToView，计算出当前有哪些 view 被展示，比如：/photos/1/comments，匹配这条 pathname 的有：

- "/": ["app", "Main"]
- "/photos": ["photos", "Main"]
- "/photos/:itemId": ["photos", "Details"],
- "/:type/:typeId/comments": ["comments", "Main"],

所以，当前被展示的 views 有：

```JS
{
  app: {Main: true},
  photos: {Main: true, Details: true},
  comments: {Main: true},
}
```

我们再也不用在程序中写死 pathname 了，比如：

```JS
// 原来写死的字符串 /photos
if(pathname === "/photos"){
  ....
}

// 变成强类型的
if(isCur(views, ModuleNames.photos, "Main")){
  ...
}

// 原来模块自已去写正则解析pathname
const arr = pathname.match(/^\/photos\/(\d+)$/);

// 变成集中统一处理，在使用时只需要引入强类型 PathData
pathData: {
    photos: {itemId: "1"},
    comments: {type: "photos", typeId: "1"},
}
```

**结论**

- 这样一来，我们既解决了代码中写死 pathname 的问题，又用 TS 强类型来规范了 pathname 中的参数，还可以让每个模块自由定义参数名称

#### 定义 searchData 和 hashData

RouterStore 是一个公共的 Store，每个模块都可以往里面存取信息，所以每个模块可以在自已内部规划和定义自已的路由结构，在反序列化时，由于会统一自动加上 moduleName 作前缀，所以也不用担心命名冲突。我们在上文：[第一站 Helloworld](https://github.com/wooline/react-coat-helloworld)中，提到过“参数默认值”的概念：

- 区分：原始路由参数(SearchData) 默认路由参数(SearchData) 和 完整路由参数(WholeSearchData)
- 完整路由参数(WholeSearchData) = merage(默认路由参数(SearchData), 原始路由参数(SearchData))
  - 原始路由参数(SearchData)每一项都是可选的，用 TS 类型表示为：`Partial<WholeSearchData>`
  - 完整路由参数(WholeSearchData)每一项都是必填的，用 TS 类型表示为：`Required<SearchData>`
  - 默认路由参数(SearchData)和完整路由参数(WholeSearchData)类型一致

所以，在模块中对于路由部分有两个工作要做：1.**定义路由结构**，2.**定义默认参数**，如：

```JS
// ./src/modules/photos/facade.ts

export const defRouteData: ModuleRoute<PathData, SearchData, HashData> = {
  pathData: {},
  searchData: {
    search: {
      title: "",
      page: 1,
      pageSize: 10,
    },
    showComment: false,
  },
  hashData: {},
};
```

所以，我们完整的 RouterStore 数据结构应当扩展为：

```js
{
  router: {
    location: { // 由 connected-react-router 生成
      pathname: '/photos/1/comments',
      search: '?comments-search=%7B%22articleId%22...&photos-showComment=true',
      hash: '',
      key: 'dw8hbu'
    },
    action: 'PUSH', // 由 connected-react-router 生成
    views: { // 根据 pathname 自动解析出当前展示哪些 module 的哪些 view
      app: {Main: true},
      photos: {Main: true, Details: true},
      comments: {Main: true}
    },
    pathData: { // 根据 pathname 自动解析出参数
      app: {},
      photos: {itemId: '1'},
      comments: {type: 'photos', typeId: '1'}
    },
    searchData: { // 根据 urlSearch 自动解析出参数
      comments: {search: {articleId: '1', isNewest: true, page: 2}},
      photos: {showComment: true}
    },
    hashData: {}, // 根据 urlHash 自动解析出参数
    wholeSearchData: { // urlSearch merge 默认参数后的完整数据
      comments: {search: {articleId: '1', isNewest: true, page: 2, pageSize: 10}},
      photos: {search: {title: "", page: 1, pageSize: 10}, showComment: true},
      app: {showSearch: false, showLoginPop: false, showRegisterPop: false }
    },
    wholeHashData: { //urlHash merge 默认参数后的完整数据
      app: {forceRefresh: null},
      photos: {},
      comments: {}
    }
  },
}
```

#### 定义 RouterParser

也就是说，我们根据：

> /photos/1/comments?comments-search={"articleId":"1","isNewest":true,"page":2}&photos-showComment=true#app-forceRefresh=true

这个简单的 URL 字符串，解析能得出上面那么大的一个路由数据结构。当然，这一切都是可以自动处理的，react-coat 提供了自定义路由解析 hook：

> export declare type RouterParser<T = any> = (nextRouter: T, prevRouter?: T) => T;

我们只要定义好这个 RouterParser，后面使用时就方便了，具体定义的代码见源文件：./src/common/routers.ts

#### 在源头消化 RouterStore 为 ReduxStore

前面说过，我们需要在第一时间将 RouterStore 转换为 ReduxStore，这个源头在哪里？就是监控路由变化了，react-coat 集成了 connected-react-router，在路由变化时会 dispatch `@@router/LOCATION_CHANGE` 这个 Action。而框架本身也支持观察者模式，监听一个 action 来执行 actionHandler，所以就简单了，只需要在模块中监听`@@router/LOCATION_CHANGE`就行，例如：

```JS
// ./src/modules/app/model.ts

// 定义本模块的Handlers
class ModuleHandlers extends BaseModuleHandlers<State, RootState, ModuleNames> {
  ...
  protected async parseRouter() {
    // this.rootState 指向整个 ReduxStore
    const searchData = this.rootState.router.wholeSearchData.app;
    this.updateState({
      showSearch: Boolean(searchData.showSearch),
    });
  }

  @effect(null)
  protected async ["@@router/LOCATION_CHANGE"]() {
    this.parseRouter();
  }

  // 模块第一次初始化时也需要
  @effect()
  protected async [ModuleNames.app + "/INIT"]() {
    this.parseRouter();

  }
}
```

#### 最后看看效果

- [旅行路线列表](http://react-coat.spa.teying.vip/photos)
- [旅行路线列表+搜索](http://react-coat.spa.teying.vip/photos?photos-search=%7B%22title%22%3A%22%u6D77%u5929%22%7D)
- [旅行路线详情](http://react-coat.spa.teying.vip/photos/1/comments?comments-search=%7B%22articleId%22%3A%221%22%7D)
- [旅行路线详情+评论列表(最新、第 2 页)](http://react-coat.spa.teying.vip/photos/1/comments?comments-search=%7B%22articleId%22%3A%221%22%2C%22isNewest%22%3Atrue%2C%22page%22%3A2%7D&photos-showComment=true)
- [旅行路线详情+评论详情](http://react-coat.spa.teying.vip/photos/1/comments/16?photos-showComment=true)

### 提取公共代码

路由问题告一段落，剩下还有一个大问题，就是如何提避免写重复的代码。在上文：[第一站 Helloworld](https://github.com/wooline/react-coat-helloworld)中提到：

> 注意到，photos/model.ts、videos/model.ts 中，90%的代码是一样的，为什么？因为它们两个模块基本上功能都是差不多的：列表展示、搜索、获取详情...

实际上，套用 RestFul 的理念，我们用网页交互的过程就是在对“资源 Resource”进行维护，无外乎“增删改查”这些基本操作，大部分情况下，它们的逻辑是相似的，由其是在后台管理系统中，很多都是 table+弹窗的交互方式。

#### 使用继承解决

继承和组合都可以用来抽象和提炼公共逻辑，因为 react-coat 支持 actionHandler 的继承，所以我们先尝试使用继承的方案来解决。

要继承，先得抽象基类。所有的操作对象都可以抽象为一个业务实体，或叫做资源 Resource，所有的操作抽象为增删改查。

#### 定义 Resource 相关的抽象类型

在 `./src/entity/resource.ts` 中，我们为 resource 统一定义了这些基本的抽象类型：

```JS
export interface Defined {
  State: {};
  SearchData: {};
  PathData: {};
  HashData: {};
  ListItem: {};
  ListSearch: {};
  ListSummary: {};
  ItemDetail: {};
  ItemEditor: {};
  ItemCreateData: {};
  ItemUpdateData: {};
  ItemCreateResult: {};
  ItemUpdateResult: {};
}

export type ResourceDefined = Defined & {
  State: BaseModuleState;
  PathData: {itemId?: string};
  ListItem: {
    id: string;
  };
  ListSearch: {
    page: number;
    pageSize: number;
  };
  ListSummary: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
  ItemDetail: {
    id: string;
  };
  ItemEditor: {
    type: EditorType;
  };
  ItemUpdateData: {
    id: string;
  };
  ItemCreateResult: DefaultResult<{id: string}>;
  ItemUpdateResult: DefaultResult<void>;
};

export interface Resource<D extends ResourceDefined = ResourceDefined> {
  ListItem: D["ListItem"];
  ListSearch: D["ListSearch"];
  ListSummary: D["ListSummary"];
  ListOptions: Partial<D["ListSearch"]>;
  ItemDetail: D["ItemDetail"];
  ItemEditor: D["ItemEditor"];
  ItemCreateData: D["ItemCreateData"];
  ItemUpdateData: D["ItemUpdateData"];
  ItemCreateResult: D["ItemCreateResult"];
  SearchData: D["SearchData"] & {search: D["ListSearch"]};
  HashData: D["HashData"];
  PathData: D["PathData"];
  State: D["State"] & {
    listItems?: Array<D["ListItem"]>;
    listSearch?: D["ListSearch"];
    listSummary?: D["ListSummary"];
    itemDetail?: D["ItemDetail"];
    itemEditor?: D["ItemEditor"];
    selectedIds?: string[];
  };
  API: {
    hitItem?(id: string): Promise<void>;
    getItemDetail?(id: string): Promise<D["ItemDetail"]>;
    searchList(request: D["ListSearch"]): Promise<{listItems: Array<D["ListItem"]>; listSummary: D["ListSummary"]}>;
    createItem?(request: D["ItemCreateData"]): Promise<D["ItemCreateResult"]>;
    updateItem?(request: D["ItemUpdateData"]): Promise<D["ItemUpdateResult"]>;
    deleteItems?(ids: string[]): Promise<void>;
  };
}
```

使用继承基类的好处：

- 一是代码和逻辑重用。
- 二是用 TS 类型来强制统一命名。searchList? queryList? getList?，好吧，都没错，不过还是统一名词比较好

#### 定义 Resource 相关的 ActionHandler

定义完抽象类型，就要定义抽象实现了，我们在 ./src/common/ResourceHandlers.ts 中为 Resource 定义了抽象的 ActionHandler 基类，无非就是增删改查，代码就不在此展示了，直接看源文件吧。

#### 逐层泛化

Resource 是我们定义的最基本的资源模型，适合广泛有增删改查操作的业务实体，在其之上对某些具体的特性，我们可以进一步抽象和提取。比如本 Demo 中的三种业务实体： Message、Photo、Video，它们都支持 title 的搜索条件，所以我们定义了 Article 继承于 Resource，而 Photo 相比 Video，多了可以控制评论的展示与隐藏，所以 Photo 又在 Article 上进一步扩展。使用继承简化后的 videos model 已经变得很简洁了：

```JS
// ./src/modules/videos/model.ts

export {State} from "entity/video";

class ModuleHandlers extends ArticleHandlers<State, VideoResource> {
  constructor() {
    super({api});
  }
  @effect()
  protected async [ModuleNames.videos + "/INIT"]() {
    await super.onInit();
  }
}
```

### 下一个 Demo

接下来在此基础上，我们需要演示一下如何同构开启服务器渲染(SSR)：

> [升级：SPA(单页应用)+SSR(服务器渲染)](https://github.com/wooline/react-coat-ssr-demo)

---

- [本 Demo 讨论提问专用贴](https://github.com/wooline/react-coat-spa-demo/issues/1)
- reac-coat 学习交流 QQ 群：**929696953**，有问题可以在群里问我
