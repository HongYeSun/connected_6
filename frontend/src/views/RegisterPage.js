import Button from '@enact/sandstone/Button';
import {InputField} from '@enact/sandstone/Input';
import {RadioItem} from '@enact/sandstone/RadioItem';
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import $L from '@enact/i18n/$L';
import css from "./Auth.module.less";
import { Scroller } from '@enact/sandstone/Scroller';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
    const [userDetails, setUserDetails] = useState({
        name: '',
        email: '',
        gender: '',
        age: '',
    });
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate(); 

    const handleChange = (e, key) => {
        setUserDetails({ ...userDetails, [key]: e.value });
        setErrorMessage('');
    };

    const handleGenderChange = (event) => {
        setUserDetails({ ...userDetails, gender: event.data });
        setErrorMessage('');
    };

    const validateInputs = () => {
        return userDetails.name && userDetails.email && userDetails.gender && userDetails.age;
    };

    const handleSubmit = async () => {
        if (!userDetails.name || !userDetails.email || !userDetails.gender || !userDetails.age) {
            setErrorMessage($L('Invalid input! Please try again.'));
            return;
        }

        try {
            await axios.post('/api/users', userDetails);
            navigate('/profile-select');
        } catch (error) {
            console.error('Signup Error:', error);
        }
    };

    return (
        <div className={css.Container}>
        <Scroller direction="vertical">
            <div className={css.RegisterformContainer}>
                <h2>Register</h2>
                {errorMessage && (
                    <div className={css.errorContainer}>
                        <p className={css.errorMessage}>{errorMessage}</p>
                    </div>
                )}
                <br></br>
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
                selected={userDetails.gender === 'other'}
                onToggle={() => handleGenderChange({data: 'other'})}
            >
                {$L('Other')}
            </RadioItem>
            <br />
            <Button className={css.submitButton} onClick={handleSubmit} type="submit">
                {$L('Sign Up')}
            </Button>
            <Button className={css.loginButton} onClick={() => navigate('/login')}>
                {$L('Login')}
            </Button>
            <br></br>
            
            </div>
        </Scroller>
        </div>
    );
};

export default RegisterPage;
