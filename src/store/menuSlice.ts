// src/features/menu/menuSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
}

interface MenuState {
  items: MenuItem[];
  selectedItem?: MenuItem;
}

const initialState: MenuState = {
  items: [],
  selectedItem: undefined,
};

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    addMenuItem: (state, action: PayloadAction<MenuItem>) => {
      state.items.push(action.payload);
    },
    removeMenuItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    selectMenuItem: (state, action: PayloadAction<string>) => {
      state.selectedItem = state.items.find((item) => item.id === action.payload);
    },
    clearSelection: (state) => {
      state.selectedItem = undefined;
    },
  },
});

export const { addMenuItem, removeMenuItem, selectMenuItem, clearSelection } =
  menuSlice.actions;

export default menuSlice.reducer;