import { z } from "zod";
import { dayjs, defineToolConfig, http } from "../utils";

const zhihuTrendingSchema = z.object({
  limit: z.number().optional().default(50),
});

export default defineToolConfig({
  name: "get_zhihu_trending",
  description: "获取知乎热榜，包含时事热点、社会话题、科技动态、娱乐八卦等多领域的热门问答和讨论的中文资讯",
  zodSchema: zhihuTrendingSchema,
  func: async (args: unknown) => {
    const { limit } = zhihuTrendingSchema.parse(args);
    const resp = await http.get<{ data: any[] }>("https://www.zhihu.com/api/v3/feed/topstory/hot-lists/total", {
      params: {
        limit,
      },
      headers: {
        "User-Agent":
          "osee2unifiedRelease/22916 osee2unifiedReleaseVersion/10.49.0 Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
        "x-app-versioncode": "22916",
        "x-app-bundleid": "com.zhihu.ios",
        "x-app-build": "release",
        "x-package-ytpe": "appstore", // key 是 知乎的 typo
        "x-app-za":
          "OS=iOS&Release=18.5&Model=iPhone17,2&VersionName=10.49.0&VersionCode=22916&Width=1290&Height=2796&DeviceType=Phone&Brand=Apple&OperatorType=6553565535",
      },
    });
    if (!Array.isArray(resp.data.data)) {
      throw new Error("获取知乎热榜失败");
    }
    return resp.data.data.map((item) => {
      const data = item.target;
      const id = item.target?.url.split("/").pop();
      return {
        title: data.title,
        description: data.excerpt,
        cover: item.children[0].thumbnail,
        created: dayjs.unix(data.created).toISOString(),
        popularity: item.detail_text,
        link: id ? `https://www.zhihu.com/question/${id}` : undefined,
      };
    });
  },
});
