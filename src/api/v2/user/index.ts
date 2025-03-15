import Frp from './frp'
import Info from './info'
import Password from './password.api'
import Token from './token'
import Traffic from './traffic.api'
import Email from './email.api'

export default class User {
  public info = new Info()
  public token = new Token()
  public password = new Password()
  public traffic = new Traffic()
  public frp = new Frp()
  public email = new Email()
}
