/**
 * track schema
 */
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const TrackSchema = new Schema({
  time: Number, // 停留时间
  pre: String, // 前一个页面
  current: String, // 当前页面
  next: String, //下一个页面
  sw: Number, //屏幕宽度
  sh: Number, // 屏幕高度
  lang: String, //语言
  ua: String, // ua
  ip: String, //ip
  url: String,
  method: String,
  in: String,
  out: String,
  createDate: { type: Date, default: Date.now() }
});

// 在保存数据之前跟新日期
// PointSchema.pre("save", function(next) {
//     this.meta.updatedAt = Date.now();
//   next();
// });

// 建立数据模型
mongoose.model("Track", TrackSchema);
