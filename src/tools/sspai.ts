import { z } from "zod";
import { dayjs, defineToolConfig, http } from "../utils";

const sspaiRequestSchema = z.object({
  tag: z
    .enum(["热门文章", "应用推荐", "生活方式", "效率技巧", "少数派播客"])
    .optional()
    .default("热门文章")
    .describe("分类"),
  limit: z.number().int().optional().default(40),
});

export default defineToolConfig({
  name: "get_sspai_rank",
  description: "获取少数派热榜，包含数码产品评测、软件应用推荐、生活方式指南及效率工作技巧的优质中文科技生活类内容",
  zodSchema: sspaiRequestSchema,
  func: async (args) => {
    const { tag, limit } = sspaiRequestSchema.parse(args);
    const resp = await http.get<{
      error: number;
      msg: string;
      data: any[];
    }>("https://sspai.com/api/v1/article/tag/page/get", {
      params: {
        tag,
        limit,
      },
    });

    if (resp.data.error !== 0 || !Array.isArray(resp.data.data)) {
      throw new Error(resp.data.msg || "获取少数派热榜失败");
    }

    return resp.data.data.map((item) => {
      return {
        title: item.title,
        summary: item.summary,
        author: item.author.nickname,
        released_time: dayjs.unix(item.released_time).toISOString(),
        comment_count: item.comment_count,
        like_count: item.like_count,
        view_count: item.view_count,
        link: `https://sspai.com/post/${item.id}`,
      };
    });
  },
});
