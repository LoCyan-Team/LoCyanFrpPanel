import base from '@/api/base'
import { get } from '@/utils/request'

const EditEmail = async (username: string, token: string, email: string, code: string) => {
    const rs = await get(`${base.api_v1_url}/Account/EditEmail`, {
        username: username,
        token: token,
        email: email,
        code: code
    })
    return base.buildResponse(rs)
}

export default EditEmail
