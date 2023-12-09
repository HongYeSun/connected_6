import {configureStore} from '@reduxjs/toolkit';
import {act, render, fireEvent} from '@testing-library/react';

import {FloatingLayerDecorator} from '@enact/ui/FloatingLayer';

import App from '../App';

// For cucumber APIs
export const pushBackButton = fn => {
	fn('User pushes back button on remote control.', () => {
		fireEvent.keyUp(window, {keyCode: 461});
	});
};

export const renderWithRedux = async (
	ui,
	{floating = false}
) => {
	const FloatingLayer = FloatingLayerDecorator('div');
	let newUI = ui;
	if (floating) {
		newUI = <FloatingLayer>{ui}</FloatingLayer>;
	}
	let results;
	await act(async () => {
		results = await render(<div>{newUI}</div>);
	});
	return {...results};
};

const launch = (params = {}) => {
	return renderWithRedux(<App />, params);
};

export default launch;
