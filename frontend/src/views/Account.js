/* eslint-disable */
import Button from '@enact/sandstone/Button';
import {InputField} from '@enact/sandstone/Input';
import axios from 'axios';
import {useEffect, useState} from 'react';
import $L from '@enact/i18n/$L';

const Account = () => {
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
	const handleSubmit = () => {
		axios
			.post('/api/users', {name: state.name, email: state.email})
			.then(response => {
				setState(prevState => ({
					users: [...prevState.users, response.data],
					name: '',
					email: ''
				}));
			})
			.catch(error => console.error(error));
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
		<>
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
			<h2>Add User</h2>
			<InputField
				type="text"
				value={state.name}
				onChange={e => setState(prev => ({...prev, name: e.value}))}
				placeholder="Name"
			/>
			<InputField
				type="email"
				value={state.email}
				onChange={e => setState(prev => ({...prev, email: e.value}))}
				placeholder="Email"
			/>
			<Button onClick={handleSubmit} type="submit">
				{$L('Add User')}
			</Button>
		</>
	);
};

export default Account;
