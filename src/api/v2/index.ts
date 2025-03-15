import Sign from './sign.api'
import ICP from './icp.api'
import Captcha from './captcha.api'
import Comment from './comment.api'
import Prize from './prize.api'

import User from './user'
import Proxy from './proxy'
import App from './app'
import Auth from './auth'
import Donate from './donate'
import Node from './node'
import Email from './email'
import Notice from './notice'
import Minecraft from './minecraft'
import Verification from './verification'

export default class V2 {
  public sign = new Sign()
  public icp = new ICP()
  public captcha = new Captcha()
  public comment = new Comment()
  public prize = new Prize()

  public user = new User()
  public proxy = new Proxy()
  public app = new App()
  public auth = new Auth()
  public email = new Email()
  public node = new Node()
  public donate = new Donate()
  public notice = new Notice()
  public minecraft = new Minecraft()
  public verification = new Verification()
}
