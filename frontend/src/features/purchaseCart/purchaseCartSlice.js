import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const purchaseCartSlice = createSlice({
  name: "purchaseCart",
  initialState,
  reducers: {
    addItem: (state, action) => {
      // action.payload: { productId, productName, price, unit, quantity }
      const p = action.payload;
      const idx = state.items.findIndex((it) => it.productId === p.productId);
      if (idx >= 0) {
        state.items[idx].quantity = (state.items[idx].quantity || 0) + (p.quantity || 1);
      } else {
        state.items.push({
          productId: p.productId,
          productName: p.productName || "",
          price: p.price || 0,
          unit: p.unit || "",
          quantity: p.quantity || 1,
        });
      }
    },
    updateQuantity: (state, action) => {
      // { productId, quantity }
      const { productId, quantity } = action.payload;
      const idx = state.items.findIndex((it) => it.productId === productId);
      if (idx >= 0) {
        if (quantity <= 0) {
          state.items.splice(idx, 1);
        } else {
          state.items[idx].quantity = quantity;
        }
      }
    },
    removeItem: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter((it) => it.productId !== productId);
    },
    clearCart: (state) => {
      state.items = [];
    },
    setItems: (state, action) => {
      state.items = action.payload || [];
    },
  },
});

export const actionPurchaseCart = {
  ...purchaseCartSlice.actions,
};

export default purchaseCartSlice.reducer;
    