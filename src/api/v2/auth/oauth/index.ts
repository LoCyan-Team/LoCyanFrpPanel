import QQ from './qq'
import Permission from './permission'
import Authorize from './authorize.api'
import Authorized from './authorized'

export default class OAuth {
  public qq = new QQ()
  public permission = new Permission()
  public authorize = new Authorize()
  public authorized = new Authorized()
}
