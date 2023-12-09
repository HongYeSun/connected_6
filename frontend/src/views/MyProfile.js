import React, { useState, useEffect } from 'react';
import Picker from '@enact/sandstone/Picker';
import Button from '@enact/sandstone/Button';
import { Spinner } from '@enact/sandstone/Spinner';
import { useNavigate } from 'react-router-dom';
import { ResponsiveBar } from '@nivo/bar';

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


    const ScreenTimeResponsiveBar = ({ data }) => (
        <ResponsiveBar
            data={data}
            keys={['screen time']}
            indexBy="hour"
            margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
            padding={0.3}
            valueScale={{ type: 'linear' }}
            indexScale={{ type: 'band', round: true }}
            colors={{ scheme: 'nivo' }}
            colorBy="indexValue"
            defs={[
                {
                    id: 'dots',
                    type: 'patternDots',
                    background: 'inherit',
                    color: '#38bcb2',
                    size: 4,
                    padding: 1,
                    stagger: true
                },
                {
                    id: 'lines',
                    type: 'patternLines',
                    background: 'inherit',
                    color: '#eed312',
                    rotation: -45,
                    lineWidth: 6,
                    spacing: 10
                }
            ]}
            borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
            axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legendPosition: 'middle',
                legendOffset: 32
            }}
            axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legendPosition: 'middle',
                legendOffset: -40,
                tickValues: "every 1"
            }}
            labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
            theme={{
                axis: {
                    legend: {
                        text: {
                            fontSize: 16, 
                            fontWeight: 'bold',
                            fill: '#555' 
                        }
                    },
                    ticks: {
                        text: {
                            fontSize: 15, 
                            fontWeight: 'bold',
                            fill: '#555' 
                        }
                    }
                },
                labels: {
                    text: {
                        fontSize: 15, 
                        fontWeight: 'bold',
                        fill: '#555' 
                    }
                }
            }}
        />
    );

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

                const barData = adjustedTimes.map((time, index) => ({
                    hour: `${index}시`,
                    'screen time': time
        }));

            return (
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    height: '40vh' 
                }}>
                    <div style={{ 
                        height: '400px', 
                        width: '1500px'  
                    }}>

                        <ScreenTimeResponsiveBar data={barData} />

                    </div>

                </div>
                
            );
        } else if (screenTimeOption === 1) {
            const weekadjustedTimes = [...userData.weekAccessTimes.slice(9), ...userData.weekAccessTimes.slice(0, 9)];

            const barData = weekadjustedTimes.map((time, index) => ({
                hour: `${index}시`,
                'screen time': time
            }));

            return (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '40vh' }}>
                    <div style={{ height: '400px', width: '1500px' }}>
                        <ScreenTimeResponsiveBar data={barData} />
                    </div>
                </div>
            );
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
