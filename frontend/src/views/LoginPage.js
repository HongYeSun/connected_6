import React, { useState, useEffect } from 'react';
import Button from '@enact/sandstone/Button';
import { InputField } from '@enact/sandstone/Input';
import { Scroller } from '@enact/sandstone/Scroller';
import axios from 'axios';
import $L from '@enact/i18n/$L';
import { useNavigate } from 'react-router-dom';
import css from "./Auth.module.less";

const LoginPage = () => {
    const [loginDetails, setLoginDetails] = useState({
        name: '',
        email: ''
    });
    const [loginStatus, setLoginStatus] = useState({
        isLoggedIn: false,
        loginFailMessage: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        const savedLoginStatus = window.sessionStorage.getItem('loginStatus');
        if (savedLoginStatus) {
            setLoginStatus(JSON.parse(savedLoginStatus));
        }
    }, []);

    const handleInputChange = (e, key) => {
        setLoginDetails({ ...loginDetails, [key]: e.value });
        setLoginStatus({...loginStatus, loginFailMessage: ''});
    };

    const handleLogin = async () => {
        try {
            const response = await axios.get('/api/users');
            const users = response.data;
            const user = users.find(u => u.name === loginDetails.name && u.email === loginDetails.email);

            if (user) {
                const newLoginStatus = {
                    isLoggedIn: true,
                    loginFailMessage: ''
                };
                setLoginStatus(newLoginStatus);
                window.sessionStorage.setItem('username', user.name);
                navigate('/main');
            } else {
                setLoginStatus({
                    ...loginStatus,
                    loginFailMessage: $L('Invalid name or email. Please try again.')
                });
            }
        } catch (error) {
            console.error('Login Error:', error);
        }
    };

    return (
        <div className={css.Container}>
            <Scroller direction="vertical">
                <div className={css.loginformContainer}>
                    {!loginStatus.isLoggedIn ? (
                        <>
                            <h2>{$L('Login')}</h2>
                            {loginStatus.loginFailMessage && (
                                <div className={css.loginerrorContainer}>
                                    <p className={css.errorMessage}>{loginStatus.loginFailMessage}</p>
                                </div>
                            )}
                            <br></br>
                            <InputField
                                type="text"
                                placeholder={$L("Name")}
                                value={loginDetails.name}
                                onChange={(e) => handleInputChange(e, 'name')}
                            /><br /><br />
                            <InputField
                                type="email"
                                placeholder={$L("Email")}
                                value={loginDetails.email}
                                onChange={(e) => handleInputChange(e, 'email')}
                            /><br /><br />
                            <Button className={css.submitButton} onClick={handleLogin}>{$L('Login')}</Button>
                        </>
                    ) : (
                        navigate('/main') 
                    )}
                </div>
            </Scroller>
        </div>
    );
};

export default LoginPage;