import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull
} from "graphql";

import { getTranslate } from "../service/translate";

const result = new GraphQLObjectType({
  name: "result",
  fields: {
    src: { type: GraphQLString },
    dst: { type: GraphQLString }
  }
});

const Translate = new GraphQLObjectType({
  name: "translate",
  fields: {
    from: { type: GraphQLString },
    to: { type: GraphQLString },
    trans_result: {
      type: new GraphQLList(result)
    }
  }
});

// 根据id查询单条info数据
const find = {
  type: Translate,
  // 传进来的参数
  args: {
    word: {
      name: "word",
      type: new GraphQLNonNull(GraphQLString) // 参数不为空
    }
  },
  resolve(root, params, options) {
    // return Info.findOne({ _id: params.id }).exec(); // 查询单条数据
    return getTranslate(params.word);
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

export default find;
