import base from '@/api/base'
import { get } from '@/utils/request'

const check = async (username: string) => {
    const rs = await get(`${base.api_v2_url}/oauth/qq/check`, {
        username: username
    })
    return base.buildResponse(rs)
}

export default check
