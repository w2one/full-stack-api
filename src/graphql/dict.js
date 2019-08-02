/**
 * dict
 */
import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull
} from "graphql";

import { getDict } from "../service/dict";

const objType = new GraphQLObjectType({
  name: "dict",
  fields: {
    id: { type: GraphQLInt },
    parentId: { type: GraphQLInt },
    valueCn: { type: GraphQLString },
    valueEn: { type: GraphQLString },
    description: { type: GraphQLString },
    createTime: { type: GraphQLString },
    updateTime: { type: GraphQLString }
  }
});

// 根据id查询单条info数据
const dicts = {
  type: new GraphQLList(objType),
  // 传进来的参数
  //   args: {
  //     word: {
  //       name: "word",
  //       type: new GraphQLNonNull(GraphQLString) // 参数不为空
  //     }
  //   },
  resolve(root, params, options) {
    // return Info.findOne({ _id: params.id }).exec(); // 查询单条数据
    return getDict();
    // return {
    //   from: "zh",
    //   to: "en",
    //   trans_result: [
    //     {
    //       src: "1",
    //       dst: "One"
    //     }
    //   ]
    // };
  }
};

export default dicts;
