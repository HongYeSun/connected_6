import Button from '@enact/sandstone/Button';
import { InputField } from '@enact/sandstone/Input';
import { RadioItem } from '@enact/sandstone/RadioItem';
import axios from 'axios';
import React, { useState } from 'react';
import $L from '@enact/i18n/$L';
import css from "./Auth.module.less";
import { Scroller } from '@enact/sandstone/Scroller';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
    const [userDetails, setUserDetails] = useState({
        username: '',
        email: '',
        password: '',
        gender: '',
        age: '',
        profilePicture: 1, // Default: 1 // edit in profile select page
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
        return userDetails.username && userDetails.email && userDetails.password && userDetails.gender && userDetails.age;
    };

    const handleSubmit = async () => {
        if (!validateInputs()) {
            setErrorMessage($L('Invalid input! Please try again.'));
            return;
        }

        try {
            const response = await axios.post('/api/users', userDetails);
            window.sessionStorage.setItem('userId', response.data._id);
            navigate('/profile-select');
        } catch (error) {
            console.error('Signup Error:', error);
            setErrorMessage($L('Signup failed. Please try again.'));
        }
    };

    return (
        <div className={css.Container}>
            <Scroller direction="vertical">
                <div className={css.RegisterformContainer}>
                <h2>{$L('Register')}</h2>
                <p>Enter your username, email, password and additional information to sign in.</p>
                    {errorMessage && (
                        <div className={css.errorContainer}>
                            <p className={css.errorMessage}>{errorMessage}</p>
                        </div>
                    )}
                    <br></br>
                    <div className={css.inputField}>
                    <label htmlFor="username">Username</label>
                    <InputField
                        type="text"
                        placeholder={$L("Username")}
                        value={userDetails.username}
                        onChange={(e) => handleChange(e, 'username')}
                    /><br /><br />
                    </div>
                    <div className={css.inputField}>
                    <label htmlFor="email">Email</label>
                    <InputField
                        type="email"
                        placeholder={$L("Email")}
                        value={userDetails.email}
                        onChange={(e) => handleChange(e, 'email')}
                    /><br /><br />
                    </div>
                    <div className={css.inputField}>
                    <label htmlFor="password">Password</label>
                    <InputField
                        type="password"
                        placeholder={$L("Password")}
                        value={userDetails.password}
                        onChange={(e) => handleChange(e, 'password')}
                    /><br /><br />
                    </div>
                    <div className={css.inputField}>
                    <label htmlFor="age">Age</label>
                    <InputField
                        type="number"
                        placeholder={$L("Age")}
                        value={userDetails.age}
                        onChange={(e) => handleChange(e, 'age')}
                    /><br /><br />
                    </div>
                    <label htmlFor="gender">Gender</label>
                    <RadioItem
                        selected={userDetails.gender === 'female'}
                        onToggle={() => handleGenderChange({ data: 'female' })}
                    >
                        {$L('Female')}
                    </RadioItem>
                    <RadioItem
                        selected={userDetails.gender === 'male'}
                        onToggle={() => handleGenderChange({ data: 'male' })}
                    >
                        {$L('Male')}
                    </RadioItem>
                    <RadioItem
                        selected={userDetails.gender === 'other'}
                        onToggle={() => handleGenderChange({ data: 'other' })}
                    >
                        {$L('Other')}
                    </RadioItem>
                    <br />
                    <Button className={css.submitButton} onClick={handleSubmit}>
                        {$L('Sign Up')}
                    </Button>
                    <Button className={css.loginButton} onClick={() => navigate('/login')}>
                        {$L('Login')}
                    </Button>
                </div>
            </Scroller>
        </div>
    );
};

export default RegisterPage;
