import { z } from "zod";
import { defineToolConfig, http } from "../utils";

const tencentNewsRequestSchema = z.object({
  page_size: z.number().int().optional().default(20),
});

export default defineToolConfig({
  name: "get_tencent_news_trending",
  description: "获取腾讯新闻热点榜，包含国内外时事、社会热点、财经资讯、娱乐动态及体育赛事的综合性中文新闻资讯",
  zodSchema: tencentNewsRequestSchema,
  func: async (args) => {
    const { page_size } = tencentNewsRequestSchema.parse(args);
    const resp = await http.get<{
      ret: number;
      idlist: [{ newslist: any[] }];
    }>("https://r.inews.qq.com/gw/event/hot_ranking_list", {
      params: {
        page_size,
      },
    });

    if (resp.data.ret !== 0 || !Array.isArray(resp.data.idlist?.[0].newslist)) {
      throw new Error("获取腾讯新闻热点榜失败");
    }

    return resp.data.idlist[0].newslist
      .filter((_, index) => index !== 0)
      .map((item) => {
        return {
          title: item.title,
          description: item.abstract,
          cover: item.thumbnails?.[0],
          source: item.source,
          popularity: item.hotEvent.hotScore,
          publish_time: item.time,
          link: item.url,
        };
      });
  },
});
