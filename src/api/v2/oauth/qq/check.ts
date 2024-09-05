import base from '@/api/base'
//@ts-ignore
import { get } from '@/utils/request'


/**
 * 获取 QQ 登录绑定状态
 * @returns {
 *   status: int,
 *   data: {
 *     msg: string
 *   }
 * }
 */
const check = async (username: string) => {
    const rs = await get(`${base.api_v2_url}/oauth/qq/check`, {
        username: username
    })
    return base.buildResponse(rs)
}

export default check
