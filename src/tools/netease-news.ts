import { defineToolConfig, http } from "../utils";

export default defineToolConfig({
  name: "get_netease_news_trending",
  description: "获取网易新闻热点榜，包含时政要闻、社会事件、财经资讯、科技动态及娱乐体育的全方位中文新闻资讯",
  func: async () => {
    const resp = await http.get<{
      code: number;
      data: {
        list: any[];
      };
    }>("https://m.163.com/fe/api/hot/news/flow");

    if (resp.data.code !== 200 || !Array.isArray(resp.data.data.list)) {
      throw new Error("获取网易新闻热点榜失败");
    }
    return resp.data.data.list.map((item) => {
      return {
        title: item.title,
        cover: item.imgsrc,
        source: item.source,
        publish_time: item.ptime,
        link: item.url,
      };
    });
  },
});
