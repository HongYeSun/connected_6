import { VideoPlayer } from '@enact/sandstone/VideoPlayer';
import { MediaControls } from '@enact/sandstone/MediaPlayer';
import Button from '@enact/sandstone/Button';
import { Spinner } from '@enact/sandstone/Spinner';
import React, { useState, useRef, useEffect } from 'react';
import Alert from '@enact/sandstone/Alert';
import css from './Main.module.less';
import axios from 'axios';

const Video = (prop) => {
	const videoRef = useRef();
	const accessToken = "s%3AmVZW5833LC8p_rJt2vL9pWClmxOUZkKl.GFZB3Ug22E7Re7Gm43IR%2BdoVj8vwM2I5zMHFXuNZhzU";
	const [loading, setLoading] = useState(true);
	const [isLikePopupOpen, openLikePopup] = useState(false);
	const [isBookmarkPopupOpen, openBookmarkPopup] = useState(false);
	const [alertMessage, setAlertMessage] = useState('');
	const [onPlayCount, setOnPlayCount] = useState(0);
	const [videostamp, setVideostamp] = useState(0);
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

	useEffect(() => {
		//console.log(document.cookie);
		const fetchVideos = async () => {
			try {
				const response = await axios.get(`/api/videos/${prop.id}`, prop.id);
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
		fetchVideos();
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


	const handlePopupOpen = (key) => {
		if (key === 'heart') {
			axios.post(`/api/videos/like/${prop.id}`, prop.id)
				.then(function (response) {
					const likeStatus = response.data;
					if (likeStatus.flag) {
						setAlertMessage("Liked!");
					} else {
						setAlertMessage("Like canceled!");
					}
				})
				.catch(function (error) {
					console.log(error);
				});
			openLikePopup(true);
		} else {
			axios.post(`/api/videos/bookmark/${prop.id}`, prop.id)
				.then(function (response) {
					const bookmarkStatus = response.data;
					if (bookmarkStatus.flag) {
						setAlertMessage("Bookmarked!");
					} else {
						setAlertMessage("Bookmark canceled!");
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

	const handleBackButtonClick = async () => {
		// prop.setVideoStamp(videoRef.current.getMediaState().currentTime); //서버 통신 전
		const video_stamp = Math.trunc(videoRef.current.getMediaState().currentTime);
		setVideostamp(video_stamp);
		try {
			console.log(video_stamp);
			const res = await axios.post(`/api/videos/${prop.id}`, {
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
						icon="playspeed"
						size="small"
						onClick={setPlayBack}
					/>
					<Button
						icon="star"
						size="small"
						onClick={() => handlePopupOpen('star')}
					/>
					<Button
						icon="heart"
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
		</div>
	);
};

export default Video;
