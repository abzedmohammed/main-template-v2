import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import crudReducer from '../features/crud/crudSlice';
import authReducer from '../features/auth/authSlice';
import globalReducer from '../features/global/globalSlice';

const persistConfig = {
	key: 'root',
	storage,
};

const rootReducer = combineReducers({
	crud: crudReducer,
	auth: authReducer,
	global: globalReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
});

export const persistor = persistStore(store);
