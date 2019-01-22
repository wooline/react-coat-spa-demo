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

### 运行

- `npm start` 以开发模式运行
- `npm run build` 以产品模式编译生成文件
- `npm run prod-express-demo` 以产品模式编译生成文件并启用一个 express 做 demo
- `npm run gen-icon` 自动生成 [iconfont](https://iconfont.cn) 文件及 ts 类型

### 查看在线 Demo

- [点击查看在线 Demo](http://react-coat.spa.teying.vip/)

- 或者手机扫码查看：
  ![在线 Demo](https://github.com/wooline/react-coat-spa-demo/blob/master/docs/imgs/qr.png)

#### 细粒度的路由控制

- [旅行路线列表](http://react-coat.spa.teying.vip/photos)
- [旅行路线列表+搜索](http://react-coat.spa.teying.vip/photos?photos-search=%7B%22title%22%3A%22%u6D77%u5929%22%7D)
- [旅行路线详情](http://react-coat.spa.teying.vip/photos/1/comments?comments-search=%7B%22articleId%22%3A%221%22%7D)
- [旅行路线详情+评论列表(最新、第 2 页)](http://react-coat.spa.teying.vip/photos/1/comments?comments-search=%7B%22articleId%22%3A%221%22%2C%22isNewest%22%3Atrue%2C%22page%22%3A2%7D&photos-showComment=true)
- [旅行路线详情+评论详情](http://react-coat.spa.teying.vip/photos/1/comments/16?photos-showComment=true)

---

## 整理中。。。。

- [本 Demo 讨论提问专用贴](https://github.com/wooline/react-coat-spa-demo/issues/1)
- reac-coat 学习交流 QQ 群：**929696953**，有问题可以在群里问我
