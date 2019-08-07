
import  {controller,get,post,auth}  from "../decorator"
const  captcha = require("../utils/captcha");


@controller("/captcha")
export class captchaController{

  @get("/getCaptcha")
  getCaptcha(ctx,next){
    ctx.body={
      a:123123
    }
  }
}
