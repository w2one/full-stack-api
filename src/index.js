/**
 * index
 */

const Koa = require("koa");
import KoaStatic from "koa-static";
import Router from "koa-router";
import bodyParser from "koa-bodyparser";

import { verify } from "./utils/token";

const app = new Koa();

// cors
app.use(async (ctx, next) => {
  ctx.set("Access-Control-Allow-Origin", "*");
  ctx.set("Access-Control-Allow-Methods", "PUT,DELETE,POST,GET");
  ctx.set("Access-Control-Max-Age", 3600 * 24);
  ctx.set("Access-Control-Allow-Credentials", true);
  //ctx.set("Access-Control-Allow-Headers", "*");
  ctx.set("Access-Control-Allow-Headers", "token,Content-Type");//移动端需指定
  
  await next();
});

import { database } from "./mongodb";
database();

import GraphqlRouter from "./router";
import wechatRouter from "./controller/wechat";
import analyticsRouter from "./controller/analytics";
import bannerRouter from "./controller/banner";

const router = new Router();

app.use(bodyParser());
app.use(KoaStatic(__dirname + "/public"));

router.get("/test", (ctx, next) => {
  ctx.body = "test page";
});

// 返回数据处理
const fnResult = async (ctx, next) => {
  try {
    await next();
    // if (!ctx.url.includes("/graphql")) {
    console.log("数据处理", ctx.response.body);
    if (!ctx.url.includes("/wechat/wx")) {
      ctx.body = {
        code: 0,
        message: "success",
        data: ctx.response.body
      };
    }
    // }
  } catch (err) {
    // console.log("xxxxxxxxxxxxxxx", err);
    // ctx.response.status = err.statusCode || err.status || 500;
    ctx.response.status = 200;
    ctx.response.body = {
      code: 1,
      error: err.message
    };
  }
};
app.use(fnResult);

// token验证
app.use(async (ctx, next) => {
  if (ctx.request.method === "OPTIONS") {
    return (ctx.response.status = 200);
  }
  if (
    ctx.url.includes("login") ||
    ctx.url.includes("wechatLogin") ||
    ctx.url.includes("register") ||
    ctx.url.includes("/show/") ||
    ctx.url.includes("/wechat") ||
    ctx.url.includes("/analytics")
  ) {
    await next();
  } else {
    const { token } = ctx.headers;
    // console.log(token);
    try {
      const v = verify(token);
      console.log("解析token", v.value);
      // 获取用户信息
      ctx.request.body.user = {
        ...v.value
      };
      // 验证token
      await next();
    } catch (error) {
      // console.log("error", error);
      ctx.throw({
        message: "token失效"
      });
      next();
    }
  }
});

app.use(router.routes()).use(router.allowedMethods());

router.use(GraphqlRouter.routes());
router.use(wechatRouter.routes());
router.use(analyticsRouter.routes());
router.use(bannerRouter.routes());

const port = 4000;
app.listen(port, () => {
  console.log("🚀 server started, bind port %d", port);
});
