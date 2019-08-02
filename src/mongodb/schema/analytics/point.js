/**
 * point schema
 */
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const PointSchema = new Schema({
  action: String,
  url: String,
  referrer: String,
  sw: String,
  sh: String,
  lang: String,
  ip: String,
  createDate: { type: Date, default: Date.now() }
});

// 在保存数据之前跟新日期
// PointSchema.pre("save", function(next) {

//     this.meta.updatedAt = Date.now();
//   next();
// });

// 建立数据模型
mongoose.model("Point", PointSchema);
