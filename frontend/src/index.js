import {createRoot} from 'react-dom/client';

import App from './App/App';
import {isBrowser} from './libs/utils';

let appElement = <App highContrast />;

if (isBrowser()) {
	const root = document.getElementById('root');
	createRoot(root).render(appElement);
	appElement = null;
}

export default appElement;
