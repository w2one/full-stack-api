/**
 * dict schema
 */
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const BannerSchema = new Schema({
  link: String,
  image: String,
  description: String,
  meta: {
    createdAt: {
      type: Date,
      default: Date.now()
    },
    updatedAt: {
      type: Date,
      default: Date.now()
    }
  }
});

// 在保存数据之前跟新日期
BannerSchema.pre("save", function(next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now();
  } else {
    this.meta.updatedAt = Date.now();
  }
  next();
});

// 建立数据模型
mongoose.model("Banner", BannerSchema);
