import { defineToolConfig, getRssItems } from '../utils';

export default defineToolConfig({
  name: 'get_gcores_new',
  description: '获取机核网游戏相关资讯，包含电子游戏评测、玩家文化、游戏开发和游戏周边产品的深度内容',
  func: () => getRssItems('https://www.gcores.com/rss'),
});
