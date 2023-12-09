import Button from '@enact/sandstone/Button';
import { InputField } from '@enact/sandstone/Input';
import { RadioItem } from '@enact/sandstone/RadioItem';
import axios from 'axios';
import React, { useState } from 'react';
import $L from '@enact/i18n/$L';
import css from "./Auth.module.less";
import { Scroller } from '@enact/sandstone/Scroller';
import { useNavigate } from 'react-router-dom';
const serverUri = process.env.REACT_APP_SERVER_URI;

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
            const response = await axios.post(`${serverUri}/api/users`, userDetails);
            window.sessionStorage.setItem('userId', response.data._id);
            navigate('/profile-select');
        } catch (error) {
            console.error('Signup Error:', error);
            setErrorMessage($L('Signup failed. Please try again.'));
        }
    };

    return (
        <Scroller direction="vertical">
        <div className={css.Container}>
            
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
                        placeholder={$L("Username")}
                        value={userDetails.username}
                        onChange={(e) => handleChange(e, 'username')}
                    /><br /><br />
                    <InputField
                        type="email"
                        placeholder={$L("Email")}
                        value={userDetails.email}
                        onChange={(e) => handleChange(e, 'email')}
                    /><br /><br />
                    <InputField
                        type="password"
                        placeholder={$L("Password")}
                        value={userDetails.password}
                        onChange={(e) => handleChange(e, 'password')}
                    /><br /><br />
                    <InputField
                        type="number"
                        placeholder={$L("Age")}
                        value={userDetails.age}
                        onChange={(e) => handleChange(e, 'age')}
                    /><br /><br />
                    <h3>{$L('Gender')}</h3>
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
            
        </div>
        </Scroller>
    );
};

export default RegisterPage;
