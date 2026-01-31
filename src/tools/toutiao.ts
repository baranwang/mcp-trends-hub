import { URL } from "node:url";
import { defineToolConfig, http } from "../utils";

export default defineToolConfig({
  name: "get_toutiao_trending",
  description: "获取今日头条热榜，包含时政要闻、社会事件、国际新闻、科技发展及娱乐八卦等多领域的热门中文资讯",
  func: async () => {
    const resp = await http.get<{
      data: any[];
    }>("https://www.toutiao.com/hot-event/hot-board/", {
      params: {
        origin: "toutiao_pc",
      },
    });
    if (!Array.isArray(resp.data.data)) {
      throw new Error("获取今日头条热榜失败");
    }
    return resp.data.data.map((item) => {
      const link = new URL(item.Url);
      link.search = "";
      return {
        title: item.Title,
        cover: item.Image.url,
        popularity: item.HotValue,
        link: link.toString(),
      };
    });
  },
});
