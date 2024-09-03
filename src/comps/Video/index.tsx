import React, { useEffect, useImperativeHandle, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import './reset-video.css';

export default React.forwardRef(function FushuVideo(props: any, ref) {
  const videoNode = useRef(null);
  const player = useRef(null);

  useImperativeHandle(ref, () => ({
    videoNode: videoNode,
    player: player,
  }));

  useEffect(() => {
    if (player.current) {
      player.current.reset();
      player.current.src(props.sources);
      player.current.load();
      return;
    }
    player.current = videojs(videoNode.current, {
      isFullscreen: true,
      autoplay: true,
      controls: true,
      ...props,
    });
    console.log('🚀 ~ file: index.tsx ~ line 19 ~ useEffect ~ props', props);
    return () => {
      // player.current.pause();
      console.log('destroy', player.current);
    };
  }, []);

  return (
    <>
      <div data-vjs-player>
        <video
          style={{ width: props.width ?? '100vw', maxHeight: '50vh' }}
          ref={videoNode}
          className="video-js vjs-big-play-centered"></video>
      </div>
    </>
  );
});
