import { VideoPlayer } from '@enact/sandstone/VideoPlayer';
import { MediaControls } from '@enact/sandstone/MediaPlayer';
import { useCpu, useMem, useInterval } from '../hooks/configs';
import Button from '@enact/sandstone/Button';
import BodyText from '@enact/sandstone/BodyText';
import { Spinner } from '@enact/sandstone/Spinner';
import React, { useState, useRef, useEffect } from 'react';
import Alert from '@enact/sandstone/Alert';
import css from './Main.module.less';
import axios from 'axios';
const serverUri = process.env.REACT_APP_SERVER_URI;

const Video = (prop) => {
	const videoRef = useRef();
	//const accessToken = "s%3AmVZW5833LC8p_rJt2vL9pWClmxOUZkKl.GFZB3Ug22E7Re7Gm43IR%2BdoVj8vwM2I5zMHFXuNZhzU";
	const [loading, setLoading] = useState(true);
	const [isLikePopupOpen, openLikePopup] = useState(false);
	const [isBookmarkPopupOpen, openBookmarkPopup] = useState(false);
	const [alertMessage, setAlertMessage] = useState('');
	const [onPlayCount, setOnPlayCount] = useState(0);
	const [videostamp, setVideostamp] = useState(0);
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
	const [videoInfo, setVideoInfo] = useState({
		_id: "",
		title: "",
		description: "",
		genderViews: {
			male: 0,
			female: 0,
			other: 0
		},
		views: 0,
		createdAt: "",
		updatedAt: ""
	});
	const [icons, setIcon] = useState({
		like: "heart",
		bookmark: "star",
		adaptive: "arrowup"
	});

	const setData = async () => {
		setCpu();
		setMem();
	}

	useEffect(() => {
		//console.log(document.cookie);
		const fetchIcons = async () => {
			try {
				var response = await axios.get(`${serverUri}/api/videos/isliked/${prop.id}`);
				if(response.data.result) {
					setIcon({...icons, like: "heart"});
				}
				else {
					setIcon({...icons, like: "hearthollow"});
				}
				response = await axios.get(`${serverUri}/api/videos/isbookmarked/${prop.id}`);
				if(response.data.result) {
					setIcon({...icons, bookmark: "star"});
				}
				else {
					setIcon({...icons, bookmark: "starhollow"});
				}
			} catch (error) {
				console.error('Error fetching videos:', error);
			}
		};
		const fetchVideos = async () => {
			try {
				const response = await axios.get(`${serverUri}/api/videos/${prop.id}`, prop.id);
				console.log(response);
				const videoData = response.data;
				setVideoInfo(videoData.video);
				setVideostamp(videoData.lastWatched);
				setLoading(false);
			} catch (error) {
				console.error('Error fetching videos:', error);
				setLoading(false);
			}
		};

		setData();
		fetchVideos();
		fetchIcons();
	}, []);

	// function getCookie(name) {
	// 	var nameEQ = name + "=";
	// 	var ca = document.cookie.split(';');
	// 	for (var i = 0; i < ca.length; i++) {
	// 		var c = ca[i];
	// 		while (c.charAt(0) == ' ') c = c.substring(1, c.length);
	// 		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
	// 	}
	// 	return null;
	// }
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

	const handleStatClick = () => {
		setStatShow(!statShow);
		// console.log("toggle: " + statShow);
	};

	const handleBackButtonClick = async () => {
		// prop.setVideoStamp(videoRef.current.getMediaState().currentTime); //서버 통신 전
		const video_stamp = Math.trunc(videoRef.current.getMediaState().currentTime);
		setVideostamp(video_stamp);
		try {
			console.log(video_stamp);
			const res = await axios.post(`${serverUri}/api/videos/${prop.id}`, {
				"lastWatched": video_stamp
			}, prop.id)
			console.log(res);
		} catch (error) {
			console.log(error);
		}
		prop.setActiveTab(0);
	};

	const gotoStartTime = async () => {
		if (onPlayCount === 0) {
			// videoRef.current.seek(prop.videoStamp); // 서버 통신 전
			if (videostamp !== undefined) {
				videoRef.current.seek(videostamp);
			} else {
				videoRef.current.seek(0);
			}
			setOnPlayCount(1);
		}
	}

	const toggleFullScreen = () => {
		const element = document.getElementById('myvideo');
		const isFullScreen = document.fullscreenElement;
		if (isFullScreen) {
			document.exitFullscreen();
		} else {
			element.requestFullscreen();
		}
	};
	const setPlayBack = () => {
		videoRef.current.fastForward();
	};
	if (loading) {
		return (
			<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
				<Spinner size="large" />
			</div>
		);
	}

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
	}

	return (
		<div
			style={{
				height: '70vh',
				transform: 'scale(1)',
				transformOrigin: 'top',
				width: '70vw',
				display: 'flex',
				justifyContent: 'center',
				margin: '0 auto'
			}}
		>
			<VideoPlayer
				id='myvideo'
				noAutoPlay={true}
				ref={videoRef}
				autoCloseTimeout={3000}
				backButtonAriaLabel="go to previous"
				feedbackHideDelay={3000}
				// initialJumpDelay={400}
				jumpDelay={200}
				loop
				playbackRateHash={{ fastForward: ['1.25', '1.5', '2', '0.5', '0.75', '1.0'] }}
				miniFeedbackHideDelay={2000}
				title={videoInfo.title}
				// thumbnailSrc={videoInfo.video.thumb}
				// poster={videoInfo.video.thumb}
				titleHideDelay={4000}
				jumpBy={10}
				onPlay={gotoStartTime}
				onBack={handleBackButtonClick}
			>
				<source src={prop.src} type="video/mp4" />
				<infoComponents>
					{videoInfo.description}
				</infoComponents>
				<MediaControls
					jumpBackwardIcon="jumpbackward"
					jumpForwardIcon="jumpforward"
					pauseIcon="pause"
					playIcon="play"
				>
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
					<Button
						icon="list"
						size="small"
						onClick={handleBackButtonClick}
					/>
					<Button
						icon="help"
						size="small"
						onClick={handleStatClick}
					/>
					<Button
						icon="playspeed"
						size="small"
						onClick={setPlayBack}
					/>
					<Button
						id="bookmark"
						icon={icons.bookmark}
						size="small"
						onClick={() => handlePopupOpen('star')}
					/>
					<Button
						id="like"
						icon={icons.like}
						size="small"
						onClick={() => handlePopupOpen('heart')}
					/>
					<Button
						icon="fullscreen"
						size="small"
						onClick={toggleFullScreen}
					/>
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
				</MediaControls>
			</VideoPlayer>
			<div style={{
				position: "absolute",
				top: '20px',
				left: '0px'
			}}>
				{statShow ? <Status /> : null}
			</div>
		</div>
	);
};

export default Video;
