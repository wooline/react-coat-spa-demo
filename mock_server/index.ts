import * as bodyParser from "body-parser";
import * as chalk from "chalk";
import * as connect from "connect";
import * as cookieParser from "cookie-parser";
import * as session from "express-session";
import * as http from "http";
import * as cookie from "ramda";
import * as serveStatic from "serve-static";
import * as url from "url";

import api from "./api";

export class Request {
  public getData: { [key: string]: any };
  public postData: { [key: string]: any };
  constructor(public request: http.IncomingMessage, public response: http.ServerResponse) {
    const urlData = url.parse(request.url || "", true);
    this.getData = urlData.query;
    this.postData = request["body"];
  }
  getIP(): string {
    const req = this.request;
    return req.headers["x-forwarded-for"] || req["connection"].remoteAddress || req.socket.remoteAddress || "0.0.0.0";
  }
  getCookie(): { [key: string]: string } | null {
    return this.request["cookies"];
  }
  setCookie(name: string, val?: string, options?) {
    // var signed = 's:' + signature.sign(val, secret);
    let data;
    if (val === undefined) {
      data = name;
    } else {
      options = options || { path: "/" };
      data = cookie.serialize(name, val, options);
    }
    const prev = this.response.getHeader("set-cookie") || [];
    const header = Array.isArray(prev) ? prev.concat(data) : Array.isArray(data) ? [prev].concat(data) : [prev, data];
    this.response.setHeader("set-cookie", header);
  }
  responseHtml(data: string, code = 200, headers = {}) {
    this.response.setHeader("Content-Type", "text/html; charset=utf-8");
    this.response.writeHead(code, headers);
    this.response.end(String(data));
  }
  responseData(data: any, code = 200, headers = {}) {
    this.response.setHeader("Content-Type", "application/json; charset=utf-8");
    this.response.writeHead(code, headers);
    this.response.end(JSON.stringify(data));
  }
  setHeader(name, value) {
    this.response.setHeader(name, value);
  }
}

connect()
  .use(
    serveStatic("./static", {
      index: false,
      redirect: false,
      fallthrough: true,
      setHeaders: function(res, path) {
        res.setHeader("Access-Control-Allow-Origin", "*");
      }
    })
  )
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: false }))
  .use(cookieParser("test"))
  .use(
    session({
      secret: "test",
      resave: false,
      saveUninitialized: true
    })
  )
  .use((req, res, next) => {
    const arr = req.url.split("?");
    const fun = api[arr[0]];
    if (fun) {
      fun(new Request(req, res));
    } else {
      next({ message: req.headers.host + req.url + " not found!" });
    }
  })
  .use((err, req, res, next) => {
    res.writeHead(err.status || 404);
    res.end(err.message || "not found");
  })
  .listen(3344);

console.info("\n\n starting mock server on", chalk.yellow.bold("3344"), "\n\n");
