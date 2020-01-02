/**
 * banner
 */

import mongoose from "mongoose";
const Geo = mongoose.model("Geo");
const router = require("koa-router")();
import { sendMsg } from "../utils/dingding";

/**
 * save
 */
router.post("/geo/save", async ctx => {
  const data = ctx.request.body;

  try {
    data.longitude = data.lng;
    data.latitude = data.lat;
    data.ip = getClientIP(ctx.req);
    data.nickName = "h5";
  } catch (error) {
    console.log(error);
  }
  // console.log(data);

  sendMsg(data);
  const geo = new Geo(data);
  const result = await geo.save();
  console.log("result", result);
  ctx.body = result;
});

/**
 * @getClientIP
 * @desc 获取用户 ip 地址
 * @param {Object} req - 请求
 */
function getClientIP(req) {
  let ip =
    req.headers["x-real-ip"] ||
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress ||
    "";
  if (ip.split(",").length > 0) {
    ip = ip.split(",")[0];
  }
  return ip;
  // req.headers["x-forwarded-for"] || // 判断是否有反向代理 IP
  // req.connection.remoteAddress || // 判断 connection 的远程 IP
  // req.socket.remoteAddress || // 判断后端的 socket 的 IP
  // req.connection.socket.remoteAddress
}

/**
 * query
 */
router.get("/geo/query", async ctx => {
  const result = await Geo.find({ longitude: { $gt: 1 } });
  ctx.body = result;
});

export default router;
