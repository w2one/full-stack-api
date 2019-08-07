/**
 * user schema
 */
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: String,
  password: String,
  openId: String, // 微信openId
  mobile: String,
  nickname: String,
  email: String,
  headImgUrl: String,
  sex: String,
  birthday: Date,
  link: String,
  description: String,
  salt: String,
  loginNum: Number,
  enabled: Number,
  source: String,
  pswChangeDate: {
    type: Date,
    default: Date.now()
  },
  firstLogin: {
    type: Date,
    default: Date.now()
  },
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
UserSchema.pre("save", function(next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now();
  } else {
    this.meta.updatedAt = Date.now();
  }
  next();
});

// 建立数据模型
mongoose.model("User", UserSchema);
