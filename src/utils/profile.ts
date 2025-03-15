import userData from './stores/userData/store'

export function logout() {
  userData.commit('delete_user_info')
}
