/* eslint-disable */
import React, { useEffect, useState } from 'react';
import TabLayout, { Tab } from '@enact/sandstone/TabLayout';
import { Header, Panel } from '@enact/sandstone/Panels';
import { Image } from '@enact/sandstone/Image'
import $L from '@enact/i18n/$L';
import Home from './Home';
import Media from './Media';
import Account from './Account';
import HLSVideo from './HLSVideo';
import MyPlayer from './MyPlayer';
import Feed from './Feed';
import Status from './Status';

const Main = (props) => {

	const [profileImagePath, setProfileImagePath] = useState('');
	// const [videoPlayerSource, setVideoPlayerSource] = useState("http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4");
	useEffect(() => {
		// Retrieve the image path from session storage
		const imagePath = window.sessionStorage.getItem('profileImage');
		setProfileImagePath(imagePath);
	}, []);

	return (

		<Panel {...props}>

			<Header title={$L('WebOS Video Player')}>
				{ }
				{profileImagePath && (
					<Image
						sizing="fill"
						src={profileImagePath}
						style={{
							border: '#ffa500 dashed 1px',
							width: '75px',
							height: '100px',
						}}
					/>
				)}
			</Header>
			<TabLayout>
				<Tab title={$L('Feed')}>
					<Feed
					// setVideosrc={setVideoPlayerSource}
					// videosrc={videoPlayerSource}
					/>
				</Tab>
				<Tab title={$L('Home')}>
					<Home />
				</Tab>
				<Tab title={$L('HLS Video Player')}>
					<HLSVideo src="https://cdn-vos-ppp-01.vos360.video/Content/HLS_HLSCLEAR/Live/channel(PPP-LL-2HLS)/index.m3u8" />
				</Tab>
				<Tab title={$L('My Home')}>
					<MyPlayer />
				</Tab>
				<Tab title={$L('Status')}>
					<Status />
				</Tab>
				<Tab title={$L('Register')}>
					<Account />
				</Tab>
			</TabLayout>
		</Panel>
	);
};
export default Main;
