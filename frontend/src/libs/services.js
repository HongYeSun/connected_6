import request from '../libs/request';

const sys = request('luna://com.webos.service.tv.systemproperty');
export const getSystemInfo = params =>
	sys({method: 'getSystemInfo', ...params});

const sam = request('luna://com.webos.applicationManager');
export const launch = parameters => sam({method: 'launch', parameters});

const mem = request('luna://com.webos.service.sdkagent/collector');
export const getStat = params =>
	mem({method: 'getData', ...params});