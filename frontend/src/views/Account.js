/* eslint-disable */
import Button from '@enact/sandstone/Button';
import {InputField} from '@enact/sandstone/Input';
import {RadioItem} from '@enact/sandstone/RadioItem';
import axios from 'axios';
import {useEffect, useState} from 'react';
import $L from '@enact/i18n/$L';
import css from "./Account.module.less";
import { Scroller } from '@enact/sandstone/Scroller';
import { ImageItem } from '@enact/sandstone/ImageItem';
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
const Account = () => {
	const [userDetails, setUserDetails] = useState({
        name: '',
        email: '',
        gender: '',
        age: '',
		profileImage: ''
    });
	const [signupComplete, setSignupComplete] = useState(false);

	const profileImages = [
		profileImage1, profileImage2, profileImage3, profileImage4, profileImage5, 
		profileImage6, profileImage7, profileImage8, profileImage9, profileImage10,
		profileImage11, profileImage12, profileImage13, profileImage14, profileImage15
	];

	const [state, setState] = useState({
		users: [],
		name: '',
		email: ''
	});

	const fetchUser = async () => {
		try {
			const response = await axios.get('/api/users');
			setState({users: response.data});
			console.log('>>>>>> RESPONSE: ', response.data);
		} catch (error) {
			console.log(error);
		}
	};
	const handleChange = (e, key) => {
        setUserDetails({ ...userDetails, [key]: e.value });
    };
	const handleGenderChange = (event) => {
        setUserDetails({ ...userDetails, gender: event.data });
    };

	// const handleImageSelect = (imagePath) => {
    //     setUserDetails({ ...userDetails, profileImage: imagePath });
    // };
	
	const handleSubmit = async () => {
        try {
            const response = await axios.post('/api/users', userDetails);
            setSignupComplete(true); // Set signupComplete to true after successful signup
        } catch (error) {
            console.error('Signup Error:', error);
        }
    };
	
	const handleImageSelect = async (imagePath) => {
		try {
			// Save the selected profile image to the session storage
			window.sessionStorage.setItem('profileImage', imagePath);
	
			// Optionally, navigate to another page or show a confirmation message
		} catch (error) {
			console.error('Error updating profile image:', error);
		}
	};
	

	const handleDelete = async id => {
		try {
			await axios.delete(`/api/users/${id}`);
			setState(prevState => ({
				users: prevState.users.filter(user => user._id !== id)
			}));
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		fetchUser();
	}, []);

	return (
		<Scroller direction="vertical">
			{!signupComplete ? (
                <>
			<h2>Sign up now!</h2>
			<InputField
				type="text"
				placeholder={$L("Name")} 
                value={userDetails.name} 
                onChange={(e) => handleChange(e, 'name')}
			/><br></br><br></br>
			<InputField
				type="email"
				placeholder={$L("Email")} 
                value={userDetails.email} 
                onChange={(e) => handleChange(e, 'email')}
			/><br></br><br></br>
			<InputField
				type="text"
				placeholder={$L("Age")} 
                value={userDetails.age} 
                onChange={(e) => handleChange(e, 'age')}
			/><br></br><br></br>
			<h3>{$L('Gender')}</h3>
            <RadioItem
                selected={userDetails.gender === 'female'}
                onToggle={() => handleGenderChange({data: 'female'})}
            >
                {$L('Female')}
            </RadioItem>
            <RadioItem
                selected={userDetails.gender === 'male'}
                onToggle={() => handleGenderChange({data: 'male'})}
            >
                {$L('Male')}
            </RadioItem>
            <RadioItem
                selected={userDetails.gender === 'preferNotToSay'}
                onToggle={() => handleGenderChange({data: 'preferNotToSay'})}
            >
                {$L('Prefer Not to Say')}
            </RadioItem>
			<br></br>
			<Button onClick={handleSubmit} type="submit">
				{$L('Sign Up')}
			</Button>
			</>
			):(
			<>
				<h3>{$L('Choose Profile Image')}</h3>
					<Scroller direction="horizontal" style={{ width: '100%', height: '400px' }}>
                        <div className={css.row}>
                            {profileImages.map((image, index) => (
                                <ImageItem
                                    key={index}
                                    src={image}
                                    onClick={() => handleImageSelect(image)}
                                    style={{
                                        width: '200px',
                                        height: '300px',
                                        marginRight: '10px' // Add space between images
                                    }}
                                >
                                    {`BeanBird ${index + 1}`}
                                </ImageItem>
                            ))}
                        </div>
                    </Scroller>
                </>
            )}
            <br></br><br></br><br></br><br></br>
			<h2>User List</h2>
			{Array.isArray(state.users) ? (
				<ul>
					{state.users.map(user => (
						<li key={user._id}>
							{user.name} ({user.email})
							<Button onClick={() => handleDelete(user._id)}>
								{$L('Delete')}
							</Button>
						</li>
					))}
				</ul>
			) : (
				<p>{$L('Cannot retreive data!')}</p>
			)}
		</Scroller>
	);
};

export default Account;
