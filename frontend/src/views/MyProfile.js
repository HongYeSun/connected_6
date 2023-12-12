import React, { useState, useEffect } from 'react';
import Picker from '@enact/sandstone/Picker';
import Button from '@enact/sandstone/Button';
import { Spinner } from '@enact/sandstone/Spinner';
import { useNavigate } from 'react-router-dom';

import { Bar } from 'react-chartjs-2';
//import { ResponsiveBar } from '@nivo/bar';
import axios from 'axios';
import { useConfigs } from '../hooks/configs';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
  
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title, 
    Tooltip,
    Legend
  );
  
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

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        aspectRatio: 2,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    font: {
                        weight: 'bold',
                        size: '25px',

                    },
                    stepSize: 1 
                }
            },
            x: {
                beginAtZero: true,
                ticks: {
                    font: {
                        weight: 'bold',
                        size: '18px'
                    }
                }
            }
        },
    };

    const prepareBarData = (accessTimes) => {
        const labels = accessTimes.map((_, index) => `${index}시`);
        
        const data = {
            labels: labels,
            datasets: [{
                label: 'screen time',
                data: accessTimes,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        };
        return data;
    };

    const screenTimeData = () => {
        if (!userData) {
            return <Spinner size="large" />;
        }
        const times = screenTimeOption === 0 ? userData.accessTimes : userData.weekAccessTimes;
        const adjustedTimes = [...times.slice(9), ...times.slice(0, 9)];
        const barData = prepareBarData(adjustedTimes);


        return (
            <div style={{ height: '500px', width: '1200px' }}>
                <Bar data={barData} options={options} />
            </div>
        );

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

    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '80vh' 
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
            <br /><br />
            <Button onClick={handleLogout}>Logout</Button>
        </div>
    );    
};

export default MyProfile;
