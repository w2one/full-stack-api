import axios from "axios";

// const getTranslate = word => {
//   axios.get("https://m.shanghaim.net/iapi/translate/" + word).then(data => {
//     console.log(data);
//   });
// };

export async function getTranslate(ctx) {
  let data = await axios.get("https://m.shanghaim.net/iapi/translate/123");
  // .then(data => {
  //   console.log(data);
  //   //
  //   // resolve(datq);
  //   return data;
  // });
  console.log(1123, data);
  console.log(1123, data.data);
  ctx.body = data.data;
}

export default {
  getTranslate
};
