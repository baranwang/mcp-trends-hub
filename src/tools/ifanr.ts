import { z } from "zod";
import { defineToolConfig, http } from "../utils";

const ifanrRequestSchema = z.object({
  limit: z.number().int().optional().default(20),
  offset: z.number().int().optional().default(0),
});

export default defineToolConfig({
  name: "get_ifanr_news",
  description: "获取爱范儿科技快讯，包含最新的科技产品、数码设备、互联网动态等前沿科技资讯",
  zodSchema: ifanrRequestSchema,
  func: async (args: unknown) => {
    const { limit, offset } = ifanrRequestSchema.parse(args);
    const resp = await http.get<{
      objects: any[];
    }>("https://sso.ifanr.com/api/v5/wp/buzz", {
      params: {
        limit,
        offset,
      },
    });
    if (!Array.isArray(resp.data.objects)) {
      throw new Error("获取爱范儿快讯失败");
    }
    return resp.data.objects.map((item) => {
      return {
        title: item.post_title,
        description: item.post_content,
        link: item.buzz_original_url || `https://www.ifanr.com/${item.post_id}`,
      };
    });
  },
});
