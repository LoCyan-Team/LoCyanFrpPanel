import base from '@/api/base'
//@ts-ignore
import { post } from '@/utils/request'

const password = async (username: string, old_password: string, new_password: string) => {
    const rs = await post(`${base.api_v2_url}/users/reset/password`, {
        username: username,
        old_password: old_password,
        new_password: new_password
    })
    return base.buildResponse(rs)
}

export default password
