import { Injectable } from "@nestjs/common";
import { PostId } from "@common/shared/identifiers/postId";

interface ViewCountCache {
  lastViewedAt: number;
}

@Injectable()
export class ViewCountCacheManager {
  private readonly ipViewCountCache = new Map<string, ViewCountCache>();
  private readonly VIEW_COUNT_WINDOW = 3 * 60 * 60 * 1000; // 3시간 (밀리초)

  public shouldIncreaseViewCount(clientIp: string, postId: PostId): boolean {
    const cacheKey = this.getCacheKey(clientIp, postId);
    const cached = this.ipViewCountCache.get(cacheKey);
    const now = Date.now();

    if (!cached) {
      return true;
    }

    if (now - cached.lastViewedAt > this.VIEW_COUNT_WINDOW) {
      this.ipViewCountCache.delete(cacheKey);
      return true;
    }

    return false;
  }

  public recordView(clientIp: string, postId: PostId): void {
    const cacheKey = this.getCacheKey(clientIp, postId);
    this.ipViewCountCache.set(cacheKey, {
      lastViewedAt: Date.now(),
    });
  }

  private getCacheKey(clientIp: string, postId: PostId): string {
    return `view_${clientIp}_${postId.getString()}`;
  }
}
