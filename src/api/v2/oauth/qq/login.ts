import base from '@/api/base'
//@ts-ignore
import { get } from '@/utils/request'

const login = async (redirect_url: string) => {
    const rs = await get(`${base.api_v2_url}/oauth/qq/login`, {
        redirect_url: redirect_url
    })
    return base.buildResponse(rs)
}

export default login
