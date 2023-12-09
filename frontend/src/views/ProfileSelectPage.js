import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Scroller } from '@enact/sandstone/Scroller';
import { ImageItem } from '@enact/sandstone/ImageItem';
import axios from 'axios';
import css from "./Auth.module.less";
const serverUri = process.env.REACT_APP_SERVER_URI;

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


const ProfileSelectPage = () => {
    const navigate = useNavigate();
    const userId = window.sessionStorage.getItem('userId');

    const profileImages = [
        profileImage1, profileImage2, profileImage3, profileImage4, profileImage5, 
		profileImage6, profileImage7, profileImage8, profileImage9, profileImage10,
		profileImage11, profileImage12, profileImage13, profileImage14, profileImage15
    ];

    const handleImageSelect = async (profileNumber) => {
        try {
            const response = await axios.put(`${serverUri}/api/users/${userId}`, { profilePicture: profileNumber });
            console.log(response.data);

            await axios.post('${serverUri}/api/users/auto-login', { userId: userId })
            .then(response => {
                //window.sessionStorage.setItem('username', response.data.username); 
                //window.sessionStorage.setItem('profilePictureNumber', response.data.profilePicture); 
                navigate('/main');
            });
        } catch (error) {
            console.error('Error updating profile image:', error);
        }
    };

    return (
        <div className={css.Container}>
        <h2 className={css.title}>Edit Profile</h2>
        <Scroller direction="horizontal" style={{ width: '100%', height: '400px' }}>
            <div className={css.row}>
                {profileImages.map((image, index) => (
                    <ImageItem
                        key={index}
                        src={image}
                        onClick={() => handleImageSelect(index+1)}
                        style={{
                            width: '300px',
                            height: '300px',
                            //marginRight: '5px' 
                        }}
                    >
                        {`BeanBird ${index + 1}`}
                    </ImageItem>
                ))}
            </div>
        </Scroller>
        </div>
    );
};

export default ProfileSelectPage;
