jest.mock('../libs/log');
import '@testing-library/jest-dom';
import {act} from '@testing-library/react';

import debugLog from '../libs/log';
import launch from '../libs/testutils';

beforeEach(() => {
	window.webOSSystem = {
		PmLogString: jest.fn(),
		close: jest.fn(),
		setWindowOrientation: jest.fn()
	};
});

afterEach(() => {
	debugLog.mockRestore();
});

describe('The app handles document events.', () => {
	test('The app is reloaded when locale has changed.', async () => {
		const {location} = window;
		delete window.location;
		window.location = {
			href: 'http://localhost/',
			replace: jest.fn()
		};
		await launch();
		/* eslint-disable-next-line no-undef */
		const event = new CustomEvent('webOSLocaleChange');
		await act(async () => {
			await document.dispatchEvent(event);
		});
		expect(window.location.replace).toBeCalledWith(
			'http://localhost/index.html'
		);
		window.location = location;
	});
});
