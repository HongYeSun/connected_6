export const isBrowser = () => typeof window === 'object';

export const isTVBrowser = () =>
	isBrowser() && typeof window.webOSSystem === 'object';

export const isDevServe = () =>
	process.env.NODE_ENV === 'development' && !window.PalmServiceBridge;

export const closeApp = isPlatform => {
	if (!isTVBrowser()) {
		return;
	}

	if (isPlatform) {
		window.webOSSystem.platformBack();
		return;
	}
	window.webOSSystem.close();
};

export const reload = () => {
	if (isTVBrowser()) {
		const {href} = window.location;
		const location = href.substring(0, href.lastIndexOf('/'));
		window.location.replace(`${location}/index.html`);
	}
};
