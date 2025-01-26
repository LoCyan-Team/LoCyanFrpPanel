import auth from './auth'
import donate from './donate'
import icp from './icp.api'
import node from './node'
import proxy from './proxy'
import verification from './verification'
import sign from './sign.api'
import user from './user'
import email from './email'
import notice from './notice'
import minecraft from './minecraft'
import app from './app'
import captcha from './captcha.api'
import prize from './prize'
import comment from './comment.api'

export default {
  user: user,
  auth: auth,
  email: email,
  verification: verification,
  proxy: proxy,
  node: node,
  donate: donate,
  sign: sign,
  icp: icp,
  notice: notice,
  minecraft: minecraft,
  app: app,
  captcha: captcha,
  prize: prize,
  comment: comment
}
