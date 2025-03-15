import Register from './register.api'
import Password from './password.api'
import EmailX from './email.api'

export default class Email {
  public register = new Register()
  public password = new Password()
  public email = new EmailX()
}
