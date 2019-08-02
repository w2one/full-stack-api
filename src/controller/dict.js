import { getDict, addDict } from "../service/dict";

export async function getDictController(ctx) {
  const data = await getDict();
  ctx.body = data;
}

export async function addDictController(ctx) {
  const data = await addDict();
  ctx.body = data;
}
