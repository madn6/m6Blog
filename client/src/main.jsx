import { createRoot } from 'react-dom/client';
import { store, persistor } from './redux/store.js';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import './index.css';
import ThemeProvider from './components/ThemeProvider.jsx';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
	<PersistGate  persistor={persistor}>
		<Provider store={store}>
			<ThemeProvider>
				<App />
			</ThemeProvider>
		</Provider>
	</PersistGate>
);
