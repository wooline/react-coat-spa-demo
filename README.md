### 关于 react-coat

> 请先了解：[react-coat](https://github.com/wooline/react-coat)

* 集成"history", "react-router-redux", "react-router-dom", "redux-saga"
* 精简而自然的 API 语法，几乎不用学习即可上手
* 微框架，源码不到 500 行，编译成 ES5 并压缩后仅 11k 左右
* 无强侵入性，仅为 redux 的糖衣外套，不改变其本身逻辑
* 业务模块化，可独立打包和按需加载
* 使用 typescript，所有 state 和 action 都可以做类型推断

### 关于本 Demo

* 本 Demo 作为 react-coat 框架的 Hello world 示例，可直接看源码和注释，简单易懂
* 本 Demo 直接使用 `create-react-app` v1.5.2 命令创建，更改了少量 webpack 配置，并保留了其原始文件，方便用户对比和升级
* 本 Demo 使用 typescript 开发，但你也可以使用 ES6 原生 JS

### 运行本 Demo

* 请直接 clone 或下载本项目。
* `yarn install`
* `yarn start`
* 本 Demo 使用 vscode 作为 IDE 开发工具，如果你也选择它，你可以安装以下插件来辅助开发：
  ![react-coat IDE](https://github.com/wooline/react-coat-demo-simple/blob/master/docs/imgs/ide.gif)

本项目基本目录结构如下

```
src
├── core
│       └── RootState  \\定义全局的State类型
├── modules  \\存放业务模块
│       ├── todos  \\todos的业务模块
│       ├── product  \\product的业务模块
│       ├── admin  \\admin的业务模块
│       │
│       └── app  \\入口模块
│             ├── api
│             │     ├── session.ts
│             │     └── settings.ts
│             ├── views
│             │     ├── Login.tsX
│             │     ├── Main.tsx
│             │     └── index.ts
│             ├── model.ts
│             ├── index.ts
│             └── actionNames.ts
└── index.tsx  \\入口文件
```

* src/modules/app/views/Main.tsx 里面做访问权限控制和一级路由
* src/modules/admin/views/Main.tsx 里面做二级路由

### 如何添加一个新 Module

1.  copy 一个业务模块目录并更名为新模块名，例如`src/modules/newModule`
2.  在`src/modules/newModule/actionNames.ts`中更改 Namespace 和 ActionName
3.  在`src/modules/newModule/model.ts`中定义本模块的 State 和 Actions 等
4.  在`src/modules/newModule/views`目录中创建 react 组件
5.  在`src/core/RootState.ts`中导入新模块的 State 类型

### 更复杂一点的 Demo

> [使用 react-coat 重构 antd-pro](https://github.com/wooline/react-coat-antd)

### 后记

> 欢迎各位高人批评指正，觉得还不错的别忘了给个`Star` >\_<，如有错误或 Bug 请反馈或 Email：wooline@qq.com
