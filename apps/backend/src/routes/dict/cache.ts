/** 同一字典不同状态的全量查询共用 Redis Hash，写入后统一失效。 */
export function getDictDetailCacheKey(dictType: string) {
  return `dict:detail:${dictType}`
}
