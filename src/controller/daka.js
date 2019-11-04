/**
 * banner
 */

import mongoose from "mongoose";
const Daka = mongoose.model("Daka");
const router = require("koa-router")();
import { sendMsg } from "../utils/dingding";

/**
 * create
 */
router.post("/daka/save", async ctx => {
  const data = ctx.request.body;
  //   console.log("打卡", data);

  sendMsg(data);

  const daka = new Daka(data);
  const result = await daka.save();
  ctx.body = result;

  //   if (!data._id) {
  //     const banner = new Banner(data);
  //     const result = await banner.save();
  //     ctx.body = result;
  //   } else {
  //     const saveInfo = await Banner.findByIdAndUpdate(data._id, data); // 保存数据
  //     ctx.body = saveInfo;
  //   }
});

/**
 * 打开数据全导出
 */
router.get("/daka/export", async ctx => {
  // const data = ctx.request.body;
  const result = await Daka.find({ longitude: { $gt: 1 } });
  console.log(result);
  ctx.body = result;
});

export default router;
