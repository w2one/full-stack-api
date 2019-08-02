/**
 * 行为分析路由
 */

import mongoose from "mongoose";
const Point = mongoose.model("Point");
const Track = mongoose.model("Track");

const router = require("koa-router")();

/**
 * 保存埋点
 * @param {*} ctx
 */
export const savePointData = async ctx => {
  const data = ctx.query;
  data.ip = getClientIP(ctx.req);
  const point = new Point(data);
  point.save();
};

/**
 * @getClientIP
 * @desc 获取用户 ip 地址
 * @param {Object} req - 请求
 */
function getClientIP(req) {
  return (
    req.headers["x-forwarded-for"] || // 判断是否有反向代理 IP
    req.connection.remoteAddress || // 判断 connection 的远程 IP
    req.socket.remoteAddress || // 判断后端的 socket 的 IP
    req.connection.socket.remoteAddress
  );
}

router.get("/analytics", savePointData);

/**
 * 埋点查询
 */
router.post("/analytics/point/query", async ctx => {
  const data = await Point.find({});
  ctx.body = data;
});

/**
 * 保存轨迹
 */
router.get("/analytics/track", async ctx => {
  const data = ctx.query;
  data.ip = getClientIP(ctx.req);
  const track = new Track(data);
  track.save();
});

/**
 * 轨迹查询
 * db.tracks.aggregate([{$group : {_id : "$current", total : {$sum : 1}}}])

   db.getCollection('tracks').find({})
 */
router.post("/analytics/track/query", async ctx => {
  const data = await Track.aggregate([
    // { $match: { createDate: { $lt: new Date("2019-9-31") } } },
    { $group: { _id: "$current", total: { $sum: 1 } } }
  ]);
  ctx.body = data;
});

export default router;
