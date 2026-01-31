import crypto from "node:crypto";
import { z } from "zod";
import { defineToolConfig, http, logger } from "../utils";

const wereadRequestSchema = z.object({
  category: z
    .union([
      z.literal("rising").describe("飙升榜"),
      z.literal("hot_search").describe("热搜榜"),
      z.literal("newbook").describe("新书榜"),
      z.literal("general_novel_rising").describe("小说榜"),
      z.literal("all").describe("总榜"),
    ])
    .optional()
    .default("rising")
    .describe("排行榜分区"),
});

const getWereadID = (bookId: string) => {
  try {
    // 使用 MD5 哈希算法创建哈希对象
    const hash = crypto.createHash("md5");
    hash.update(bookId);
    const str = hash.digest("hex");
    // 取哈希结果的前三个字符作为初始值
    let strSub = str.substring(0, 3);
    // 判断书籍 ID 的类型并进行转换
    let fa: (string | any[])[];
    if (/^\d*$/.test(bookId)) {
      // 如果书籍 ID 只包含数字，则将其拆分成长度为 9 的子字符串，并转换为十六进制表示
      const chunks = [];
      for (let i = 0; i < bookId.length; i += 9) {
        const chunk = bookId.substring(i, i + 9);
        chunks.push(Number.parseInt(chunk).toString(16));
      }
      fa = ["3", chunks];
    } else {
      // 如果书籍 ID 包含其他字符，则将每个字符的 Unicode 编码转换为十六进制表示
      let hexStr = "";
      for (let i = 0; i < bookId.length; i++) {
        hexStr += bookId.charCodeAt(i).toString(16);
      }
      fa = ["4", [hexStr]];
    }
    // 将类型添加到初始值中
    strSub += fa[0];
    // 将数字 2 和哈希结果的后两个字符添加到初始值中
    strSub += `2${str.substring(str.length - 2)}`;
    // 处理转换后的子字符串数组
    for (let i = 0; i < fa[1].length; i++) {
      const sub = fa[1][i];
      const subLength = sub.length.toString(16);
      // 如果长度只有一位数，则在前面添加 0
      const subLengthPadded = subLength.length === 1 ? `0${subLength}` : subLength;
      // 将长度和子字符串添加到初始值中
      strSub += subLengthPadded + sub;
      // 如果不是最后一个子字符串，则添加分隔符 'g'
      if (i < fa[1].length - 1) {
        strSub += "g";
      }
    }
    // 如果初始值长度不足 20，从哈希结果中取足够的字符补齐
    if (strSub.length < 20) {
      strSub += str.substring(0, 20 - strSub.length);
    }
    // 使用 MD5 哈希算法创建新的哈希对象
    const finalHash = crypto.createHash("md5");
    finalHash.update(strSub);
    const finalStr = finalHash.digest("hex");
    // 取最终哈希结果的前三个字符并添加到初始值的末尾
    strSub += finalStr.substring(0, 3);
    return strSub;
  } catch (error) {
    logger.error(`处理微信读书 ID 时出现错误：${error}`);
    return undefined;
  }
};

export default defineToolConfig({
  name: "get_weread_rank",
  description: "获取微信读书排行榜，包含热门小说、畅销书籍、新书推荐及各类文学作品的阅读数据和排名信息",
  zodSchema: wereadRequestSchema,
  func: async (args) => {
    const { category } = wereadRequestSchema.parse(args);
    const resp = await http.get<{
      books: any[];
    }>(`https://weread.qq.com/web/bookListInCategory/${category}`, {
      params: {
        rank: 1,
      },
    });

    if (!Array.isArray(resp.data.books)) {
      throw new Error("获取微信读书排行榜失败");
    }

    return resp.data.books.map((item) => {
      const { bookInfo } = item;
      const wereadID = getWereadID(bookInfo.bookId);
      return {
        title: bookInfo.title,
        description: bookInfo.intro,
        cover: bookInfo.cover?.replace("s_", "t9_"),
        author: bookInfo.author,
        publish_time: bookInfo.publishTime,
        reading_count: item.readingCount,
        link: wereadID ? `https://weread.qq.com/web/bookDetail/${wereadID}` : undefined,
      };
    });
  },
});
