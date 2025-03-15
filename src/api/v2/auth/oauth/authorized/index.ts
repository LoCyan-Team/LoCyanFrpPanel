import All from './all.api'
import App from './app.api'
import Session from './session.api'

export default class Authorized {
  public all = new All()
  public app = new App()
  public session = new Session()
}
