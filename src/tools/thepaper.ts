import { dayjs, defineToolConfig, http } from "../utils";

export default defineToolConfig({
  name: "get_thepaper_trending",
  description: "获取澎湃新闻热榜，包含时政要闻、财经动态、社会事件、文化教育及深度报道的高质量中文新闻资讯",
  func: async () => {
    const resp = await http.get<{
      resultCode: number;
      resultMsg: string;
      data: {
        hotNews: any[];
      };
    }>("https://cache.thepaper.cn/contentapi/wwwIndex/rightSidebar");
    if (resp.data.resultCode !== 1 || !Array.isArray(resp.data.data.hotNews)) {
      throw new Error(resp.data.resultMsg || "获取澎湃新闻热榜失败");
    }

    return resp.data.data.hotNews.map((item) => {
      return {
        title: item.name,
        cover: item.pic,
        popularity: item.praiseTimes,
        publish_time: dayjs(item.pubTimeLong).toISOString(),
        hashtags: item.tagList?.map((tag: any) => `#${tag.tag}`).join(" "),
        link: `https://www.thepaper.cn/newsDetail_forward_${item.contId}`,
      };
    });
  },
});
