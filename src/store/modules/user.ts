import { createSlice } from "@reduxjs/toolkit";
import { setToken as setTokenUtils, getToken, removeToken } from "@/utils";

const userStore = createSlice({
  name: 'user',
  initialState: {
    token: getToken() || '',
    userInfo: {},
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      setTokenUtils(action.payload);
    },
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    clearUserInfo: (state) => {
      state.token = ''
      state.userInfo = {}
      removeToken()
    },
  },
});

// 获取reducer函数
const userReducer = userStore.reducer;

// 获取action函数
const { setToken, setUserInfo, clearUserInfo } = userStore.actions;

// 导出action函数
export { setToken, setUserInfo, clearUserInfo };

export default userReducer;