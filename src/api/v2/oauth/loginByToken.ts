import base from '@/api/base'
import { get } from '@/utils/request'

const loginByToken = async (token: string) => {
    const rs = await get(`${base.api_v2_url}/oauth/loginByToken`, {
        token: token
    })
    return base.buildResponse(rs)
}

export default loginByToken
