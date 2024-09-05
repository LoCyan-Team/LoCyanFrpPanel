import base from '@/api/base'
//@ts-ignore
import { post } from '@/utils/request'

const frp_token = async (username: string) => {
    const rs = await post(`${base.api_v2_url}/users/reset/frp_token`, {
        username: username
    })
    return base.buildResponse(rs)
}

export default frp_token
