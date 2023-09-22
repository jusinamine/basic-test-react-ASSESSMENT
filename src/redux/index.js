import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import persistReducer from "redux-persist/es/persistReducer";
import taskReducer from "./slices/task.slice";

const persistConfig = {
  key: "root",
  storage,
};

const reducers = combineReducers({
  taskReducer,
});

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
