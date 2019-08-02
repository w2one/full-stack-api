/**
 * show controller
 */
import mongoose from "mongoose";
const Show = mongoose.model("Show");

/**
 * 保存
 * @param {*} ctx
 * @param {*} next
 */
export const saveShow = async (ctx, next) => {
  const vo = ctx.request.body;
  const show = new Show(vo);
  const saveInfo = await show.save(); // 保存数据
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

/**
 * 变更
 * @param {*} ctx
 * @param {*} next
 */
export const updateShow = async (ctx, next) => {
  console.log("update");
  const vo = ctx.request.body;

  console.log("--------", vo);

  // const show = new Show(vo);
  const saveInfo = await Show.findByIdAndUpdate(vo._id, vo); // 保存数据
  // console.log(saveInfo);
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

/**
 * 查找
 * @param {*} ctx
 * @param {*} next
 */
export const findShows = async (ctx, next) => {
  const images = await Show.find({}); // 数据查询
  // if (infos.length) {
  ctx.body = images;
  // } else {
  // ctx.body = {
  // success: false
  // };
  // }
};

/**
 * 分页查找
 * @param {*} ctx
 * @param {*} next
 */
export const findShowList = async (ctx, next) => {
  const { page = 1, pageSize = 10 } = ctx.request.body;

  // 查询条件
  let total = await Show.find({}).count();

  let records = await Show.find({})
    .skip((page - 1) * pageSize)
    .limit(pageSize);

  ctx.body = {
    records,
    total
  };
};

/**
 * 根据id查找
 * @param {*} ctx
 * @param {*} next
 */
export const findShow = async (ctx, next) => {
  const show = await Show.findOne(
    { _id: ctx.params.id }
    // ,
    // "image link description"
  );
  ctx.body = show || [];
};

/**
 * 删除
 */
export const deleteShow = async ctx => {
  const { id } = ctx.request.body;
  const result = await Show.findOneAndRemove({ _id: id });
  ctx.body = true;
};
