/**
 * 钉钉机器人
 * https://ding-doc.dingtalk.com/doc#/serverapi2/qf2nxq
 */
import axios from "axios";
import config from "../config";

export async function sendMsg({
  nickName,
  avatarUrl,
  latitude,
  longitude,
  addr = "未知"
}) {
  let response = await axios.post(config.dingding, {
    msgtype: "markdown",
    markdown: {
      title: nickName + "打卡",
      text:
        `#### 有人打卡\n` +
        `> ![头像](${avatarUrl}) \n` +
        `- 昵称: ${nickName}\n` +
        `- 经度: ${longitude}\n` +
        `- 纬度: ${latitude}\n` +
        `- 地址: ${addr}\n` +
        `- ${new Date().toLocaleString()}`
    }
  });

  // console.log(response);
  return response;
}
