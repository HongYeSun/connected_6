/* eslint-disable */
import { useState } from 'react';
// import $L from '@enact/i18n/$L';
// import Video from './Video';
// import Skinnable from '@enact/ui/Skinnable';
import React from 'react';
import { ImageItem } from '@enact/sandstone/ImageItem';
import { Scroller } from '@enact/sandstone/Scroller';
import video_list from '../assets/video_list';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const Feed = ({ list, id, setVideoID, title, subtitle, thumbURL, setVideosrc, videosrc }) => {

    // const [videoID, setVideoID] = useState(0);
    const navigate = useNavigate();
    const location = useLocation();
    const currentTime = { ...location.state };// Media에서 현재재생시간받아와서 다시 그대로 media에 보내주기? 실패

    const handleClickEvent = (e, index) => {
        navigate('/media', {
            state: {
                index: `${index}`,
                title: `${video_list[index].title}`,
                thumb: `${video_list[index].thumb}`,
                videosrc: `${video_list[index].source}`,
                desc: `${video_list[index].description}`,
                currentTime: { currentTime }
            },
        });
    };


    return (
        <Scroller direction="vertical">
            {
                video_list.map((item, index) => (
                    <ImageItem
                        inline
                        key={index}
                        label={item.subtitle}
                        src={item.thumb}
                        onClick={(e) => handleClickEvent(e, index)}
                        style={{
                            height: 190,
                            width: 229.33333333333331
                        }}
                    >
                        {item.title}
                    </ImageItem>
                ))}
        </Scroller>
    );
};
export default Feed;