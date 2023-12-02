import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ImageItem } from '@enact/sandstone/ImageItem';
import { Scroller } from '@enact/sandstone/Scroller';
import { Spinner } from '@enact/sandstone/Spinner';
import css from './Main.module.less';


const Home = ({ onSelectVideo }) => {
	const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await axios.get('/api/videos');
                setVideos(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching videos:', error);
                setLoading(false);
            }
        };

        fetchVideos();
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
        <Scroller direction="vertical">
            {videos.map((video, index) => (
                <ImageItem
                    inline
                    key={index}
                    label={video.subtitle}
                    src={video.thumb}
                    onClick={() => handleClickEvent(video)}
                    style={{ height: 190, width: 229.33333333333331 }}
                >
                    {video.title}
                </ImageItem>
            ))}
        </Scroller>
    );
};

export default Home;
