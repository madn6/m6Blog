import { configureStore, combineReducers } from '@reduxjs/toolkit';
import userReducer from './users/userSlice';
import { persistReducer } from 'redux-persist';
import persistStore from 'redux-persist/es/persistStore';
import storage from 'redux-persist/lib/storage';
import themeReducer  from './theme/themeSlice'


const rootReducer = combineReducers({
	user: userReducer,
	theme:themeReducer
});

const persistConfig = {
	key: 'root',
	storage,
	version: 1
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
});

export const persistor = persistStore(store);
