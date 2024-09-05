import base from '@/api/base'
import { get } from '@/utils/request'

const root = async () => {
    const rs = await get(`${base.api_v1_url}/App`, {})
    return base.buildResponse(rs)
}

export default root
