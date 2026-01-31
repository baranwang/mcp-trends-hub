import { defineToolConfig, getRssItems } from '../utils';

export default defineToolConfig({
  name: 'get_9to5mac_news',
  description: '获取 9to5Mac 苹果相关新闻，包含苹果产品发布、iOS 更新、Mac 硬件、应用推荐及苹果公司动态的英文资讯',
  func: () => getRssItems('https://9to5mac.com/feed/'),
});
