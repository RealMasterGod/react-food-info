import {configureStore,combineReducers} from "@reduxjs/toolkit"
import cartReducer from "./cart/cartSlice"
import productReducer from "./products/productSlice"
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
  } from "redux-persist";
  import storage from "redux-persist/lib/storage";

const persistConfig = {
    key: "root",
    version: 1,
    storage,
    blacklist: ['product']
  };
  
  const rootReducer = combineReducers({product: productReducer, cart: cartReducer})
  
  const persistedReducer = persistReducer(persistConfig, rootReducer);
  export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  });

  export let persistor = persistStore(store)

// export const store = configureStore({
//     reducer: {
//         cart: cartReducer,
//         product: productReducer
//     }
// })

