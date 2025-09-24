// 组合redux子模块 + 导出store实例


import { configureStore } from "@reduxjs/toolkit";
import userReducer from "@/store/modules/user";

const store = configureStore({
  reducer: {
    user: userReducer,
  }
});

// 导出 RootState 类型
export type RootState = ReturnType<typeof store.getState>;

export default store;