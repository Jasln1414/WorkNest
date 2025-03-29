// src/redux/store.js
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authenticationSliceReducer from './Authentication/authenticationSlice';
import userBasicDetailsSliceReducer from './UserDetails/userBasicDetailsSlice';

// Persistence configuration
const persistConfig = {
  key: 'root',
  storage,
};

// Combine individual reducers into a single root reducer function
const rootReducer = combineReducers({
  authentication_user: authenticationSliceReducer,
  user_basic_details: userBasicDetailsSliceReducer,
});

// Wrap the combined reducer with persistence
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);