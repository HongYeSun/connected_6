// This is subscribe APIs.
import {useEffect, useRef, useState} from 'react';

import debugLog from '../libs/log';
import {getSystemInfo} from '../libs/services';

export const useConfigs = () => {
	const ref = useRef(null);
	const [value, setValue] = useState({returnValue: false});

	useEffect(() => {
		if (!ref.current) {
			debugLog('GET_CONFIGS[R]', {});
			ref.current = getSystemInfo({
				parameters: {
					subscribe: true,
					keys: ['modelName', 'firmwareVersion', 'UHD', 'sdkVersion']
				},
				onSuccess: res => {
					debugLog('GET_CONFIGS[S]', res);
					setValue(res);
				},
				onFailure: err => {
					debugLog('GET_CONFIGS[F]', err);
				}
			});
		}

		return () => {
			if (ref.current) {
				ref.current.cancel();
				ref.current = null;
			}
		};
	}, []);

	return value;
};
