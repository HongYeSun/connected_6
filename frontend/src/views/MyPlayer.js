import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ImageItem } from '@enact/sandstone/ImageItem';
import { Scroller } from '@enact/sandstone/Scroller';
import { Icon } from '@enact/sandstone/Icon';
import Video from './Video'; 

const MyPlayer = () => {
    const [likedVideos, setLikedVideos] = useState([]);
    const [bookmarkedVideos, setBookmarkedVideos] = useState([]);
    const [recentVideos, setRecentVideos] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null);

    useEffect(() => {
        const userId = window.sessionStorage.getItem('userId');
        if (userId) {
            axios.get(`/api/users/${userId}`)
                .then(response => {
                    const userData = response.data;
                    setLikedVideos(userData.likedVideos);
                    setBookmarkedVideos(userData.bookmarkedVideos);
                    setRecentVideos(userData.recentVideos);
                })
                .catch(error => console.error('Error fetching user data:', error));
        }
    }, []);

    const handleVideoSelect = (video) => {
        setSelectedVideo(video);
    };

    return (
        <div>
            <Scroller direction="vertical">
                <h2><Icon>play</Icon> Recent Videos</h2>
                {recentVideos.map(video => (
                    <ImageItem
                        key={video._id}
                        src={video.thumb}
                        onClick={() => handleVideoSelect(video)}
                    >
                        {video.title}
                    </ImageItem>
                ))}
                <h2><Icon>heart</Icon> Liked Videos</h2>
                {likedVideos.map(video => (
                    <ImageItem
                        key={video._id}
                        src={video.thumb}
                        onClick={() => handleVideoSelect(video)}
                    >
                        {video.title}
                    </ImageItem>
                ))}
                <h2><Icon>check</Icon> Bookmarked Videos</h2>
                {bookmarkedVideos.map(video => (
                    <ImageItem
                        key={video._id}
                        src={video.thumb}
                        onClick={() => handleVideoSelect(video)}
                    >
                        {video.title}
                    </ImageItem>
                ))}
                
            </Scroller>
            {selectedVideo && (
                <Video src={selectedVideo.source} />
            )}
        </div>
    );
};

export default MyPlayer;