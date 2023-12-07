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

	const [loading, setLoading] = useState(true);
	const [isLikePopupOpen, openLikePopup] = useState(false);
	const [isBookmarkPopupOpen, openBookmarkPopup] = useState(false);
	const [alertMessage, setAlertMessage] = useState('');
	const [onPlayCount, setOnPlayCount] = useState(0);
	const [videostamp, setVideostamp] = useState(0);
	const [videoInfo, setVideoInfo] = useState({
		title: "",
		subtitle: "",
		description: "",
		thumb: "",
		source: "",
		bookmark: 0,
		views: 0,
		like: 0,
		genderLikes: { male: 0, female: 0, other: 0 }
	});

	useEffect(() => {
		const fetchVideo = async () => {
			try {
				const response = await axios.get(`/api/videos/${prop.id}`);
				setVideoInfo(response.data);
				setLoading(false);
			} catch (error) {
				console.error('Error fetching videos:', error);
				setLoading(false);
			}
		};
		fetchVideo();
		{/*
		axios.post(`/api/lastwatched/${prop.id}`, videostamp)
			.then(function (response) {
				console.log("timestamp posted", response);
			})
			.catch(function (error) {
				console.log(error);
			});*/}
	}, []);


	const handlePopupOpen = (key) => {
		if (key === 'heart') {
			if (videoInfo.video.like === 0) {
				setAlertMessage("Liked!");
				videoInfo.video.like = 1;
			} else {
				setAlertMessage("Like canceled!");
				videoInfo.video.like = 0;
			}
			openLikePopup(true);
		} else {
			if (videoInfo.video.bookmark === 0) {
				setAlertMessage("Bookmarked!");
				videoInfo.video.bookmark = 1
			} else {
				setAlertMessage("Bookmark canceled!");
				videoInfo.video.bookmark = 0
			}
			openBookmarkPopup(true);
		}
	};

	const handleLikePopupClose = () => {
		axios.post(`/api/videos/like/${prop.id}`, prop.id)
			.then(function (response) {
				// console.log("like result", response);
			})
			.catch(function (error) {
				console.log(error);
			});
		openLikePopup(false);
	};

	const handleBookmarkPopupClose = () => {
		axios.post(`/api/videos/bookmark/${prop.id}`, prop.id)
			.then(function (response) {
				// console.log("bookmark result", response);
			})
			.catch(function (error) {
				console.log(error);
			});
		openBookmarkPopup(false);
	};

	const handleBackButtonClick = () => {
		prop.setVideoStamp(videoRef.current.getMediaState().currentTime); // 서버 통신 전

		{/*setVideostamp(videoRef.current.getMediaState().currentTime);
		axios.post(`/api/lastwatched/${prop.id}`, videostamp)
			.then(function (response) {
				console.log("timestamp posted", response);
			})
			.catch(function (error) {
				console.log(error);
			});*/}

		prop.setActiveTab(0);
	};

	const gotoStartTime = async () => {
		if (onPlayCount === 0) {
			videoRef.current.seek(prop.videoStamp); // 서버 통신 전

			{/*axios.get(`/api/lastwatched/${prop.id}`)
				.then(response => {
					const data = response.data;
					if (data.time.length > 0) {
						videoRef.current.seek(data.time);
					}
				})
			.catch(error => console.error('Error fetching data:', error));*/}
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
				title={videoInfo.video.title}
				thumbnailSrc={videoInfo.video.thumb}
				poster={videoInfo.video.thumb}
				titleHideDelay={4000}
				jumpBy={10}
				onPlay={gotoStartTime}
				onBack={handleBackButtonClick}
			>
				<source src={prop.src} type="video/mp4" />
				<infoComponents>
					{videoInfo.video.description}
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
