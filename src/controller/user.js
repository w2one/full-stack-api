// var mysql = require("mysql");
// var connection = mysql.createConnection({
//   host: "106.13.32.89",
//   port: "8002",
//   user: "root",
//   password: "11112222",
//   database: "trash"
// });

// connection.connect();

// export function getUser(ctx) {
//   return new Promise((resolve, reject) => {
//     connection.query("SELECT * from user", function(error, results, fields) {
//       if (error) throw error;
//       //   console.log("The solution is: ", results[0]);
//       //   ctx.body = JSON.stringify(results);
//       //   resolve(results);
//       ctx.body = results;
//       resolve(results);
//     });
//   });
// }

import mongoose from "mongoose";
const User = mongoose.model("User");

/**
 * 保存用户
 * @author yangzexu
 * @param
 */
export const saveUser = async (ctx, next) => {
  const data = ctx.request.body;
  console.log("-----------requestBody:" + data);
  const user = new User(data);
  //保存用户
  user.save().then(
    function(data) {
      ctx.body = {
        success: true,
        userInfo: data
      };
    },
    function(error) {
      ctx.body = {
        success: false
      };
    })
}


export const findUser = async (ctx, next) => {
  const _id = ctx.query.id;
  console.log("-----------_id:" + _id);
  var user;
  if (_id){
    user = await User.findOne(
      { _id: _id }
    );
  }else{
    user = await User.find({});
  }
  ctx.body = user || [];
}


/**
 * 根据用户名查找用户
 * @param {用户名} name
 */
export const findUserByUsername = async username => {
  console.log("find use by username");
  const user = await User.findOne({ username });
  console.log(user);
  return user;
};
