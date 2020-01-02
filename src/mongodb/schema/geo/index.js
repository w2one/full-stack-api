/**
 * geo schema
 */
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const GeoSchema = new Schema({
  avatarUrl: String,
  nickName: String,
  city: String,
  country: String,
  gender: Number,
  ip: String,
  language: String,
  latitude: Number,
  longitude: Number,
  nickName: String,
  province: String,
  adcode: Number,
  nation: String,
  city: String,
  addr: String,
  ip: String,
  createDate: { type: Date, default: Date.now() }
});

// 在保存数据之前跟新日期
// GeoSchema.pre("save", function(next) {
//   this.meta.updatedAt = Date.now();
//   next();
// });

// 建立数据模型
mongoose.model("Geo", GeoSchema);
