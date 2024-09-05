import base from '@/api/base'
//@ts-ignore
import { get } from '@/utils/request'

const SendEditEmail = async (username: string, token: string, email: string) => {
    const rs = await get(`${base.api_v1_url}/Account/SendEditEmail`, {
        username: username,
        token: token,
        email: email
    })
    return base.buildResponse(rs)
}

export default SendEditEmail
