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
  selectedCartItemIds: string[]
  cart: Cart | null;
  loading: boolean;
  error: string | null;
};

const initialState: CartState = {
  selectedCartItemIds: [],
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

    toggleSelectedCartItem: (state, action: PayloadAction<string>) => {
      const id = action.payload
      const index = state.selectedCartItemIds.indexOf(id)

      if (index === -1) {
        state.selectedCartItemIds.push(id)
      } else {
        state.selectedCartItemIds.splice(index, 1)
      }
    },

    setSelectedCartItemIds: (state, action: PayloadAction<string[]>) => {
      state.selectedCartItemIds = action.payload
    },
    
    removeSelectedCartItemSuccess: (state, action: PayloadAction<string[]>) => {
      if (state.cart) {
        state.loading = false;
        state.cart.items = state.cart.items.filter(
          (item) => !action.payload.includes(item._id),
        );
        state.selectedCartItemIds = state.selectedCartItemIds.filter(
          (id) => !action.payload.includes(id)
        )
      }
    },
    removeCartItemSuccess: (state, action: PayloadAction<string>) => {
      if (state.cart) {
        state.loading = false;
        state.cart.items = state.cart.items.filter(
          (item) => item._id !== action.payload
        );
        state.selectedCartItemIds = state.selectedCartItemIds.filter(
          (id) => id !== action.payload
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
  toggleSelectedCartItem,
  setSelectedCartItemIds,
  removeSelectedCartItemSuccess,
  removeCartItemSuccess,
} = cartSlice.actions;

export default cartSlice.reducer;
