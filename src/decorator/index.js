
const  Router = require("koa-router")
const glob = require("glob")
const _ = require("lodash")
const R = require('ramda')
const { resolve } = require('path')



export const symbolPrefix =  Symbol("prefix")
export const normalizePath = path =>path.startsWith("/") ? path : `/${path}`
const isArray = x => _.isArray(x) ? x : [x] // 判断是否是数组，非数组转换成数组
export let routersMap = new Map()



const decorate = (args,middleware) => {
    let  [target,key,descriptor] = args ;
    
    target[key] = isArray(target[key]);
    target[key].unshift(middleware)
    return descriptor;
}

export default class Route{

    constructor(app,path){
        this.app = app ;
        this.router =  new Router();
        this.apiPath = path
    }

    init(){
        // glob遍历controller中的js，require加载进来
        glob.sync(resolve(this.apiPath,"./*.js")).forEach(require);
        _.forIn(routersMap,(value,key)=>{
            console.log("路由map:",value,key)
        })
        //遍历Map
        //map是键值对组成的，所以需要解构来将键值对拆解为两个独立变量：
        for(let [conf,controller] of routersMap){
            const  controllers = isArray(controller)
            let  prefixPath = conf.target[symbolPrefix]
            if(prefixPath) prefixPath = normalizePath(prefixPath)

            const routerPath = prefixPath  +  conf.path
            //注册路由
            this.router[conf.method](routerPath,...controllers)
        }

        this.app.use(this.router.routes())
        this.app.use(this.router.allowedMethods())
    }
}



//路由存入routerMap
export const router =  conf => (target,key,des) =>{
    conf.path =  normalizePath(conf.path)

    routersMap.set({
        target:target,
        ...conf
    },target[key])

}


export const controller =function(path){
    console.log(path)  //test2
    return  function(target){
        //target [Function: testController]
        return target.prototype[symbolPrefix] = path;
    }  
} 

export const get =function(path){
    return  router({
        method: 'get',
        path: path
    })
}

export const post =function(path){
    return  router({
        method: 'post',
        path: path
    })
}

export  const put =function(path){
    return router({
        method:"put",
        path:path
    })
}

export  const del =function(path){
    return router({
        method:"del",
        path:path
    })
}



export const convert = function(middleware){
    return function(...args){
        console.log(args)
        return decorate(args,middleware)
    }
}

/**
 * 限制传入的参数中间件
 * @param {Object} rules 参数；eg：@required({body: ['username', 'password'],query: ['token']})
 */
export const required = rules => convert(async (ctx, next) => {
    let errors = [];

    const passRules = R.forEachObjIndexed((value, key) => {
        errors = R.filter(i => !R.has(i, ctx.request[key]))(value) // 判断ctx.request[key]中是否有指定的参数
    })
    passRules(rules); // 每个属性依次执行给定函数
    if (errors.length) ctx.throw(412, `${errors.join(',')}参数缺失`)
    await next()
})


export const middlewares = (middlewares) => (target,key,descriptor)=>{
    descriptor.value.middlewares = middlewares;
    return descriptor
}

// 登录拦截
export const auth = convert(async (ctx, next) => {
    console.log("auth")
    return next()
})


