import auth from './auth'
import donate from './donate'
import icp from './icp.api'
import node from './node'
import proxy from './proxy'
import verfication from './verfication'
import sign from './sign.api'
import user from './user'
import email from './email'
import notice from './notice'

export default {
  user: user,
  auth: auth,
  email: email,
  verfication: verfication,
  proxy: proxy,
  node: node,
  donate: donate,
  sign: sign,
  icp: icp,
  notice: notice
}
