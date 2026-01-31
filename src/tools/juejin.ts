import { z } from "zod";
import { defineToolConfig, handleSuccessResult, http } from "../utils";

const headers = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
  "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
  "Accept-Encoding": "gzip, deflate, br",
  "Cache-Control": "no-cache",
  Connection: "keep-alive",
  "Sec-Ch-Ua": '"Google Chrome";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
  "Sec-Ch-Ua-Mobile": "?0",
  "Sec-Ch-Ua-Platform": '"Windows"',
  "Sec-Fetch-Dest": "document",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Site": "same-origin",
  "Sec-Fetch-User": "?1",
  "Upgrade-Insecure-Requests": "1",
};

export default defineToolConfig(async () => {
  const categoryResp = await http.get<{
    err_no: number;
    err_msg: string;
    data: {
      category_id: string;
      category_name: string;
    }[];
  }>("https://api.juejin.cn/tag_api/v1/query_category_briefs", { headers });

  if (categoryResp.data.err_no !== 0) {
    throw new Error("获取掘金分类失败");
  }

  const juejinRequestSchema = z.object({
    category_id: z
      .union(
        categoryResp.data.data.map((item) => z.literal(item.category_id).describe(item.category_name)) as [
          z.ZodLiteral<string>,
          z.ZodLiteral<string>,
        ],
      )
      .optional()
      .default(categoryResp.data.data[0].category_id),
  });

  return {
    name: "get_juejin_article_rank",
    description: "获取掘金文章榜，包含前端开发、后端技术、人工智能、移动开发及技术架构等领域的高质量中文技术文章和教程",
    zodSchema: juejinRequestSchema,
    func: async (args) => {
      const { category_id } = juejinRequestSchema.parse(args);

      const resp = await http.get<{
        err_no: number;
        err_msg: string;
        data: any[];
      }>("https://api.juejin.cn/content_api/v1/content/article_rank", {
        params: {
          category_id,
          type: "hot",
        },
        headers,
      });

      if (resp.data.err_no !== 0) {
        throw new Error(resp.data.err_msg || "获取掘金文章榜失败");
      }
      return resp.data.data.map((item) => {
        return {
          title: item.content.title,
          brief: item.content.brief || undefined,
          author: item.author.name,
          popularity: item.content_counter.hot_rank,
          view_count: item.content_counter.view,
          like_count: item.content_counter.like,
          collect_count: item.content_counter.collect,
          comment_count: item.content_counter.comment_count,
          interact_count: item.content_counter.interact_count,
          link: `https://juejin.cn/post/${item.content.content_id}`,
        };
      });
    },
  };
});
