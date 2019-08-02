import { getBanner, addBanner } from "../service/banner";

export async function getBannerController(ctx) {
  console.log(ctx.request.body);

  const data = await getBanner();
  ctx.body = data;
}

export async function addBannerController(ctx) {
  const data = await addBanner();
  ctx.body = data;
}
