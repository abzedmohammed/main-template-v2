import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './app/store.js';
import { QueryClientProvider } from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { queryClient } from 'abzed-utils'

const asyncPersister = createAsyncStoragePersister({
  storage: window.localStorage,
});

persistQueryClient({
	queryClient,
	persister: asyncPersister,
});

createRoot(document.getElementById('root')).render(
	<>
		<QueryClientProvider client={queryClient}>
			<Provider store={store}>
				<PersistGate loading={null} persistor={persistor}>
					<App />
					<Toaster
						position='top-center'
						reverseOrder={false}
						toastOptions={{
							duration: 3500,
						}}
					/>
				</PersistGate>
			</Provider>
		</QueryClientProvider>
	</>
);
