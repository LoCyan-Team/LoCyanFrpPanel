import base from '@/api/base'
import { get } from '@/utils/request'

const GetBroadCast = async () => {
    const rs = await get(`${base.api_v1_url}/App/GetBroadCast`, {})
    return base.buildResponse(rs, false)
}

export default GetBroadCast
