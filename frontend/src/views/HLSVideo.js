import {useState, useRef, useEffect, useCallback} from 'react';
import { useCpu, useMem, useInterval } from '../hooks/configs';
import Button from '@enact/sandstone/Button';
import BodyText from '@enact/sandstone/BodyText';
import Alert from '@enact/sandstone/Alert';
import css from './Main.module.less';
import axios from 'axios';
const serverUri = process.env.REACT_APP_SERVER_URI;
import Hls from 'hls.js';


const HLSVideo = (prop) => {
	const videoRef = useRef(null);
	const hlsRef = useRef(null);
	const [isLikePopupOpen, openLikePopup] = useState(false);
	const [isBookmarkPopupOpen, openBookmarkPopup] = useState(false);
	const [alertMessage, setAlertMessage] = useState('');
	const [statShow, setStatShow] = useState(false);
	const [data_cpu, setCpu] = useCpu({ returnValue: false });
	const [data_mem, setMem] = useMem({ returnValue: false });
	const [parsedData, setParsedData] = useState({
		level: '',
		available: '',
		total: '',
		idle: '',
		irq: '',
		user: '',
		system: ''
	});
	const [icons, setIcon] = useState({
		like: "hearthollow",
		bookmark: "star",
		adaptive: "arrowup"
	});

	const setData = async () => {
		setCpu();
		setMem();
	}

	useEffect(() => {
		const fetchIcons = async () => {
			try {
				var response = await axios.get(`${serverUri}/api/videos/isliked/${prop.id}`);
				if(response.data.result) {
					setIcon({...icons, like: "heart"});
				}
				else {
					setIcon({...icons, like: "hearthollow"});
				}
				console.log("like response" + response.data.result);
				response = await axios.get(`${serverUri}/api/videos/isbookmarked/${prop.id}`);
				if(response.data.result) {
					setIcon({...icons, bookmark: "star"});
				}
				else {
					setIcon({...icons, bookmark: "starhollow"});
				}
			} catch (error) {
				console.error('Error fetching icons:', error);
			}
		};

		if (Hls.isSupported()) {
			const video = videoRef.current;
			const hls = new Hls();
			hls.loadSource(prop.src);
			hls.attachMedia(video);

			// triggered when the loaded manifest is parsed.s
			hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
				console.log(
					'>>>>>>>>>>>> manifest loaded, found ' +
						data.levels.length +
						' quality level'
				);
				video.play();
			});
			hlsRef.current = hls;

			// triggered when a new segment (fragment) is loaded.
			// eslint-disable-next-line
			hls.on(Hls.Events.FRAG_LOADED, function (event, data) {
				console.log(
					'========================================================='
				);
				console.log(
					'>>>>>>>>>>>> Estimated bandwidth:',
					hls.bandwidthEstimate + ' bps'
				);

				const index = hls.currentLevel;
				const level = hls.levels[index];

				console.log('>>>>>>>>>>>> currentLevel:', hls.currentLevel);
				console.log('>>>>>>>>>>>> levels:', hls.levels);
				console.log('>>>>>>>>>>>> loadLevel:', hls.loadLevel);

				if (level) {
					if (level.height) {
						console.log(
							'>>>>>>>>>>>> Selected resolution:',
							level.height + 'p'
						);
					}
					if (level.bitrate) {
						console.log(
							'>>>>>>>>>>>> Selected bandwidth:',
							Math.round(level.bitrate / 1000) + ' kbps'
						);
						if (index !== -1 && index >= 0) {
							console.log(
								'>>>>>>>>>>>> Selected bandwidth:',
								hls.levels[index].attrs.BANDWIDTH + ' bps'
							);
						}
					}
				}
			});
		}

		setData();
		fetchIcons();
	}, [prop.src]);

	useEffect(() => {
        if (data_cpu.returnValue) {
            const statArray = data_cpu.stat || [];
            console.log(statArray);
            const cpuLine= statArray.find(line => line.startsWith("cpu "));
            console.log(cpuLine);

            if(cpuLine) {
                const [, user, system, nice, idle] = cpuLine.split(/\s+/).map(Number);
                console.log(user+ " " +system+ " "+nice+" " +idle);
                setParsedData({
                    ...parsedData,
                    user: user,
                    system: system,
                    nice: nice,
                    idle: idle
                });
            }
            else {
                setParsedData({
                    ...parsedData,
                    user: "no cpu line",
                    system: "no cpu line",
                    nice: "no cpu line",
                    idle: "no cpu line"
                });
            }
        }
    }, [data_cpu]);

    useEffect(() => {
        if (data_mem.returnValue) {
            const vmallocInfo = data_mem.vmallocInfo || {};
            const curVmallocSize = vmallocInfo.cur_vmallocSize || 0;
            const initVmallocSize = vmallocInfo.init_vmallocSize || 0;
            const swapUsed = data_mem.swapUsed || 0;
            const usableMemory = data_mem.usable_memory || 0;

            setParsedData({
                ...parsedData,
                cur_vmallocSize: curVmallocSize,
                init_vmallocSize: initVmallocSize,
                swapUsed: swapUsed,
                usable_memory: usableMemory
            });
        }
    }, [data_mem]);

	useInterval(() => {
		if (statShow) {
			setData();
		}
	}, 1000);

	const handlePopupOpen = (key) => {
		if (key === 'heart') {
			axios.post(`${serverUri}/api/videos/like/${prop.id}`, prop.id)
				.then(function (response) {
					const likeStatus = response.data;
					if (likeStatus.flag) {
						setAlertMessage("Liked!");
						setIcon({ ...icons, like: "heart" });
					} else {
						setAlertMessage("Like canceled!");
						setIcon({ ...icons, like: "hearthollow" });
					}
				})
				.catch(function (error) {
					console.log(error);
				});
			openLikePopup(true);
		} else {

			axios.post(`${serverUri}/api/videos/bookmark/${prop.id}`, prop.id)
				.then(function (response) {
					const bookmarkStatus = response.data;
					if (bookmarkStatus.flag) {
						setAlertMessage("Bookmarked!");
						setIcon({ ...icons, bookmark: "star" });
					} else {
						setAlertMessage("Bookmark canceled!");
						setIcon({ ...icons, bookmark: "starhollow" });
					}
				})
				.catch(function (error) {
					console.log(error);
				});
			openBookmarkPopup(true);
		}
	};

	const handleLikePopupClose = () => {
		openLikePopup(false);
	};

	const handleBookmarkPopupClose = () => {
		openBookmarkPopup(false);
	};

	const handleAdaptiveClick = useCallback(() => {
		console.log("level: " + hlsRef.current.currentLevel);
		if(hlsRef.current.currentLevel != 0) {
			hlsRef.current.currentLevel = 0;
			setIcon({ ...icons, adaptive: "arrowuphollow" });
		}
		else {
			hlsRef.current.currentLevel = -1;
			setIcon({ ...icons, adaptive: "arrowup" });
		}
	}, []);

	const handleStatClick = () => {
		setStatShow(!statShow);
	};

	const handleBackButtonClick = async () => {
		hlsRef.current.destroy();
		prop.setActiveTab(0);
	};

	// const handleZeroClick = useCallback(() => {
	// 	console.log('Button clicked!');
	// 	hlsRef.current.currentLevel = 0;
	// }, []);

	// const handleAutoClick = useCallback(() => {
	// 	console.log('Button clicked!');
	// 	hlsRef.current.currentLevel = -1; // Auto resolution switching
	// }, []);

	function Status() {
		const cpu=100 - (parsedData.idle/(parsedData.idle+parsedData.user+parsedData.system+parsedData.nice))*100;
		const mem=100 - (Number(parsedData.usable_memory)
		/(Number(parsedData.swapUsed)+Number(parsedData.usable_memory)
		+Number(parsedData.cur_vmallocSize)))*100;
		return (
			<>
				<BodyText>{`Cpu: ${cpu}%`}</BodyText>
                <BodyText>{`Memory: ${mem}%`}</BodyText>
			</>
		);
	};

	return (
		<>
			<div>
				<Button icon="arrowhookleft" size="small" onClick={handleBackButtonClick} />
				<Button icon="help" size="small" onClick={handleStatClick} />
				<Button id="bookmark" icon={icons.bookmark} size="small" onClick={() => handlePopupOpen('star')} />
				<Button id="like" icon={icons.like} size="small" onClick={() => handlePopupOpen('heart')} />
				<Button id="adaptive" icon={icons.adaptive} size="small" onClick={handleAdaptiveClick} />
			</div>
			<Alert type="overlay" open={isLikePopupOpen} onClose={handleLikePopupClose}>
					<span>{alertMessage}</span>
					<buttons>
						<Button
							size="small"
							className={css.buttonCell}
							onClick={handleLikePopupClose}
						>
							{('OK')}
						</Button>
					</buttons>
				</Alert>
				<Alert type="overlay" open={isBookmarkPopupOpen} onClose={handleBookmarkPopupClose}>
					<span>{alertMessage}</span>
					<buttons>
						<Button
							size="small"
							className={css.buttonCell}
							onClick={handleBookmarkPopupClose}
						>
							{('OK')}
						</Button>
					</buttons>
				</Alert>
			<div style={{
				position: "absolute",
				top: '100px',
				left: '0px'
			}}>
				{statShow ? <Status /> : null}
			</div>

			<video ref={videoRef} controls height={720} />
		</>
	);
};

export default HLSVideo;