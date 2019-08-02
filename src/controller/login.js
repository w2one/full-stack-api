/**
 * login
 */
import { decode, verify, encode } from "../utils/token";
import { findUserByUsername } from "./user";


export async function login(ctx) {
  const { username, password } = ctx.request.body;
  // username password
  const user = await findUserByUsername(username);
  console.log("login---", user);
  if (user && password === user.password) {
    const token = encode({
      id: user.id
    });
    console.log(token);
    ctx.body = token;
  } else {
    // 怎么处理 TODO
    ctx.throw({
      statusCode: 200,
      message: "账号或密码错误"
    });
  }
}