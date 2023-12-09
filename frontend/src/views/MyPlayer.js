import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ImageItem } from '@enact/sandstone/ImageItem';
import { Scroller } from '@enact/sandstone/Scroller';
import { Icon } from '@enact/sandstone/Icon';
import { Spinner } from '@enact/sandstone/Spinner';
import Video from './Video';
const serverUri = process.env.REACT_APP_SERVER_URI;

const MyPlayer = ({onSelectVideo}) => {
    const [likedVideos, setLikedVideos] = useState([]);
    const [bookmarkedVideos, setBookmarkedVideos] = useState([]);
    const [recentVideos, setRecentVideos] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userId = window.sessionStorage.getItem('userId');
        if (userId) {
            axios.get(`${serverUri}/api/users/${userId}`)
                .then(response => {
                    const userData = response.data;
                    fetchLikedAndBookmarkedVideos();
                    fetchRecentVideos();
                    setLoading(false);
                })
                .catch(error => console.error('Error fetching user data:', error));
        }
    }, []);

    const fetchRecentVideos =  () => {

        // 최근비디오
        axios.get(`${serverUri}/api/users/recent-videos`)
            .then(response => {
                setRecentVideos(response.data);
                console.log(response.data);
            })
            .catch(error => console.error('Error fetching recent videos:', error));
    };

    const fetchLikedAndBookmarkedVideos = () => {

        // 좋아요
        axios.get(`${serverUri}/api/users/like`)
            .then(response => {
                setLikedVideos(response.data);
            })
            .catch(error => console.error('Error fetching liked videos:', error));

        // 북마크
        axios.get(`${serverUri}/api/users/bookmark`)
            .then(response => {
                setBookmarkedVideos(response.data);
            })
            .catch(error => console.error('Error fetching bookmarked videos:', error));
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
        <div>
            <Scroller direction="vertical">
                <h2><Icon>play</Icon> Recent Videos</h2>
                {recentVideos.map((video, index) => (
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
                {/* Liked와 Bookmarked 비디오 추가*/}
                <h2><Icon>heart</Icon> Liked Videos</h2>
                {likedVideos.map((video, index) => (
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
                <h2><Icon>bookmark</Icon> Bookmarked Videos</h2>
                {bookmarkedVideos.map((video, index) => (
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
            {selectedVideo && (
                <Video src={selectedVideo.source} />
            )}
        </div>
    );
};

export default MyPlayer;