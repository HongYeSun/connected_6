/* eslint-disable */
import VideoPlayer from '@enact/sandstone/VideoPlayer';
import { MediaControls } from '@enact/sandstone/MediaPlayer';
import Button from '@enact/sandstone/Button';
// import { Panels } from '@enact/sandstone/Panels';
// import ThemeDecorator from '@enact/sandstone/ThemeDecorator';
// import Spotlight from '@enact/spotlight';
// import PropTypes from 'prop-types';
// import { useCallback, useEffect, useRef, useState } from 'react';

const Video = (prop) => {
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
				autoCloseTimeout={7000}
				backButtonAriaLabel="go to previous"
				feedbackHideDelay={3000}
				initialJumpDelay={400}
				jumpDelay={200}
				loop
				miniFeedbackHideDelay={2000}
				title="Sandstone VideoPlayer Sample Video"
				titleHideDelay={4000}
			    // jumpBy={10}
			>
				<source src={prop.src} type="video/mp4" />
				<infoComponents>
					A video about some things happening to and around some characters.
					Very exciting stuff.
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
					// onClick={handleBackButtonClick}
					/>
					<Button icon="playspeed" size="small" />
					{/* <Button
						icon="starhollow"
						size="small"
					// onClick={찜한 비디오에 추가}
					/>
					<Button
						icon="hearthollow"
						size="small"
					// onClick={좋아요한 비디오에 추가}
					/> */}
				</MediaControls>
			</VideoPlayer>
		</div>
	);
};

export default Video;
