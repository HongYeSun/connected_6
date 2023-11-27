/* eslint-disable */
import { useState } from 'react';
import ThemeDecorator from '@enact/sandstone/ThemeDecorator';
import Panels from '@enact/sandstone/Panels';
import Main from '../views/Main';
import Feed from '../views/Feed';
import Media from '../views/Media';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useBackHandler, useCloseHandler, useDocumentEvent } from './AppState';
import { isDevServe } from '../libs/utils';



/* istanbul ignore next*/
if (isDevServe()) {
	window.webOSSystem = {
		highContrast: 'off',
		close: () => { },
		platformBack: () => { },
		PmLogString: () => { },
		screenOrientation: 'landscape',
		setWindowOrientation: () => { }
	};
}

const App = props => {
	const [skinVariants, setSkinVariants] = useState({ highContrast: false });
	const handleBack = useBackHandler();
	const handleClose = useCloseHandler();
	useDocumentEvent(setSkinVariants);

	return (
		<Router>
			<Routes>
				{/* <Route path="/" element={<RegisterPage />} />
				<Route path="/profile-select" element={<ProfileSelectPage />} />
				<Route path="/login" element={<LoginPage />} /> */}
				<Route path="/media" element={<Media />} />
				<Route path="/feed" element={<Feed />} />
				<Route path="/" element={
					<Panels
						{...props}
						skinVariants={skinVariants}
						onBack={handleBack}
						onClose={handleClose}
					>
						<Main />
					</Panels>
				} />
			</Routes>
		</Router>
	);
};

export default ThemeDecorator(App);
