import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "../features/users/userSlice";
import proposalReducer from "../features/proposal/proposalSlice";
import projectReducer from "../features/project/projectSlice";
import productReducer from "../features/product/productSlice";
import orderReducer from "../features/order/orderSlice";
import paymentReducer from "../features/payment/paymentSlice";
import rabReducer from "../features/RAB/rabSlice";

const persistConfig = {
  key: "user",
  storage,
};

const persistUserReducer = persistReducer(persistConfig, userReducer);

export const store = configureStore({
  reducer: {
    users: persistUserReducer,
    proposal: proposalReducer,
    project: projectReducer,
    product: productReducer,
    order: orderReducer,
    payment: paymentReducer,
    rab: rabReducer,
  },
});

export const persistor = persistStore(store);
