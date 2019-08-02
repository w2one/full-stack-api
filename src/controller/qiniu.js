/**
 * qiqiu
 */
import { generateToken } from "../utils/qiniu";

export async function getToken(ctx) {
  ctx.body = generateToken();
}
