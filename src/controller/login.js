/**
 * login
 */
import { decode, verify, encode } from "../utils/token";
import { findUserByUsername } from "./user";
import mongoose from "mongoose";
const User = mongoose.model("User");

import {
  requestOauth2Access_token,
  requestAuthUserinfo
} from "../service/wechat/oAuth";

export async function login(ctx) {
  const { username, password, openId } = ctx.request.body;
  // username password
  // openId 已绑定判断
  let user;
  user = await findUserByUsername(username);
  // if (openId) {
  //   user = await findUserByUsername(openId, username);

  // } else {
  //   user = await findUserByUsername(username);
  // }

  console.log("login---", user);
  if (user && password === user.password) {
    if (openId) {
      if (user.openId) {
        console.log("x111111111", user.openId);
        if (user.openId === openId) {
          const token = encode({
            id: user.id
          });
          console.log(token);
          ctx.body = token;
        } else {
          ctx.throw({
            statusCode: 200,
            message: "该账号已绑定微信"
          });
        }
      } else {
        user.openId = openId;
        // 保存
        await user.save();
        const token = encode({
          id: user.id
        });
        console.log(token);
        ctx.body = token;
      }
    } else {
      const token = encode({
        id: user.id
      });
      console.log(token);
      ctx.body = token;
    }
  } else {
    // 怎么处理 TODO
    ctx.throw({
      statusCode: 200,
      message: "账号或密码错误"
    });
  }
}

/**
 * 微信登录
 * @param {*} ctx
 */
export async function wechatLogin(ctx) {
  console.log("微信登录");
  // const { code } = ctx.query;
  const code = ctx.request.query.code;
  console.log("------auth----" + code);
  // console.log(code);
  // 根据code获取openId

  // const code = ctx.request.query.code;
  console.log("------auth----" + code);
  //第二步：通过code换取网页授权access_token
  const data = await requestOauth2Access_token(code);
  // console.log('data',JSON.stringify(data))
  const { access_token, openid } = JSON.parse(data);

  if (!openid) {
    ctx.throw({
      statusCode: 200,
      message: "缺少openId"
    });
  }
  console.log("xxxxxx", access_token, openid);
  //第四步：拉取用户信息(需scope为 snsapi_userinfo)
  const userInfo = await requestAuthUserinfo(access_token, openid);
  console.log("aaaaaaa", JSON.stringify(userInfo));
  // ctx.body = userInfo;

  const user = await User.findOne({
    openId: openid
  });

  if (user) {
    const token = encode({
      id: user.id
    });
    console.log(token);
    ctx.body = {
      token
    };
  } else {
    ctx.body = {
      openId: openid
    };
  }
}

/**
 * 注册
 * @param {*} ctx
 */
export async function register(ctx) {
  const { mobile: username, password, code, openId = "" } = ctx.request.body;

  // 验证手机验证码 先写死 666666
  if (code !== "666666") {
    ctx.throw({
      statusCode: 200,
      message: "手机验证码错误"
    });
  }

  const user = await findUserByUsername(username);

  if (user) {
    ctx.throw({
      statusCode: 200,
      message: "手机号已存在"
    });
  } else {
    const newUser = new User({
      username,
      password,
      openId,
      source: "client" //默认client端
    });
    //保存用户
    await newUser.save();
    ctx.body = {
      success: true
    };
  }
}

/**
 * 获取用户信息
 * @param {*} ctx
 */
export async function getUserInfo(ctx) {
  const userInfo = ctx.request.body.user;
  console.log(userInfo);

  const user = await User.findById({ _id: userInfo.id });
  if (user) {
    delete user.password;
    const { username, headImgUrl = "" } = user;

    ctx.body = {
      username,
      headImgUrl
    };
  } else {
    ctx.throw({
      statusCode: 200,
      message: "未找到"
    });
  }
}
