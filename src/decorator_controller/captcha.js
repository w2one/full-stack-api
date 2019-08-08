
import  {controller,get,post,auth}  from "../decorator";
const _captcha = require("../utils/captcha");




@controller("/captcha")
export class captchaController{

  @get("/getCaptcha")
  async getCaptcha(ctx,next){
    var doc = await _captcha.reg.build();
    ctx.body={
      data:doc
    }
  }

  @post("/matchCaptcha")
  async matchCaptcha(ctx,next){
    const data = ctx.request.body;
    var  doc =  await  _captcha.reg.match(data.id,data.code);
    ctx.body={
      success:doc
    }
  }
}
