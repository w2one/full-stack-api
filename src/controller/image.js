/**
 * 图片
 */
import mongoose from "mongoose";
const Image = mongoose.model("Image");

/**
 * 保存image信息
 * @param {*} ctx
 * @param {*} next
 */
export const saveImage = async (ctx, next) => {
  // 获取请求的数据
  const opts = ctx.request.body;
  const image = new Image(opts);
  const saveInfo = await image.save(); // 保存数据
  console.log(saveInfo);
  // 简单判断一下 是否保存成功，然后返回给前端
  if (saveInfo) {
    ctx.body = {
      success: true,
      info: saveInfo
    };
  } else {
    ctx.body = {
      success: false
    };
  }
};

// 获取所有banner数据
export const findImages = async (ctx, next) => {
  const images = await Image.find({}, "image link description"); // 数据查询
  // if (infos.length) {
  ctx.body = images;
  // } else {
  // ctx.body = {
  // success: false
  // };
  // }
};

export const findImage = async (ctx, next) => {
  const image = await Image.findOne(
    { _id: ctx.params.id },
    "image link description"
  );
  ctx.body = image || [];
};
