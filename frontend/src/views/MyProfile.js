import React, { useState, useEffect } from 'react';
import Picker from '@enact/sandstone/Picker';
import Button from '@enact/sandstone/Button';
import { Spinner } from '@enact/sandstone/Spinner';
import { useNavigate } from 'react-router-dom';
import { ResponsivePie } from '@nivo/pie';
import axios from 'axios';
import { useConfigs } from '../hooks/configs';

const MyProfile = () => {
    const [screenTimeOption, setScreenTimeOption] = useState(0);
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();
    const data = useConfigs();

    useEffect(() => {
        const userId = window.sessionStorage.getItem('userId');
        if (userId) {
            axios.get(`/api/users/${userId}`)
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

    const ScreenTimeResponsivePie = ({ data }) => (
        <ResponsivePie
            data={data}
            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={0.4}
        padAngle={1.5}
        cornerRadius={5}
        activeOuterRadiusOffset={8}
        colors={{ scheme: 'reds' }}
        borderWidth={1}
        borderColor={{
            from: 'color',
            modifiers: [
                [
                    'darker',
                    0.2
                ]
            ]
        }}
        enableArcLinkLabels={false}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor="#0d0d0d"
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: 'color' }}
        enableArcLabels={false}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{
            from: 'color',
            modifiers: [
                [
                    'darker',
                    2                
                ]
            ]
        }}
        defs={[
            {
                id: 'dots',
                type: 'patternDots',
                background: 'inherit',
                color: 'rgba(255, 255, 255, 0.3)',
                size: 4,
                padding: 1,
                stagger: true
            },
            {
                id: 'lines',
                type: 'patternLines',
                background: 'inherit',
                color: 'rgba(255, 255, 255, 0.3)',
                rotation: -45,
                lineWidth: 6,
                spacing: 10
            }
        ]}
        fill={[
            {
                match: {
                    id: '0시'
                }
            },
            {
                match: {
                    id: '1시'
                }
            },
            {
                match: {
                    id: '2시'
                }
            },
            {
                match: {
                    id: '3시'
                }
            },
            {
                match: {
                    id: '4시'
                }
            },
            {
                match: {
                    id: '5시'
                }
            },
            {
                match: {
                    id: '6시'
                }
            },
            {
                match: {
                    id: '7시'
                }
            },
            {
                match: {
                    id: '8시'
                }
            },
            {
                match: {
                    id: '9시'
                }
            },
            {
                match: {
                    id: '10시'
                }
            },
            {
                match: {
                    id: '11시'
                }
            },
            {
                match: {
                    id: '12시'
                }
            },
            {
                match: {
                    id: '13시'
                }
            },
            {
                match: {
                    id: '14시'
                }
            },
            {
                match: {
                    id: '15시'
                }
            },
            {
                match: {
                    id: '16시'
                }
            },
            {
                match: {
                    id: '17시'
                }
            },
            {
                match: {
                    id: '18시'
                }
            },
            {
                match: {
                    id: '19시'
                }
            },
            {
                match: {
                    id: '20시'
                }
            },
            {
                match: {
                    id: '21시'
                }
            },
            {
                match: {
                    id: '22시'
                }
            },
            {
                match: {
                    id: '23시'
                }
            },
        ]}
        legends={[]}
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
    
            const pieData = adjustedTimes.map((time, index) => ({
                id: `${index}시`,
                value: time
            }));

            return (
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    height: '60vh' 
                }}>
                    <div style={{ 
                        height: '600px', 
                        width: '600px'  
                    }}>
                        <ScreenTimeResponsivePie data={pieData} />
                    </div>

                </div>
                
            );
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
