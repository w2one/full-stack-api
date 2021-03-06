// 引入mongoose模块
import mongoose from "mongoose";
import config from "../config";
// 同步引入 info model和 studen model
require("./schema/info");
require("./schema/image");
require("./schema/show");
require("./schema/user");
require("./schema/wechat/menu");
require("./schema/analytics/point");
require("./schema/analytics/track");
require("./schema/banner");
require("./schema/daka");
require("./schema/geo");
// require("./schema/student");
// 链接mongodb
export const database = () => {
  mongoose.set("debug", true);
  mongoose.connect(config.dbPath);
  mongoose.connection.on("disconnected", () => {
    mongoose.connect(config.dbPath);
  });
  mongoose.connection.on("error", err => {
    console.error(err);
  });
  mongoose.connection.on("open", async () => {
    console.log("Connected to MongoDB ", config.dbPath);
  });
};
