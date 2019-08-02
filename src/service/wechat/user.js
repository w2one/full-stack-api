// https://api.weixin.qq.com/cgi-bin/user/get?access_token=ACCESS_TOKEN&next_openid=NEXT_OPENID
/**
 * 菜单
 */

const request = require("request");
import { getToken } from "./token";

/**
 * 获取用户
 * @param {*} ACCESS_TOKEN
 */
export const requestGetUser = async () => {
  let ACCESS_TOKEN = await getToken();
  return new Promise(function(resolve, reject) {
    let url =
      "https://api.weixin.qq.com/cgi-bin/user/get?access_token=ACCESS_TOKEN";
    url = url.replace("ACCESS_TOKEN", ACCESS_TOKEN);

    request(
      {
        url: url,
        method: "get"
      },
      (error, response, body) => {
        console.log(body);
        if (!error && response.statusCode == 200) {
          try {
            resolve(JSON.parse(body));
          } catch (e) {
            reject(e);
          }
        } else {
          reject(error);
        }
      }
    );
  });
};

/**
 * 获取用户
 * @param {*} ACCESS_TOKEN
 */
export const requestGetUserInfo = async OPENID => {
  let ACCESS_TOKEN = await getToken();
  return new Promise(function(resolve, reject) {
    let url =
      "https://api.weixin.qq.com/cgi-bin/user/info?access_token=ACCESS_TOKEN&openid=OPENID&lang=zh_CN";
    url = url.replace("ACCESS_TOKEN", ACCESS_TOKEN).replace("OPENID", OPENID);

    request(
      {
        url: url,
        method: "get"
      },
      (error, response, body) => {
        console.log(body);
        if (!error && response.statusCode == 200) {
          try {
            resolve(JSON.parse(body));
          } catch (e) {
            reject(e);
          }
        } else {
          reject(error);
        }
      }
    );
  });
};

export const requestSetMenu = async m => {
  let ACCESS_TOKEN = await getToken();
  new Promise(function(resolve, reject) {
    let url =
      "https://api.weixin.qq.com/cgi-bin/menu/create?access_token=ACCESS_TOKEN";
    url = url.replace("ACCESS_TOKEN", ACCESS_TOKEN);

    request(
      {
        url: url,
        method: "post",
        body: JSON.stringify(m)
      },
      (error, response, body) => {
        console.log(body);
        if (!error && response.statusCode == 200) {
          try {
            resolve(body);
          } catch (e) {
            reject(e);
          }
        } else {
          reject(error);
        }
      }
    );
  });
};
