// 封装和token相关的方法 存 取 删

const TOKEN_KEY = 'token'
function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
}

function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

function removeToken() {
  localStorage.removeItem(TOKEN_KEY)
}

export { setToken, getToken, removeToken }