/**
 * translate
 */
import axios from "axios";

export async function getTranslate(word) {
  let data = await axios.get(
    "https://m.shanghaim.net/iapi/translate/" + encodeURI(word)
  );

  return data.data;
}
