import React, { useState } from 'react';
import Picker from '@enact/sandstone/Picker';
import Button from '@enact/sandstone/Button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MyProfile = () => {
    const [screenTimeOption, setScreenTimeOption] = useState(0);
    const navigate = useNavigate();

    const handlePickerChange = ({value}) => {
        setScreenTimeOption(value);
    };

    const screenTimeOptions = ["Today", "Last 7 Days"];

    const screenTimeData = () => {
        if (screenTimeOption === 0) {
            return <p>Today's Screen Time Data</p>;
        } else {
            return <p>Last 7 Days' Screen Time Data</p>;
        }
    };

    const handleLogout = async () => {
        try {
            await axios.get('/api/users/logout'); 
            window.sessionStorage.clear(); 
            navigate('/login');
        } catch (error) {
            console.error('Logout Error:', error);
        }
    };

    return (
        <div>
            <h2>Screen Time</h2>
            <Picker
                onChange={handlePickerChange}
                value={screenTimeOption}
                orientation="horizontal"
                width="large"
            >
                {screenTimeOptions.map(option => (
                    <option key={option}>{option}</option>
                ))}
            </Picker>
            <br />
            <div>
                {screenTimeData()}
            </div>
            <br /><br></br>
            <Button onClick={handleLogout}>Logout</Button>
        </div>
    );
};

export default MyProfile;
