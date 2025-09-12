import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import menuReducer from "./menuSlice"; 

const store = configureStore({
  reducer: {
    user: userReducer,
    menu: menuReducer, // 👈 把 menu 加进来
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
