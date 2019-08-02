/**
 * show schema
 * 
 * accessCode: null
applyPromotion: 0
applyTemplate: 2
bgAudio: "{"url":"1a724f7a49a849e8864ab31461c2f602.mp3","name":"Beautiful.mp3","id":651629717}"
bizType: 0
checkStatus: 3
code: "AZhmsomf"
cover: "o_1d1af2iit1bee1s8k1hlmduc1aj59.png"
createTime: 1547705012000
createUser: "4a2d8af948b198210148fcae52bc0083"
dataCount: 0
delTime: null
description: "高端快闪欧式时尚婚礼邀请"
id: 149739573
image: {}
imageStr: null
isDel: null
isExpedited: null
isTpl: 1
leaveCount: null
loadingLogo: null
memberType: null
name: "高端快闪欧式时尚婚礼邀请"
 */
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ShowSchema = new Schema({
  title: String, // 名字
  bgAudio: String, //背景音乐
  description: String, // 描述
  images: [
    {
      image: String, // 图片
      title: String // 标题
    }
  ],
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
ShowSchema.pre("save", function(next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now();
  } else {
    this.meta.updatedAt = Date.now();
  }
  next();
});

// 建立数据模型
mongoose.model("Show", ShowSchema);
