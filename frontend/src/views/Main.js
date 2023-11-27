import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TabLayout, { Tab } from '@enact/sandstone/TabLayout';
import { Header, Panel } from '@enact/sandstone/Panels';
import { Image } from '@enact/sandstone/Image';
import { Icon } from '@enact/sandstone/Icon';
import { Scroller } from '@enact/sandstone/Scroller';
import $L from '@enact/i18n/$L';
import Home from './Home';
import Video from './Video';
import Account from './Account';
import HLSVideo from './HLSVideo';
import MyProfile from './MyProfile';
import MyPlayer from './MyPlayer';
import Feed from './Feed'; 
import css from './Main.module.less';
import profileImage1 from '../images/profile1.png';
import profileImage2 from '../images/profile2.png';
import profileImage3 from '../images/profile3.png';
import profileImage4 from '../images/profile4.png';
import profileImage5 from '../images/profile5.png';
import profileImage6 from '../images/profile6.png';
import profileImage7 from '../images/profile7.png';
import profileImage8 from '../images/profile8.png';
import profileImage9 from '../images/profile9.png';
import profileImage10 from '../images/profile10.png';
import profileImage11 from '../images/profile11.png';
import profileImage12 from '../images/profile12.png';
import profileImage13 from '../images/profile13.png';
import profileImage14 from '../images/profile14.png';
import profileImage15 from '../images/profile15.png';

const Main = (props) => {
    const [profilePictureNumber, setProfilePictureNumber] = useState('');
    const [username, setUsername] = useState('');
    const [videoPlayerSource, setVideoPlayerSource] = useState("http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4");

    const profileImageMap = {
        1: profileImage1,
        2: profileImage2,
        3: profileImage3,
        4: profileImage4,
        5: profileImage5,
        6: profileImage6,
        7: profileImage7,
        8: profileImage8,
        9: profileImage9,
        10: profileImage10,
        11: profileImage11,
        12: profileImage12,
        13: profileImage13,
        14: profileImage14,
        15: profileImage15
    };

    useEffect(() => {
        const userId = window.sessionStorage.getItem('userId');
        if (userId) {
            axios.get(`/api/users/${userId}`)
                .then(response => {
                    const userData = response.data;
                    setUsername(userData.username);
                    setProfilePictureNumber(userData.profilePicture);
                })
                .catch(error => console.error('Error fetching user data:', error));
        }
    }, []);

    return (
        <div className={css.backGround}>
            <Scroller>
            <Panel {...props}>
                <Header className={css.Title} title={$L('LG X Sogang Univ WebOS Video Player')}>
                    {profilePictureNumber && (
                        <Image
                            sizing="fill"
                            src={profileImageMap[profilePictureNumber]}
                            style={{
                                border: '#ffa500 1px',
                                width: '100px',
                                height: '100px',
                                borderRadius: '5px'
                            }}
                        />
                    )}
                    <br/><br/>
                    {username && (
                        <div className={css.welcomeMessage}>
                            <Icon size="small">profile</Icon>
                            Welcome {username}!
                        </div>
                    )}
                </Header>
			<br></br>
            <Scroller>
            <TabLayout>
                    <Tab title={<><Icon>home</Icon> {$L('Home')}</>}>
                        <Home />
                    </Tab>
                    <Tab title={<><Icon>stargroup</Icon> {$L('Feed')}</>}>
                        <Feed
                            setVideosrc={setVideoPlayerSource}
                            videosrc={videoPlayerSource}
                        />
                    </Tab>
                    <Tab title={<><Icon>play</Icon> {$L('Video Player')}</>}>
                        <Video src={videoPlayerSource} />
                    </Tab>
                    <Tab title={<><Icon>liverecord</Icon> {$L('HLS Video Player')}</>}>
                        <HLSVideo src="https://cdn-vos-ppp-01.vos360.video/Content/HLS_HLSCLEAR/Live/channel(PPP-LL-2HLS)/index.m3u8" />
                    </Tab>
                    <Tab title={<><Icon>transponder</Icon> {$L('My Player')}</>}>
                        <MyPlayer />
                    </Tab>
                    <Tab title={<><Icon>profilecheck</Icon> {$L('My Profile')}</>}>
                        <MyProfile />
                    </Tab>
                    <Tab title={<><Icon>list</Icon> {$L('User List')}</>}>
                        <Account />
                    </Tab>
            </TabLayout>
            </Scroller>
        </Panel>
        </Scroller>
		</div>
    );
};

export default Main;
