/**
 * router
 */
import { graphqlKoa, graphiqlKoa } from "graphql-server-koa";
import { login } from "./controller/login";

import { saveInfo, getInfo } from "./controller/info";
import { getDictController, addDictController } from "./controller/dict";
// import { getBannerController, addBannerController } from "./controller/banner";
import { findImage, findImages, saveImage } from "./controller/image";

import { saveUser, findUser } from "./controller/user";

import {
  saveShow,
  findShow,
  findShows,
  findShowList,
  updateShow,
  deleteShow
} from "./controller/show";

import schema from "./graphql/schema";

import { getToken } from "./controller/qiniu";

const router = require("koa-router")();

import { getTranslate } from "./controller/translate";

router.post("/saveinfo", saveInfo);
router.get("/getInfo", getInfo);
router.get("/dict", getDictController).get("/addDict", addDictController);

// image
router
  .get("/images", findImages)
  .get("/image/:id", findImage)
  .put("/image", saveImage);

router.get("/getTranslate", getTranslate);

// router.get("/getBanner", getBanner);
// router.post("/saveBanner", saveBanner);

router.get("/qiuToken", getToken);

router.post("/login", login);

//user
router.put("/saveUser", saveUser).get("/users", findUser);

// show
router
  .put("/show", saveShow)
  .get("/shows", findShows)
  .post("/showList", findShowList)
  .put("/updateShow", updateShow)
  .get("/show/:id", findShow)
  .post("/deleteShow", deleteShow);

router
  .post("/graphql", async (ctx, next) => {
    await graphqlKoa({ schema: schema })(ctx, next);
  })
  .get("/graphql", async (ctx, next) => {
    await graphqlKoa({ schema: schema })(ctx, next);
  })
  .get("/graphiql", async (ctx, next) => {
    await graphiqlKoa({ endpointURL: "/graphql" })(ctx, next);
  })
  .post("/graphiql", async (ctx, next) => {
    await graphiqlKoa({ endpointURL: "/graphql" })(ctx, next);
  });

export default router;
