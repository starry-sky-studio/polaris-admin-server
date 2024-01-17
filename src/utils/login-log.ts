import IP2Region from 'ip2region'
import { Request } from 'express'
import { UAParser } from 'ua-parser-js'

/**
 * @description 获取ip所在地区
 * @param ip
 * @date 10/28/2023
 */
export const getAddressByIp = (ip: string): string => {
  if (!ip) return ''

  const query = new IP2Region()
  const res = query.search(ip)
  return [res.province, res.city].join(' ')
}

/**
 * @description 获取用户的操作系统和浏览器类型
 * @param ip
 * @date 10/28/2023
 */
export const getbrowserOs = (request: Request) => {
  const userAgent = request.headers['user-agent']
  const parser = new UAParser()
  const result = parser.setUA(userAgent).getResult()
  return {
    browser: result.browser.name ?? '',
    os: result.os.name ?? ''
  } as const
}
