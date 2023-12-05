import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ImageItem } from '@enact/sandstone/ImageItem';
import { Scroller } from '@enact/sandstone/Scroller';
import { Icon } from '@enact/sandstone/Icon';
import { Spinner } from '@enact/sandstone/Spinner';
import Video from './Video'; 

const MyPlayer = ({onSelectVideo}) => {
    const [likedVideos, setLikedVideos] = useState([]);
    const [bookmarkedVideos, setBookmarkedVideos] = useState([]);
    const [recentVideos, setRecentVideos] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userId = window.sessionStorage.getItem('userId');
        if (userId) {
            axios.get(`/api/users/${userId}`)
                .then(response => {
                    const userData = response.data;
                    if (userData.recentVideos.length > 0) {
                        fetchRecentVideos(userData.recentVideos);
                    }
                })
                .catch(error => console.error('Error fetching user data:', error));
        }
    }, []);

    const fetchRecentVideos = async (videoIds) => {
        try {
            const response = await axios.post('/api/videos/fetch-videos', { videoIds });
            const fetchedVideos = response.data;
            const orderedVideos = videoIds.map(id => 
                fetchedVideos.find(video => video._id === id)
            );

            setRecentVideos(orderedVideos);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching recent videos:', error);
            setLoading(false);
        }
    };

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
                width: '90vw',
                display: 'flex',
                justifyContent: 'center',
                margin: '0 auto'
            }}
        >
            <Scroller direction="vertical">
                <h2><Icon>play</Icon> Recent Videos</h2>
                {recentVideos.map((video, index) => (
                    <ImageItem
                        inline
                        key={index}
                        label={video.subtitle}
                        src={video.thumb}
                        onClick={() => handleClickEvent(video)}
                        style={{ height: 300, width: 360 }}
                    >
                        {video.title}
                    </ImageItem>
                ))}
                {/* Liked와 Bookmarked 비디오 추가*/}
            </Scroller>
            {selectedVideo && (
                <Video src={selectedVideo.source} />
            )}
        </div>
    );
};

export default MyPlayer;