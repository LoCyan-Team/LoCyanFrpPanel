import base from '@/api/base'
//@ts-ignore
import { get, post } from '@/utils/request'

const getPrize = async (user_id: number) => {
  const rs = get(`${base.api_v2_url}/prize`, {
    user_id: user_id
  })
  return base.buildResponse(await rs)
}

const joinPrize = async (user_id: number, prize_id: number) => {
  const rs = post(`${base.api_v2_url}/prize`, {
    user_id: user_id,
    prize_id: prize_id
  })
  return base.buildResponse(await rs)
}

const prize = {
  get: getPrize,
  join: joinPrize
}

export default prize
