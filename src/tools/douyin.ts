import { dayjs, defineToolConfig, http } from "../utils";

const getCsrfToken = async () => {
  try {
    const reps = await http.get("https://www.douyin.com/passport/general/login_guiding_strategy/", {
      params: {
        aid: 6383,
      },
    });
    const pattern = /passport_csrf_token=([^;]*); Path/;
    const matchResult = reps.headers["set-cookie"]?.[0].match(pattern);
    const csrfToken = matchResult?.[1];
    return csrfToken;
  } catch (error) {
    return undefined;
  }
};

export default defineToolConfig({
  name: "get_douyin_trending",
  description: "获取抖音热搜榜单，展示当下最热门的社会话题、娱乐事件、网络热点和流行趋势",
  func: async () => {
    const csrfToken = await getCsrfToken();
    const resp = await http.get<{
      status_code: number;
      data: {
        word_list: any[];
      };
    }>("https://www.douyin.com/aweme/v1/web/hot/search/list/", {
      params: {
        device_platform: "webapp",
        aid: 6383,
        channel: "channel_pc_web",
        detail_list: 1,
      },
      headers: {
        Cookie: `passport_csrf_token=${csrfToken}`,
      },
    });
    if (resp.data?.status_code !== 0 || !Array.isArray(resp.data.data.word_list)) {
      throw new Error("获取抖音热榜失败");
    }
    return resp.data.data.word_list.map((item) => {
      return {
        title: item.word,
        eventTime: dayjs.unix(item.event_time).toISOString(),
        cover: item.word_cover?.url_list?.[0],
        popularity: item.hot_value,
        link: `https://www.douyin.com/hot/${item.sentence_id}`,
      };
    });
  },
});
