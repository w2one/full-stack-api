/**
 * https://github.com/qiniu/nodejs-sdk/blob/master/examples/create_uptoken.js
 */

import qiniu from "qiniu";
import config from "../config";

// const accessKey = "";
// const secretKey = "";
// const bucket = "";
const { accessKey, secretKey, bucket } = config;

const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

const options = {
  scope: bucket,
  expires: 7200 //2小时
};
const putPolicy = new qiniu.rs.PutPolicy(options);
const uploadToken = putPolicy.uploadToken(mac);

console.log(uploadToken);

export function generateToken() {
  const options = {
    scope: bucket
  };
  const putPolicy = new qiniu.rs.PutPolicy(options);
  const uploadToken = putPolicy.uploadToken(mac);

  console.log(uploadToken);
  return uploadToken;
}
