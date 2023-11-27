/* eslint-disable */
import { VideoPlayer, Video } from '@enact/sandstone/VideoPlayer';
import { MediaControls } from '@enact/sandstone/MediaPlayer';
import Button from '@enact/sandstone/Button';
import { useParams } from 'react-router-dom';
import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


const Media = () => {
	const videoRef = useRef();
	const currentTimeRef = useRef();
	
	const [videoDetails, setVideoDetails] = useState({
		title: '',
		subtitle: '',
		description: '',
		thumb: '',
		source: '',
		bookmark: 0,
		like: 0,
		views: 0
	});
	useEffect(() => {
		videoRef.current.seek(3); // 렌더링시 ref.seek(timeindex) 3초에서 시작?? 실패
		// console.log(videoRef);
	}, []);
	


	const handleBackButtonClick = (e) => {
		currentTimeRef.current = videoRef.current.getMediaState().currentTime;
		console.log(videoRef.current.getMediaState().currentTime); // 현재 재생 시간(ex.1.723578)
		console.log(currentTimeRef.current);// 위의 값 복사한 currentTimeRef.current
		
        navigate(-1, {
            state: {
                currentTime: {currentTimeRef} //currentTime Feed에 navigate하며 재생시간 보내봄
            },
        });
    };
	
	// const handleBackButtonClick = () => {
	// 	currentTimeRef.current = videoRef.current.getMediaState().currentTime;
	// 	console.log(videoRef.current.getMediaState().currentTime);
	// 	console.log(currentTimeRef.current);
	// 	navigate(-1);
	// 	videoRef.current.seek(videoState.currentTime + 3);
	// 	console.log(videoRef.current.getMediaState());
	// };

	

	const navigate = useNavigate();
	const location = useLocation();
	const videoInfo = { ...location.state };


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
			<div>Sample code</div>
			<VideoPlayer
				// noAutoPlay={true}
				ref={videoRef}
				autoCloseTimeout={5000}
				backButtonAriaLabel="go to previous"
				feedbackHideDelay={3000}
				initialJumpDelay={400}
				jumpDelay={200}
				loop
				miniFeedbackHideDelay={2000}
				title={videoInfo.title}
				poster={videoInfo.thumb}
				thumbnailSrc={videoInfo.thumb}
				titleHideDelay={4000}
				jumpBy={10}
				// back버튼 누르면 현재재생시간,좋아요/북마크 여부 저장
				onBack={handleBackButtonClick}
			>
				<source src={videoInfo.videosrc} type="video/mp4" />
				<infoComponents>
					{videoInfo.desc}
				</infoComponents>
				<MediaControls
					jumpBackwardIcon="jumpbackward"
					jumpForwardIcon="jumpforward"
					pauseIcon="pause"
					playIcon="play"
				>
					<Button
						icon="list"
						size="small"
						onClick={handleBackButtonClick}
					/>
					<Button icon="playspeed" size="small" />

				</MediaControls>
			</VideoPlayer>
			<Button
				icon="starhollow"
				size="small"
			/>
			<Button
				icon="hearthollow"
				size="small"
				
			/>
		</div>
	);
};

export default Media;
