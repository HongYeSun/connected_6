import React, { useEffect, useState } from 'react';
import TabLayout, { Tab } from '@enact/sandstone/TabLayout';
import { Header, Panel } from '@enact/sandstone/Panels';
import { Image } from '@enact/sandstone/Image';
import $L from '@enact/i18n/$L';
import Home from './Home';
import Video from './Video';
import Account from './Account';
import HLSVideo from './HLSVideo';
import css from './Main.module.less';

const Main = (props) => {
    const [profileImagePath, setProfileImagePath] = useState('');
	const [username, setUsername] = useState('');

    useEffect(() => {
        const imagePath = window.sessionStorage.getItem('profileImage');
        const savedUsername = window.sessionStorage.getItem('username');
        setProfileImagePath(imagePath);
        setUsername(savedUsername);
    }, []);

    return (
		<div className={css.backGround}>
        <Panel {...props}>
            <Header title={$L('WebOS Video Player')}>
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
				<br></br><br></br>
				{username && <span>  Welcome {username}!</span>}
            </Header>
			<br></br>
            <TabLayout>
                <Tab title={$L('Home')}>
                    <Home />
                </Tab>
                <Tab title={$L('Video Player')}>
                    <Video src="http://media.w3.org/2010/05/sintel/trailer.mp4" />
                </Tab>
                <Tab title={$L('HLS Video Player')}>
                    <HLSVideo src="https://cdn-vos-ppp-01.vos360.video/Content/HLS_HLSCLEAR/Live/channel(PPP-LL-2HLS)/index.m3u8" />
                </Tab>
                <Tab title={$L('User List')}>
                    <Account />
                </Tab>
            </TabLayout>
        </Panel>
		</div>
    );
};

export default Main;
