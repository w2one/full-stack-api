/**
 * banner
 */

import mongoose from "mongoose";
const Banner = mongoose.model("Banner");
const router = require("koa-router")();

/**
 * create
 */
router.post("/banner/save", async ctx => {
  const data = ctx.request.body;
  if (!data._id) {
    const banner = new Banner(data);
    const result = await banner.save();
    ctx.body = result;
  } else {
    const saveInfo = await Banner.findByIdAndUpdate(data._id, data); // 保存数据
    ctx.body = saveInfo;
  }
});

/**
 * update
 */
router.post("/banner/update", async ctx => {
  const data = ctx.query;
  const banner = new Banner(data);
  const result = await banner.save();
  ctx.body = result;
});

/**
 * query
 */
router.post("/banner/query", async ctx => {
  // const data = ctx.query;
  const result = await Banner.find({});
  ctx.body = result;
});

/**
 * delete
 */
router.post("/banner/delete", async ctx => {
  const data = ctx.query;
  const banner = new Banner(data);
  const result = await banner.save();
  ctx.body = result;
});

export default router;
