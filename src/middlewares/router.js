import Route  from "../decorator"
const resolve  = require("path").resolve;
const requirePath =  path => resolve(__dirname,path)


export  const routerMap = app=>{
    const routePath = requirePath("../decorator_controller")
    const router = new Route(app,routePath)
    router.init();
}