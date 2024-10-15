import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router/router.jsx';
import './index.css';
import store from './app/store.js';
import { Provider } from 'react-redux';
import { DarkModeProvider } from './features/Darkmode/darkmodeProvider.jsx';
import { BadgeProvider } from './features/badge/badgeContext.jsx';
import { UserStatsProvider } from './features/badge/userStatsContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<Provider store={store}>
			<UserStatsProvider>
				<BadgeProvider>
					<DarkModeProvider>
						<RouterProvider router={router} />
					</DarkModeProvider>
				</BadgeProvider>
			</UserStatsProvider>
		</Provider>
	</React.StrictMode>
);
