/* eslint-disable */
import { useState } from 'react';
// import $L from '@enact/i18n/$L';
// import Video from './Video';
// import Skinnable from '@enact/ui/Skinnable';
import React from 'react';
import { ImageItem } from '@enact/sandstone/ImageItem';
import { Scroller } from '@enact/sandstone/Scroller';
import Popup from '@enact/sandstone/Popup';
import { MediaControls } from '@enact/sandstone/MediaPlayer';
import Button from '@enact/sandstone/Button';
import Video from './Video';


// import Popup from '@enact/sandstone/Popup';
// import {VirtualGridList} from '@enact/sandstone/VirtualList';
// import Routable from '@enact/ui/Routable';
// import profileImage1 from '../images/profile1.png';
// import { useState } from 'react';


const Feed = ({ list, id, setVideoID, title, subtitle, thumbURL, setVideosrc, videosrc }) => {
    const video_list = [
        {
            id: 0,
            description: "Big Buck Bunny tells the story of a giant rabbit with a heart bigger than himself. When one sunny day three rodents rudely harass him, something snaps... and the rabbit ain't no bunny anymore! In the typical cartoon tradition he prepares the nasty rodents a comical revenge.\n\nLicensed under the Creative Commons Attribution license\nhttp://www.bigbuckbunny.org",
            source: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            subtitle: "By Blender Foundation",
            thumb: "https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg",
            title: "Big Buck Bunny",
            bookmark: 0,
            like: 0,
            views: 0
        },

        {
            id: 1,
            description: "The first Blender Open Movie from 2006",
            source: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
            subtitle: "By Blender Foundation",
            thumb: "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg",
            title: "Elephant Dream",
            bookmark: 0,
            like: 0,
            views: 0
        },

        {
            id: 2,
            description: "HBO GO now works with Chromecast -- the easiest way to enjoy online video on your TV. For when you want to settle into your Iron Throne to watch the latest episodes. For $35.\nLearn how to use Chromecast with HBO GO and more at google.com/chromecast.",
            source: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
            subtitle: "By Google",
            thumb: "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg",
            title: "For Bigger Blazes",
            bookmark: 0,
            like: 0,
            views: 0
        },

        {
            id: 3,
            description: "Introducing Chromecast. The easiest way to enjoy online video and music on your TV—for when Batman's escapes aren't quite big enough. For $35. Learn how to use Chromecast with Google Play Movies and more at google.com/chromecast.",
            source: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
            subtitle: "By Google",
            thumb: "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerEscapes.jpg",
            title: "For Bigger Escape",
            bookmark: 0,
            like: 0,
            views: 0
        },

        {
            id: 4,
            description: "Introducing Chromecast. The easiest way to enjoy online video and music on your TV. For $35.  Find out more at google.com/chromecast.",
            source: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
            subtitle: "By Google",
            thumb: "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerFun.jpg",
            title: "For Bigger Fun",
            bookmark: 0,
            like: 0,
            views: 0
        },
        {
            id: 5,
            description: "Introducing Chromecast. The easiest way to enjoy online video and music on your TV—for the times that call for bigger joyrides. For $35. Learn how to use Chromecast with YouTube and more at google.com/chromecast.",
            source: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
            subtitle: "By Google",
            thumb: "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerJoyrides.jpg",
            title: "For Bigger Joyrides",
            bookmark: 0,
            like: 0,
            views: 0
        },

        {
            id: 6,
            description: "Introducing Chromecast. The easiest way to enjoy online video and music on your TV—for when you want to make Buster's big meltdowns even bigger. For $35. Learn how to use Chromecast with Netflix and more at google.com/chromecast.",
            source: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
            subtitle: "By Google",
            thumb: "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerMeltdowns.jpg",
            title: "For Bigger Meltdowns",
            bookmark: 0,
            like: 0,
            views: 0
        },

        {
            id: 7,
            description: "Sintel is an independently produced short film, initiated by the Blender Foundation as a means to further improve and validate the free/open source 3D creation suite Blender. With initial funding provided by 1000s of donations via the internet community, it has again proven to be a viable development model for both open 3D technology as for independent animation film.\nThis 15 minute film has been realized in the studio of the Amsterdam Blender Institute, by an international team of artists and developers. In addition to that, several crucial technical and creative targets have been realized online, by developers and artists and teams all over the world.\nwww.sintel.org",
            source: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
            subtitle: "By Blender Foundation",
            thumb: "https://storage.googleapis.com/gtv-videos-bucket/sample/images/Sintel.jpg",
            title: "Sintel",
            bookmark: 0,
            like: 0,
            views: 0
        },

        {
            id: 8,
            description: "Smoking Tire takes the all-new Subaru Outback to the highest point we can find in hopes our customer-appreciation Balloon Launch will get some free T-shirts into the hands of our viewers.",
            source: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
            subtitle: "By Garage419",
            thumb: "https://storage.googleapis.com/gtv-videos-bucket/sample/images/SubaruOutbackOnStreetAndDirt.jpg",
            title: "Subaru Outback On Street And Dirt",
            bookmark: 0,
            like: 0,
            views: 0
        },

        {
            id: 9,
            description: "Tears of Steel was realized with crowd-funding by users of the open source 3D creation tool Blender. Target was to improve and test a complete open and free pipeline for visual effects in film - and to make a compelling sci-fi film in Amsterdam, the Netherlands.  The film itself, and all raw material used for making it, have been released under the Creatieve Commons 3.0 Attribution license. Visit the tearsofsteel.org website to find out more about this, or to purchase the 4-DVD box with a lot of extras.  (CC) Blender Foundation - http://www.tearsofsteel.org",
            source: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
            subtitle: "By Blender Foundation",
            thumb: "https://storage.googleapis.com/gtv-videos-bucket/sample/images/TearsOfSteel.jpg",
            title: "Tears of Steel",
            bookmark: 0,
            like: 0,
            views: 0
        },
        {
            id: 10,
            description: "The Smoking Tire heads out to Adams Motorsports Park in Riverside, CA to test the most requested car of 2010, the Volkswagen GTI. Will it beat the Mazdaspeed3's standard-setting lap time? Watch and see...",
            source: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
            subtitle: "By Garage419",
            thumb: "https://storage.googleapis.com/gtv-videos-bucket/sample/images/VolkswagenGTIReview.jpg",
            title: "Volkswagen GTI Review",
            bookmark: 0,
            like: 0,
            views: 0
        },

        {
            id: 11,
            description: "The Smoking Tire is going on the 2010 Bullrun Live Rally in a 2011 Shelby GT500, and posting a video from the road every single day! The only place to watch them is by subscribing to The Smoking Tire or watching at BlackMagicShine.com",
            source: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
            subtitle: "By Garage419",
            thumb: "https://storage.googleapis.com/gtv-videos-bucket/sample/images/WeAreGoingOnBullrun.jpg",
            title: "We Are Going On Bullrun",
            bookmark: 0,
            like: 0,
            views: 0
        },

        {
            id: 12,
            description: "The Smoking Tire meets up with Chris and Jorge from CarsForAGrand.com to see just how far $1,000 can go when looking for a car.The Smoking Tire meets up with Chris and Jorge from CarsForAGrand.com to see just how far $1,000 can go when looking for a car.",
            source: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4",
            subtitle: "By Garage419",
            thumb: "https://storage.googleapis.com/gtv-videos-bucket/sample/images/WhatCarCanYouGetForAGrand.jpg",
            title: "What care can you get for a grand?",
            bookmark: 0,
            like: 0,
            views: 0
        }
    ];

    // const [videoID, setVideoID] = useState(0);

    const handleClickEvent = (e, index) => {
        console.log(video_list[index].source);
        setVideosrc(video_list[index].source);
    }

    // const maxIndex = video_list?.length;

    return (
        <Scroller direction="vertical">
            {
                video_list.map((item, index) => (
                    <ImageItem
                        inline
                        key={index}
                        label={item.subtitle}
                        src={item.thumb}
                        // onClick={handleClickEvent({ index: index })}
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