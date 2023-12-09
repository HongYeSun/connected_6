const adjustPath = path => {
	let tmp = path;
	if (!/^(luna|palm):\/\//.test(path)) {
		tmp = `luna://${path}`;
	}
	if (tmp.slice(-1) !== '/') {
		tmp = `${tmp}/`;
	}
	return tmp;
};

const splitAt = index => p =>
	[p.slice(0, index >= 0 ? index : 0), p.slice(index + 1)];

const parseLS2Uri = uri => {
	const [, path] = uri.split('//');
	const [service] = path.split('/');
	const pathname = path.slice(path.indexOf('/'));
	let [category, method] = splitAt(pathname.lastIndexOf('/'))(pathname);
	category = `${category}/`;
	return {service, category, method};
};

const getHash = ({service, category, method}, params) => {
	const sig = `${service}${category}${method}${JSON.stringify(params)}`;
	let hash = 0;
	if (sig.length === 0) return hash;
	for (let i = 0; i < sig.length; ++i) {
		const chr = sig.charCodeAt(i);
		hash = (hash << 5) - hash + chr;
		hash |= 0; // Convert to 32bit integer
	}
	return hash;
};

// Please add methods not to use hash name.
const methods = ['launch'];

class LS2Request {
	send({
		service = '',
		method = '',
		onSuccess = () => {},
		onFailure = () => {},
		onComplete = () => {},
		parameters = {},
		subscribe = false
	}) {
		let params = {...parameters};
		const fullUri = `${adjustPath(service)}${method}`;
		const parsedUri = parseLS2Uri(fullUri);
		if (subscribe) {
			params.subscribe = subscribe;
		}
		let filepath = `${parsedUri.service}${parsedUri.category}${parsedUri.method}`;
		if (!methods.includes(method)) {
			filepath = `${filepath}${getHash(parsedUri, params)}`;
		}
		try {
			const res = require(`../../${filepath}.json`);
			if (res.errorCode || res.returnValue === false) {
				onFailure(res);
			} else {
				onSuccess(res);
			}

			onComplete(res);
		} catch (err) {
			// eslint-disable-next-line no-console
			console.log({service, method, parameters});
			onFailure(err);
			onComplete(err);
		}
		return this;
	}
	cancel() {}
}

export default LS2Request;
