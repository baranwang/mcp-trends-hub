import { z } from 'zod';
import { defineToolConfig, http } from '../utils';

const doubanRankSchema = z.object({
  type: z
    .union([
      z.literal('subject').describe('图书、电影、电视剧、综艺等'),
      z.literal('movie').describe('电影'),
      z.literal('tv').describe('电视剧'),
    ])
    .optional()
    .default('subject'),
  start: z.number().int().optional().default(0),
  count: z.number().int().optional().default(10),
});

const URL_MAP: Record<z.infer<typeof doubanRankSchema>['type'], string> = {
  subject: 'https://m.douban.com/rexxar/api/v2/subject_collection/subject_real_time_hotest/items',
  movie: 'https://m.douban.com/rexxar/api/v2/subject_collection/movie_real_time_hotest/items',
  tv: 'https://m.douban.com/rexxar/api/v2/subject_collection/tv_real_time_hotest/items',
};

export default defineToolConfig({
  name: 'get_douban_rank',
  description: '获取豆瓣实时热门榜单，提供当前热门的图书、电影、电视剧、综艺等作品信息，包含评分和热度数据',
  zodSchema: doubanRankSchema,
  func: async (args: unknown) => {
    const { type, start, count } = doubanRankSchema.parse(args);
    const resp = await http.get<{
      subject_collection_items: any[];
    }>(URL_MAP[type], {
      params: {
        type,
        start,
        count,
        for_mobile: 1,
      },
      headers: {
        Referer: 'https://m.douban.com/subject_collection/movie_real_time_hotest',
      },
    });
    if (!Array.isArray(resp.data.subject_collection_items)) {
      throw new Error('获取豆瓣实时热门榜失败');
    }
    return resp.data.subject_collection_items.map((item) => {
      return {
        type_name: item.type_name,
        title: item.title,
        info: item.info,
        cover: item.cover.url,
        year: item.year,
        release_date: item.release_date,
        link: item.url,
        popularity: item.score,
        rating_count: item.rating.count,
        rating_value: item.rating.count > 0 ? item.rating.value : undefined,
        hashtags: item.related_search_terms.map((term: any) => `#${term.name}`).join(' '),
      };
    });
  },
});
