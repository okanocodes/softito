import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import customerReducer from "./customerSlice";
import messageReducer from "./messageSlice";
import productReducer from "./productSlice";
import reportReducer from "./reportSlice";
import stockReducer from "./stockSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    customers: customerReducer,
    stock: stockReducer,
    products: productReducer,
    reports: reportReducer,
    messaging: messageReducer,
  },
});
