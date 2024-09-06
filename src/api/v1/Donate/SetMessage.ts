import base from '@/api/base'
//@ts-ignore
import { get } from '@/utils/request'

/**
 * 列出赞助列表
 */
const SetMessage = async (
    username: string,
    token: string,
    trade_no: string,
    message: string

) => {
    const rs = get(`${base.api_v1_url}/Donate/SetMessage`, {
        username: username,
        token: token,
        trade_no: trade_no,
        message: message
    })
    return base.buildResponse(await rs, false)
}

export default SetMessage
