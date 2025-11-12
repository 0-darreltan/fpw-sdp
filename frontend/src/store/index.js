import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "../features/users/userSlice";
import proposalReducer from "../features/proposal/proposalSlice";
import projectReducer from "../features/project/projectSlice";
import productReducer from "../features/product/productSlice";
import orderReducer from "../features/order/orderSlice";

const persistConfig = {
  key: "user",
  storage,
};

const persistUserReducer = persistReducer(persistConfig, userReducer);
const persistProposalReducer = persistReducer(persistConfig, proposalReducer);
const persistProjectReducer = persistReducer(persistConfig, projectReducer);
const persistProductReducer = persistReducer(persistConfig, productReducer);
const persistOrderReducer = persistReducer(persistConfig, orderReducer);

export const store = configureStore({
  reducer: {
    users: persistUserReducer,
    proposal: persistProposalReducer,
    project: persistProjectReducer,
    product: persistProductReducer,
    order: persistOrderReducer,
  },
});

export const persistor = persistStore(store);
