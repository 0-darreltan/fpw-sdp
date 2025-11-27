import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "../features/users/userSlice";
import projectReducer from "../features/project/projectSlice";
import productReducer from "../features/product/productSlice";
import orderReducer from "../features/order/orderSlice";
import paymentReducer from "../features/payment/paymentSlice";
import rabReducer from "../features/RAB/rabSlice";
import materialRequestReducer from "../features/materialRequest/materialRequestSlice";
import cartReducer from "../features/cart/cartSlice";
import purchaseCartReducer from "../features/purchaseCart/purchaseCartSlice";
import activityReducer from "../features/activity/activitySlice";
import checkoutReducer from "../features/checkout/checkoutSlice";
import shippingReducer from "../features/shipping/shippingSlice";
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

const persistConfig = {
  key: "user",
  storage,
};

const cartPersistConfig = {
  key: "cart",
  storage, // localStorage - persist cart
  whitelist: ["items"], // Only persist items array
};

const purchaseCartPersistConfig = {
  key: "purchaseCart",
  storage,
  whitelist: ["items"],
};

const persistUserReducer = persistReducer(persistConfig, userReducer);
const persistCartReducer = persistReducer(cartPersistConfig, cartReducer);
const persistPurchaseCartReducer = persistReducer(
  purchaseCartPersistConfig,
  purchaseCartReducer
);

export const store = configureStore({
  reducer: {
    users: persistUserReducer,
    project: projectReducer,
    product: productReducer,
    order: orderReducer,
    payment: paymentReducer,
    rab: rabReducer,
    materialRequest: materialRequestReducer,
    cart: persistCartReducer,
    purchaseCart: persistPurchaseCartReducer,
    checkout: checkoutReducer,
    activity: activityReducer,
    shipping: shippingReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
