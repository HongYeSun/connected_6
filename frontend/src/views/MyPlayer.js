import Button from '@enact/sandstone/Button';
import { InputField } from '@enact/sandstone/Input';
import axios from 'axios';
import { useEffect, useState } from 'react';
import $L from '@enact/i18n/$L';

const MyPlayer = () => {
    const [loginDetails, setLoginDetails] = useState({
        name: '',
        email: ''
    });
    const [loginStatus, setLoginStatus] = useState({
        isLoggedIn: false,
        welcomeMessage: '',
        loginFailMessage: ''
    });

    useEffect(() => {
        // Check for saved login status in localStorage
        const savedLoginStatus = window.sessionStorage.getItem('loginStatus');
        if (savedLoginStatus) {
            setLoginStatus(JSON.parse(savedLoginStatus));
        }
    }, []);

    const handleInputChange = (e, key) => {
        setLoginDetails({ ...loginDetails, [key]: e.value });
    };

    const handleLogin = async () => {
        try {
            const response = await axios.get('/api/users');
            const users = response.data;
            const user = users.find(user => user.name === loginDetails.name && user.email === loginDetails.email);

            if (user) {
                const newLoginStatus =({
                    isLoggedIn: true,
                    welcomeMessage: $L(`Welcome ${user.name}!`),
                    loginFailMessage: ''
                });
                setLoginStatus(newLoginStatus);
                // Save login state to localStorage
                window.sessionStorage.setItem('loginStatus', JSON.stringify(newLoginStatus));
            } else {
                setLoginStatus(prevState => ({
                    ...prevState,
                    loginFailMessage: $L('Invalid name or email. Please try again.') // Update the login failure message
                }));
            }
        } catch (error) {
            console.error('Login Error:', error);
        }
    };

    return (
        <div>
            {!loginStatus.isLoggedIn ? (
                <>
                    <h2>{$L('Login')}</h2>
                    {loginStatus.loginFailMessage && <p>{loginStatus.loginFailMessage}</p>} {/* Display login failure message */}
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
                    <Button onClick={handleLogin}>{$L('Login')}</Button>
                </>
            ) : (
                <h2>{loginStatus.welcomeMessage}</h2>
                
            )}
        </div>
    );
};

export default MyPlayer;