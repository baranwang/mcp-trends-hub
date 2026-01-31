import fs from "node:fs";
import os from "node:os";
import path from "node:path";

class CacheStorage {
  private get cachePath() {
    const cachePath = path.join(os.tmpdir(), "mcp-trends-hub", "cache");
    if (!fs.existsSync(cachePath)) {
      fs.mkdirSync(cachePath, { recursive: true });
    }
    return cachePath;
  }

  private getPathByKey(key: string) {
    return path.join(this.cachePath, key);
  }

  getItem(key: string) {
    const itemPath = this.getPathByKey(key);
    if (!fs.existsSync(itemPath)) {
      return null;
    }
    return fs.readFileSync(itemPath, "utf-8");
  }

  setItem(key: string, value: string) {
    const itemPath = this.getPathByKey(key);
    fs.writeFileSync(itemPath, value);
  }

  removeItem(key: string) {
    const itemPath = this.getPathByKey(key);
    if (!fs.existsSync(itemPath)) {
      return;
    }
    fs.unlinkSync(itemPath);
  }

  clear() {
    fs.rmSync(this.cachePath, { recursive: true });
  }
}

export const cacheStorage = new CacheStorage();
