import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Product {
  _id: string;
  name: string;
  price: number;
  image?: string;
  description?: string;
  stock?: number;
  category: string;
}

export interface CartItem {
  _id: string;
  product: Product;
  quantity: number;
  price: number;
}

interface Cart {
  _id: string;
  items: CartItem[];
  shippingFee: number;
  totalPrice: number;
}

type CartState = {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
};

const initialState: CartState = {
  cart: null,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    cartStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    cartSuccess: (state, action: PayloadAction<Cart>) => {
      state.loading = false;
      state.cart = action.payload;
    },
    cartFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateCartItemSuccess: (state, action: PayloadAction<CartItem>) => {
      state.loading = false;
      if (state.cart) {
        const index = state.cart.items.findIndex(
          (item) => item._id === action.payload._id,
        );
        if (index !== -1) {
          state.cart.items[index] = action.payload;
        }
      }
    },
    removeAllCartItemSuccess: (state) => {
      state.loading = false;
      state.cart = null;
    },
    removeSelectedCartItemSuccess: (state, action: PayloadAction<string[]>) => {
      if (state.cart) {
        state.loading = false;
        state.cart.items = state.cart.items.filter(
          (item) => !action.payload.includes(item._id),
        );
      }
    },
    removeCartItemSuccess: (state, action: PayloadAction<string>) => {
      if (state.cart) {
        state.loading = false;
        state.cart.items = state.cart.items.filter(
          (item) => item._id !== action.payload
        );
      }
    },
  },
});

export const {
  cartStart,
  cartSuccess,
  cartFailure,
  updateCartItemSuccess,
  removeAllCartItemSuccess,
  removeSelectedCartItemSuccess,
  removeCartItemSuccess,
} = cartSlice.actions;

export default cartSlice.reducer;
