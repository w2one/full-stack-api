import mongoose from "mongoose";
const Schema = mongoose.Schema;

// {
// type: "view",
// name: "GVS",
// url: "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx8dfda79a073efa18&redirect_uri=http://jay99.51vip.biz/wx_oauth.html&response_type=code&scope=snsapi_base&state=imusic",
// sub_button: [ ],
// }

const sub_button = new Schema({
  type: String,
  name: String,
  url: String
});

const schema = new Schema({
  type: String,
  name: String,
  url: String,
  sub_button: [sub_button]
});

// 建立数据模型
mongoose.model("wechatMenu", schema);
