import React, { useState } from 'react';
import Button from '@enact/sandstone/Button';
import { InputField } from '@enact/sandstone/Input';
import { Scroller } from '@enact/sandstone/Scroller';
import axios from 'axios';
import $L from '@enact/i18n/$L';
import { useNavigate } from 'react-router-dom';
import css from "./Auth.module.less";
const serverUri = process.env.REACT_APP_SERVER_URI;

const LoginPage = () => {
    const [loginDetails, setLoginDetails] = useState({
        email: '',
        password: ''
    });
    const [loginStatus, setLoginStatus] = useState({
        isLoggedIn: false,
        loginFailMessage: ''
    });
    const navigate = useNavigate();

    const handleInputChange = (e, key) => {
        setLoginDetails({ ...loginDetails, [key]: e.value });
        setLoginStatus({...loginStatus, loginFailMessage: ''});
    };

    const handleLogin = async () => {
        try {
            const response =  await axios.post(`${serverUri}/api/users/login`, loginDetails);
      
            if (response.data) {
                const newLoginStatus = {
                    isLoggedIn: true,
                    loginFailMessage: ''
                };
                setLoginStatus(newLoginStatus);
                window.sessionStorage.setItem('userId', response.data._id); 
                window.sessionStorage.setItem('username', response.data.username); 
                navigate('/main');
            } else {
                setLoginStatus({
                    ...loginStatus,
                    loginFailMessage: $L('Invalid email or password. Please try again.')
                });
            }
        } catch (error) {
            console.error('Login Error:', error);
            setLoginStatus({
                ...loginStatus,
                loginFailMessage: $L('Login error')
            });
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
                                type="email"
                                placeholder={$L("Email")}
                                value={loginDetails.email}
                                onChange={(e) => handleInputChange(e, 'email')}
                            /><br /><br />
                            <InputField
                                type="password"
                                placeholder={$L("Password")}
                                value={loginDetails.password}
                                onChange={(e) => handleInputChange(e, 'password')}
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
