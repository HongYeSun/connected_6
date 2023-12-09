import React, { useState, useEffect } from 'react';
import Picker from '@enact/sandstone/Picker';
import Button from '@enact/sandstone/Button';
import { Spinner } from '@enact/sandstone/Spinner';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';
import { useConfigs } from '../hooks/configs';
const serverUri = process.env.REACT_APP_SERVER_URI;

const MyProfile = () => {
    const [screenTimeOption, setScreenTimeOption] = useState(0);
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();
    const data = useConfigs();

    useEffect(() => {
        const userId = window.sessionStorage.getItem('userId');
        if (userId) {
            axios.get(`${serverUri}/api/users/${userId}`)
                .then(response => {
                    setUserData(response.data);
                })
                .catch(error => {
                    console.error('Error fetching user data:', error);
                });
        }
    }, []);

    const handlePickerChange = ({value}) => {
        setScreenTimeOption(value);
    };

    const screenTimeOptions = ["Accumulated", "Last 7 Days"];

    const screenTimeData = () => {
        if (!userData) {
            return (
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    height: '60vh' 
                }}>
                    <Spinner size="large" /> 
                </div>
            );
        }
        if (screenTimeOption === 0) {
            const adjustedTimes = [...userData.accessTimes.slice(9), ...userData.accessTimes.slice(0, 9)];
    
            const pieData = adjustedTimes.map((time, index) => ({
                id: `${index}시`,
                value: time
            }));

            return (
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    height: '40vh' 
                }}>
                    <div style={{ 
                        height: '500px', 
                        width: '500px'  
                    }}>
                    
                    </div>

                </div>
                
            );
        } else {
            return <p>Last 7 Days' Screen Time Data</p>;
        }
    };

    const handleLogout = async () => {
        try {
            await axios.get(`${serverUri}/api/users/logout`); 
            window.sessionStorage.clear(); 
            navigate('/login');
        } catch (error) {
            console.error('Logout Error:', error);
        }
    };

    const renderTVInfo = () => (
        <div>
            <h2>TV Information</h2>
            {data && (
                <ul>
                    <li><strong>Model Name:</strong> {data.modelName}</li>
                    <li><strong>Firmware Version:</strong> {data.firmwareVersion}</li>
                    <li><strong>UHD:</strong> {data.UHD}</li>
                    <li><strong>SDK Version:</strong> {data.sdkVersion}</li>
                </ul>
            )}
        </div>
    );

    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '120vh' 
        }}>
            <h2 style={{ textAlign: 'center' }}>Screen Time</h2>
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                width: '100%' 
            }}>
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
            </div>
            <br />
            <div>
                {screenTimeData()}
            </div>
            {renderTVInfo()}
            <br /><br />
            <Button onClick={handleLogout}>Logout</Button>
        </div>
    );    
};

export default MyProfile;
