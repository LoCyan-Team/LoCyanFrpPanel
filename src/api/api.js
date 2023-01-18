import {get,post} from '../utils/request.js';
 
let apiFun = null;

apiFun.postLogin = p => post('api/v1/users/my_address/address_edit_before', p)

export default apiFun;