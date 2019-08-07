import  {controller,get,post,auth}  from "../decorator"


@controller("/test2")
export class testController{
    
    @get("/test2")
    @auth
    index(ctx,next){
        console.log("/test api");
        ctx.body={
            a:123123
        }
    }
}
