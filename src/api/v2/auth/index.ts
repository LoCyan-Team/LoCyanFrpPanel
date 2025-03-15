import Login from './login.api'
import OAuth from './oauth'
import Register from './register.api'

export default class Auth {
  public login = new Login()
  public register = new Register()
  public oauth = new OAuth()
}
