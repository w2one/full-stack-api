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
  const { username, password } = ctx.request.body;
  // username password
  const user = await findUserByUsername(username);
  console.log("login---", user);
  if (user && password === user.password) {
    const token = encode({
      id: user.id
    });
    console.log(token);
    ctx.body = token;
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

  const user = await User.findOne({ openId: openid });
  if (user) {
    const token = encode({
      id: user.id
    });
    console.log(token);
    ctx.body = { token };
  } else {
    ctx.body = { openId: openid };
  }
}

/**
 * 注册
 * @param {*} ctx
 */
export async function register(ctx) {
  const { username, password, openId = "" } = ctx.request.body;
  const user = await findUserByUsername(username);
  if (user) {
    ctx.throw({
      statusCode: 200,
      message: "账号已存在"
    });
  } else {
    const newUser = new User({
      username,
      password,
      openId
    });
    //保存用户
    await newUser.save();
    ctx.body = {
      success: true
    };
  }
}
