import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ImageItem } from '@enact/sandstone/ImageItem';
import { Scroller } from '@enact/sandstone/Scroller';

import { Spinner } from '@enact/sandstone/Spinner';
import Icon from '@enact/sandstone/Icon';

import css from './Main.module.less';
const serverUri = process.env.REACT_APP_SERVER_URI;


const Feed = ({ onSelectVideo }) => {
	const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTopVideos = async () => {
            try {

                const response = await axios.get(`${serverUri}/api/videos/top-videos`);

                setVideos(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching videos:', error);
                setLoading(false);
            }
        };

        fetchTopVideos();
        const intervalId = setInterval(fetchTopVideos, 60000); // 3600000밀리세컨 = 1시간
        return () => clearInterval(intervalId);

    }, []);

    const handleClickEvent = (video) => {
        onSelectVideo(video._id, video.source);
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spinner size="large" />
            </div>
        );
    }

    return (
        <div
            style={{
                height: '70vh',
                transform: 'scale(1)',
                transformOrigin: 'top',
                width: '100vw',

                display: 'flex',
                justifyContent: 'center',
                margin: '0 auto'
            }}
        >
        <Scroller direction="vertical">
                <h2><Icon>stargroup</Icon>Top 10 Videos</h2>
                <div className={css.videoLine}>
                    {videos.map((video, index) => (
                        <div key={index} className={css.videoContainer}>
                            <div className={css.ranking}>{index + 1}</div>
                            <ImageItem
                                inline
                                label={video.subtitle}
                                src={video.thumb}
                                onClick={() => handleClickEvent(video)}
                                style={{ height: 228, width: 275.1996 }}
                            >
                                {video.title}
                            </ImageItem>
                        </div>
                    ))}
                </div>

            </Scroller>
        </div>
    );
};

export default Feed;
