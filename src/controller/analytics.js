/**
 * 行为分析路由
 */

import mongoose from "mongoose";
const Point = mongoose.model("Point");
const Track = mongoose.model("Track");

import xlsx from "node-xlsx";
const fs = require("fs");

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

/**
 * 所有数据
 */
router.post("/analytics/track/all", async ctx => {
  const data = await Track.find({});
  ctx.body = data;
});

/**
 * 导出excel
 */
router.get("/analytics/track/exportexcel2", async ctx => {
  const data = [
    [1, 2, 3],
    [true, false, null, "sheetjs"],
    ["foo", "bar", new Date("2014-02-19T14:30Z"), "0.3"],
    ["baz", null, "qux"]
  ];
  const buffer = xlsx.build([{ name: "mySheetName", data: data }]);
  // let buffer = await generateExcel();
  ctx.set("Content-Type", "application/vnd.openxmlformats");
  ctx.set("Content-Disposition", "attachment; filename=" + "Report.xlsx");
  ctx.body = buffer; // 返回在响应体里
});

/**
 * download excel
 */
router.get("/analytics/track/exportexcel", async ctx => {
  const data = await Track.find({});
  const array = data.reduce((acc, item) => {
    acc.push([item.url, item.method, item.in, item.out]);
    return acc;
  }, []);

  const buffer = xlsx.build([{ name: "mySheetName", data: array }]);
  ctx.set("Content-Type", "application/vnd.openxmlformats");
  ctx.set("Content-Disposition", "attachment; filename=" + "Report.xlsx");
  ctx.body = buffer;
});

async function generateExcel() {
  return new Promise(function(resolve, reject) {
    const data = [
      [1, 2, 3],
      [true, false, null, "sheetjs"],
      ["foo", "bar", new Date("2014-02-19T14:30Z"), "0.3"],
      ["baz", null, "qux"]
    ];
    const buffer = xlsx.build([{ name: "mySheetName", data: data }]);

    resolve(buffer);
  });
}

export default router;
