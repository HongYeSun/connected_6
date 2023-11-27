/* eslint-disable */
import Button from '@enact/sandstone/Button';
import axios from 'axios';
import {useEffect, useState} from 'react';
import $L from '@enact/i18n/$L';
import css from "./Auth.module.less";
import { Scroller } from '@enact/sandstone/Scroller';

const Account = () => {
	const [userDetails, setUserDetails] = useState({
        name: '',
        email: '',
        gender: '',
        age: '',
		profileImage: ''
    });
	const [signupComplete, setSignupComplete] = useState(false);

	
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
