/**
 * daka schema
 */
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const DakaSchema = new Schema({
  avatarUrl: String,
  city: String,
  country: String,
  gender: Number,
  language: String,
  latitude: Number,
  longitude: Number,
  nickName: String,
  province: String,
  createDate: { type: Date, default: Date.now() }
});

// 在保存数据之前跟新日期
// PointSchema.pre("save", function(next) {
//     this.meta.updatedAt = Date.now();
//   next();
// });

// 建立数据模型
mongoose.model("Daka", DakaSchema);
