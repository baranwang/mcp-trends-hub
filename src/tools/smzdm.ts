import { z } from "zod";
import { defineToolConfig, http, safeJsonParse } from "../utils";

const smzdmRequestSchema = z.object({
  unit: z
    .union([z.literal(1).describe("今日热门"), z.literal(7).describe("周热门"), z.literal(30).describe("月热门")])
    .optional()
    .default(1),
});

export default defineToolConfig({
  name: "get_smzdm_rank",
  description: "获取什么值得买热门，包含商品推荐、优惠信息、购物攻略、产品评测及消费经验分享的实用中文消费类资讯",
  zodSchema: smzdmRequestSchema,
  func: async (args) => {
    const { unit } = smzdmRequestSchema.parse(args);
    const resp = await http.get<{
      error_code: number;
      error_msg: string;
      data: any[];
    }>("https://post.smzdm.com/rank/json_more", {
      params: {
        unit,
      },
    });

    if (resp.data.error_code !== 0 || !Array.isArray(resp.data.data)) {
      throw new Error(resp.data.error_msg || "获取什么值得买热门失败");
    }

    return resp.data.data.map((item) => {
      return {
        title: item.title,
        description: item.content,
        cover: item.pic_url,
        author: item.nickname,
        publish_time: item.publish_time,
        collection_count: item.collection_count,
        comment_count: item.comment_count,
        up_count: item.up_count,
        hashtags: safeJsonParse<any[]>(item.tag)
          ?.map((tag) => `#${tag.title}`)
          .join(" "),
        link: item.article_url,
      };
    });
  },
});
