/**
 * wechat
 */
/**
 * kao app
 */
const router = require("koa-router")();
const CryptoJS = require("crypto-js");
import { getToken } from "../service/wechat/token";
import { getTicket } from "../service/wechat/ticket";
import { requestGetUser, requestGetUserInfo } from "../service/wechat/user";
import { parseXML, reply } from "../service/wechat/message";
import {
  requestOauth2Access_token,
  requestAuthUserinfo
} from "../service/wechat/oAuth";
import { requestGetMunu, requestSetMenu } from "../service/wechat/menu";
import { create } from "../service/wechat/qrcode.js";
const getRawBody = require("raw-body");

import config from "../config";

import mongoose from "mongoose";
const WechatMenu = mongoose.model("wechatMenu");

export const saveWechatMenu = async (ctx, next) => {
  const data = ctx.request.body;

  const { parentId } = data;
  if (parentId) {
    const parentObj = await WechatMenu.findById({ _id: parentId });
    console.log("object");
    console.log(parentObj);
    parentObj.sub_button.push(data);
    parentObj.save();
  } else {
    console.log("-----------requestBody:" + data);
    const wechatMenu = new WechatMenu(data);
    //保存用户
    wechatMenu.save().then(
      function(data) {
        ctx.body = {
          success: true,
          userInfo: data
        };
      },
      function(error) {
        ctx.body = {
          success: false
        };
      }
    );
  }
};

router.post("/wechat/add", saveWechatMenu);

router.post("/wechat/menu/update", async (ctx, next) => {
  const data = ctx.request.body;
  console.log("objectaaa", data);
  const { parentId } = data;

  if (!parentId) {
    const updateData = await WechatMenu.findByIdAndUpdate(
      { _id: data._id },
      data
    );
    ctx.body = updateData;
  } else {
    const parentObj = await WechatMenu.findById({ _id: parentId });
    const index = parentObj.sub_button.findIndex(item => item._id == data._id);
    parentObj.sub_button.splice(index, 1, data);
    parentObj.save();
    ctx.body = {};
  }
});

router.get("/wechat/menu", async (ctx, next) => {
  const data = await WechatMenu.find({});

  ctx.body = data;
});

router.post("/wechat/menu/delete", async (ctx, next) => {
  const { parentId, id } = ctx.request.body;

  if (!parentId) {
    const data = await WechatMenu.findByIdAndDelete({ _id: id });
    ctx.body = data;
  } else {
    const parentObj = await WechatMenu.findById({ _id: parentId });
    const index = parentObj.sub_button.findIndex(item => item._id == id);
    parentObj.sub_button.splice(index, 1);
    parentObj.save();
    ctx.body = {};
  }
});

router.post("/wechat/menu/asyncWechatMenu", async (ctx, next) => {
  // const { id } = ctx.request.body;
  // console.log(ctx.request.body);
  const menus = await WechatMenu.find({});

  const data = {
    button: menus
  };

  const response = requestSetMenu(data);

  // new Promise(function(resolve, reject) {
  //   let url =
  //     "https://api.weixin.qq.com/cgi-bin/menu/create?access_token=ACCESS_TOKEN";
  //   url = url.replace("ACCESS_TOKEN", ACCESS_TOKEN);

  //   request(
  //     {
  //       url: url,
  //       method: "post",
  //       body: JSON.stringify(m)
  //     },
  //     (error, response, body) => {
  //       console.log(body);
  //       if (!error && response.statusCode == 200) {
  //         try {
  //           resolve(body);
  //         } catch (e) {
  //           reject(e);
  //         }
  //       } else {
  //         reject(error);
  //       }
  //     }
  //   );
  // });

  ctx.body = response;
});

/**
 * 微信连接检查
 * 请填写接口配置信息，此信息需要你有自己的服务器资源，填写的URL需要正确响应微信发送的Token验证
 */
router.get("/wechat/wx", async ctx => {
  console.log("~~~wx~~~");
  let signature = ctx.request.query.signature;
  let echostr = ctx.request.query.echostr;
  let timestamp = ctx.request.query.timestamp;
  let nonce = ctx.request.query.nonce;
  console.log(signature, echostr, timestamp, nonce);
  let token = "mynameisjay";
  // 1）将token、timestamp、nonce三个参数进行字典序排序
  let list = [token, timestamp, nonce].sort();
  // 2）将三个参数字符串拼接成一个字符串进行sha1加密
  let str = list.join("");
  let result = CryptoJS.SHA1(str).toString();
  if (result === signature) {
    ctx.body = echostr; // 返回微信传来的echostr，表示校验成功，此处不能返回其它
  } else {
    ctx.body = false;
  }
});

/**
 * 回复消息
 */
router.post("/wechat/wx", async ctx => {
  // 解析返回的消息xml
  const xml = await getRawBody(ctx.req, {
    length: ctx.request.length,
    limit: "1mb",
    encoding: ctx.request.charset || "utf-8"
  });
  console.log(2);
  const formatted = await parseXML(xml);
  console.log("sss");
  const replyMessageXml = reply(
    formatted.Content || "test",
    formatted.ToUserName,
    formatted.FromUserName
  );
  console.log(replyMessageXml);
  return (ctx.body = replyMessageXml);
});

/**
 * 获取token
 */
router.get("/wechat/token", async ctx => {
  console.log("~~~get token~~~");
  let data = await getToken();
  ctx.body = data;
});

/**
 * 获取ticket
 */
router.get("/wechat/ticket", async ctx => {
  console.log("~~~get ticket~~~");
  let data = await getTicket();
  console.log("test", data);
  ctx.body = data;
});

/**
 * 用户详情
 */
router.get("/wechat/user/:OPENID", async ctx => {
  const { OPENID } = ctx.params;
  console.log("xxxxobject", OPENID);
  let data = await requestGetUserInfo(OPENID);
  ctx.body = data;
});

/**
 * 用户列表
 */
router.get("/wechat/user", async ctx => {
  console.log("~~~get ticket~~~");
  let data = await requestGetUser();
  ctx.body = data;
});

// --------------------------
/**
 * 获取微信分享签名
 */
router.get("/wechat/wxShare", async ctx => {
  console.log("~~~wx share~~~");

  let jsapi_ticket = await getTicket();
  let nonce_str = Math.random()
    .toString(36)
    .substr(2, 15);
  let timestamp = parseInt(new Date().getTime() / 1000) + "";
  let url = ctx.request.query.url;

  let str =
    "jsapi_ticket=" +
    jsapi_ticket +
    "&noncestr=" +
    nonce_str +
    "&timestamp=" +
    timestamp +
    "&url=" +
    url;
  let signature = CryptoJS.SHA1(str).toString();

  let data = {
    appId: config.wechat.appId,
    timestamp: timestamp,
    nonceStr: nonce_str,
    signature: signature
  };
  ctx.body = data;
});

/**
 * auth
 * snsapi_userinfo
 */
router.get("/wechat/auth", async ctx => {
  const code = ctx.request.query.code;
  console.log("------auth----" + code);
  //第二步：通过code换取网页授权access_token
  const data = await requestOauth2Access_token(code);
  // console.log('data',JSON.stringify(data))
  const { access_token, openid } = JSON.parse(data);
  console.log("xxxxxx", access_token, openid);
  //第四步：拉取用户信息(需scope为 snsapi_userinfo)
  const userInfo = await requestAuthUserinfo(access_token, openid);
  console.log("aaaaaaa", JSON.stringify(userInfo));
  ctx.body = userInfo;
});

/**
 * auth
 * base
 */
router.get("/wechat/authBase", async ctx => {
  const code = ctx.request.query.code;
  console.log("------auth----" + code);
  //第二步：通过code换取网页授权access_token
  const data = await requestOauth2Access_token(code);
  // console.log('data',JSON.stringify(data))
  const { openid } = JSON.parse(data);
  ctx.body = { openid };
});

/**
 * get menu
 */
router.get("/wechat/getMenu", async ctx => {
  let token = await getToken();
  const menu = await requestGetMunu(token);
  ctx.body = menu;
});

/**
 * create menu
 */
router.post("/wechat/setMenu", async ctx => {
  let m = "";
  console.log(ctx.request.body);
  try {
    // m = JSON.parse(ctx.request.body);
    m = ctx.request.body;
    console.log("------setMenu----" + m);
  } catch (error) {
    console.log("------error----" + error);
  }

  let token = await getToken();
  m = m || {
    button: [
      { type: "click", name: "Button", key: "11", sub_button: [] },
      {
        type: "view",
        name: "iMusic",
        url:
          "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx8dfda79a073efa18&redirect_uri=http://jay.aliyuntao.top/wx_oauth.html&response_type=code&scope=snsapi_userinfo&state=imusic",
        sub_button: []
      },
      {
        name: "菜单",
        sub_button: [
          {
            type: "scancode_push",
            name: "扫二维码",
            key: "31",
            sub_button: []
          },
          {
            type: "location_select",
            name: "获取地址",
            key: "32",
            sub_button: []
          },
          {
            type: "view",
            name: "公交卡余额查询",
            url:
              "http://shanghaicity.openservice.kankanews.com/public/traffic/jtkye",
            sub_button: []
          },
          {
            type: "view",
            name: "活动",
            url: "http://jay.aliyuntao.top/swiper/",
            sub_button: []
          }
        ]
      }
    ]
  };
  const menu = await requestSetMenu(token, m);
  console.log("aaaaaaa", JSON.stringify(menu));
  ctx.body = menu;
});

// const requestSetMenu = async (ACCESS_TOKEN, m) =>
//   new Promise(function(resolve, reject) {
//     let url =
//       "https://api.weixin.qq.com/cgi-bin/menu/create?access_token=ACCESS_TOKEN";
//     url = url.replace("ACCESS_TOKEN", ACCESS_TOKEN);

//     request(
//       {
//         url: url,
//         method: "post",
//         body: JSON.stringify(m)
//       },
//       (error, response, body) => {
//         console.log(body);
//         if (!error && response.statusCode == 200) {
//           try {
//             resolve(body);
//           } catch (e) {
//             reject(e);
//           }
//         } else {
//           reject(error);
//         }
//       }
//     );
//   });

/**
 * 创建二维码
 */
router.get("/wechat/qrcode", async ctx => {
  console.log("~~~qrcode~~~");
  let token = await getToken();
  let data = await create(token, {
    expire_seconds: 604800,
    action_name: "QR_SCENE",
    action_info: { scene: { scene_id: 123 } }
  });
  ctx.body = data;
});

export default router;
