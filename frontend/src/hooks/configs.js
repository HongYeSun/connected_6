// This is subscribe APIs.
import {useEffect, useRef, useState} from 'react';
import LS2Request from '@enact/webos/LS2Request';
import debugLog from '../libs/log';
import {getSystemInfo} from '../libs/services';

var webOSBridge = new LS2Request();

export const useInterval = (callback, delay) => {
    const savedCallback = useRef(callback);

    useEffect(() => {
        savedCallback.current = callback;
    });

    useEffect(() => {
      	// cf. delay 인자에 null 값을 전달할 경우 타이머를 멈출 수 있음
        if (delay === null) return;
        
        const timer = setInterval(() => savedCallback.current(), delay);
        return () => clearInterval(timer);
    }, [delay]);
}

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
					setValue(err);
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

export const useMem = () => {
	const [value, setValue] = useState({ returnValue: false });
	var parms = {
		"subscribe": true
	}

	return [
		value,
		event => {
			var lsRequest = {
				"service": "luna://com.webos.memorymanager",
				"method": "getUnitList",
				"parameters": parms,
				"onSuccess": res => {
					setValue(res);
				},
				"onFailure": res => {
					setValue("error" + JSON.stringify(res));
				}
			};
			webOSBridge.send(lsRequest);
		}]
}

export const useCpu = () => {
	const [value, setValue] = useState({ returnValue: false });
	var parms = {
		"subscribe": true
	}

	return [
		value,
		event => {
			var lsRequest = {
				"service": "luna://com.webos.memorymanager",
				"method": "getProcStat",
				"parameters": parms,
				"onSuccess": res => {
					setValue(res);
				},
				"onFailure": res => {
					setValue("error" + JSON.stringify(res));
				}
			};
			webOSBridge.send(lsRequest);
		}]
}