// shop.js
import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: [],
  },
  reducers: {
    updateCartItems: (state, action) => {
      state.cartItems = action.payload;
    },
  },
});

export const { reducer, actions } = cartSlice;
export const { updateCartItems } = actions;
export default cartSlice.reducer;
