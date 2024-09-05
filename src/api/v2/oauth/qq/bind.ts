import base from '@/api/base'
//@ts-ignore
import { get } from '@/utils/request'

const bind = async (username: string) => {
    const rs = await get(`${base.api_v2_url}/oauth/qq/bind`, {
        username: username
    })
    return base.buildResponse(rs)
}

export default bind
