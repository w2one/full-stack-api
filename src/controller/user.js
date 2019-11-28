// var mysql = require("mysql");
// var connection = mysql.createConnection({
//   host: "106.13.32.89",
//   port: "8002",
//   user: "root",
//   password: "1",
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
    }
  );
};

export const findUser = async (ctx, next) => {
  const _id = ctx.query.id;
  console.log("-----------_id:" + _id);
  var user;
  if (_id) {
    user = await User.findOne({ _id: _id });
  } else {
    user = await User.find({});
  }
  ctx.body = user || [];
};

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

/**
 * 查询
 * @param {*} ctx
 */
export const queryUser = async ctx => {
  console.log("query user");
  const { page = 1, pageSize = 10 } = ctx.request.body;

  // 查询条件
  let total = await User.find({}).count();

  let records = await User.find({}, "username mobile")
    .skip((page - 1) * pageSize)
    .limit(pageSize);

  ctx.body = {
    records,
    total,
    current: page,
    pageSize,
    pages: Math.ceil(total / pageSize)
  };
};

/**
 * 更改用户
 * @param {*} ctx
 * @param {*} next
 */
export const updateUser = async (ctx, next) => {
  console.log("update user");
  const vo = ctx.request.body;
  delete vo.password; // 密码不修改
  const saveInfo = await User.findByIdAndUpdate(vo._id, vo, {
    password: true
  }); // 保存数据
  // console.log(saveInfo);
  // 简单判断一下 是否保存成功，然后返回给前端
  if (saveInfo) {
    ctx.body = {
      success: true
      // info: saveInfo
    };
  } else {
    ctx.body = {
      success: false
    };
  }
};

/**
 * 删除
 */
export const deleteUser = async ctx => {
  const { id } = ctx.request.body;
  const result = await User.findOneAndRemove({ _id: id });
  ctx.body = true;
};
