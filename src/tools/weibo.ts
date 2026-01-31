import { URL } from 'node:url';
import { defineToolConfig, http } from '../utils';

export default defineToolConfig({
  name: 'get-weibo-trending',
  description: '获取微博热搜榜，包含时事热点、社会现象、娱乐新闻、明星动态及网络热议话题的实时热门中文资讯',
  func: async () => {
    const resp = await http.get<{
      ok: number;
      data: {
        realtime: any[];
      };
    }>('https://weibo.com/ajax/side/hotSearch', {
      headers: {
        Referer: 'https://weibo.com/',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      }
    });
    if (resp.data.ok !== 1 || !Array.isArray(resp.data.data.realtime)) {
      throw new Error('获取微博热搜榜失败');
    }
    return resp.data.data.realtime
      .filter((item) => item.is_ad !== 1)
      .map((item: any) => {
        const key = item.word_scheme || `#${item.word}`;
        const url = new URL('https://s.weibo.com/weibo');
        url.searchParams.set('q', key);
        url.searchParams.set('band_rank', '1');
        url.searchParams.set('Refer', 'top');
        return {
          title: item.word,
          description: item.note || key,
          popularity: item.num,
          link: url.toString(),
        };
      });
  },
});
