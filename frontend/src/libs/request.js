import LS2Request from '@enact/webos/LS2Request';

import {isDevServe} from './utils';

const send = (Req, service, params) => {
	if (params.parameters?.subscribe) {
		return new Req().send({...params, service});
	}

	return new Promise((onSuccess, onFailure) =>
		new Req().send({
			...params,
			service,
			onSuccess,
			onFailure
		})
	);
};

const request = service => params => {
	/* istanbul ignore if */
	if (isDevServe()) {
		// eslint-disable-next-line
		const req = require('../../__mocks__/@enact/webos/LS2Request');
		return send(req.default, service, params);
	}

	return send(LS2Request, service, params);
};

export default request;
