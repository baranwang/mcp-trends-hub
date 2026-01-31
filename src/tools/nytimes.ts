import { z } from "zod";
import { defineToolConfig, getRssItems } from "../utils";

const nytimesRequestSchema = z.object({
  region: z
    .union([z.literal("cn").describe("中文"), z.literal("global").describe("全球")])
    .optional()
    .default("cn"),
  section: z
    .string()
    .optional()
    .default("HomePage")
    .describe(
      "分类，当 `region` 为 `cn` 时无效。可选值: Africa, Americas, ArtandDesign, Arts, AsiaPacific, Automobiles, Baseball, Books/Review, Business, Climate, CollegeBasketball, CollegeFootball, Dance, Dealbook, DiningandWine, Economy, Education, EnergyEnvironment, Europe, FashionandStyle, Golf, Health, Hockey, HomePage, Jobs, Lens, MediaandAdvertising, MiddleEast, MostEmailed, MostShared, MostViewed, Movies, Music, NYRegion, Obituaries, PersonalTech, Politics, ProBasketball, ProFootball, RealEstate, Science, SmallBusiness, Soccer, Space, Sports, SundayBookReview, Sunday-Review, Technology, Television, Tennis, Theater, TMagazine, Travel, Upshot, US, Weddings, Well, World, YourMoney",
    ),
});

type NytimesRequestSchema = z.output<typeof nytimesRequestSchema>;

const getUrl = (region: NytimesRequestSchema["region"], section: NytimesRequestSchema["section"]) => {
  if (region === "cn") {
    return "https://cn.nytimes.com/rss/";
  }
  return `https://rss.nytimes.com/services/xml/rss/nyt/${section || "HomePage"}.xml`;
};

export default defineToolConfig({
  name: "get_nytimes_news",
  description: "获取纽约时报新闻，包含国际政治、经济金融、社会文化、科学技术及艺术评论的高质量英文或中文国际新闻资讯",
  zodSchema: nytimesRequestSchema,
  func: async (args) => {
    const { region, section } = nytimesRequestSchema.parse(args);
    const url = getUrl(region, section);
    return getRssItems(url);
  },
});
