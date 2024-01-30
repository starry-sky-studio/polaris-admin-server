import { Injectable } from '@nestjs/common'

@Injectable()
export class CacheKeyService {
  /**
   * 用户信息缓存键
   */
  private readonly USER_CACHE_KEY_PREFIX = 'user'

  getUserCacheKey(pattern: number | string) {
    if (!pattern) {
      throw new Error('Pattern is required!')
    }
    return `${this.USER_CACHE_KEY_PREFIX}:${pattern}`
  }

  /**
   * 字典缓存键
   */
  private readonly DICTIONARY_CACHE_KEY_PREFIX = 'dictionary'

  getDictionaryCacheKey(pattern: number | string) {
    if (!pattern) {
      throw new Error('Pattern is required!')
    }
    return `${this.DICTIONARY_CACHE_KEY_PREFIX}:${pattern}`
  }

  /**
   * 字典项缓存键
   */
  private readonly DICTIONARY_ITEM_CACHE_KEY_PREFIX = 'dictionary_item'

  getDictionaryItemCacheKey(pattern: number | string) {
    if (!pattern) {
      throw new Error('Pattern is required!')
    }
    return `${this.DICTIONARY_ITEM_CACHE_KEY_PREFIX}:${pattern}`
  }

  /**
   * 在线用户信息缓存键
   */
  private readonly ONLINE_USER_CACHE_KEY_PREFIX = 'online_user'

  getOnlineUserCacheKey(pattern: number | string) {
    if (!pattern) {
      throw new Error('Pattern is required!')
    }
    return `${this.ONLINE_USER_CACHE_KEY_PREFIX}:${pattern}`
  }
}
