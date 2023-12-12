// This is bundle of states of Main.js

import {useCallback, useState} from 'react';
import * as services from '../libs/services';

export const usePopup = () => {
	const [isPopupOpen, openPopup] = useState(false);

	const handlePopupOpen = useCallback(() => {
		openPopup(true);
	}, []);

	const handlePopupClose = useCallback(() => {
		services.launch({id:'com.webos.app.self-diagnosis'})
		openPopup(false);
	}, []);

	return {isPopupOpen, handlePopupOpen, handlePopupClose};
};
